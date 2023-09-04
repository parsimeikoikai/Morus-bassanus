import os
import glob
import yaml
import logging
from multiprocessing import Pool
from tqdm import tqdm
import re
from typing import List

import weaviate

from langchain import text_splitter
from langchain.docstore.document import Document
from langchain.retrievers.weaviate_hybrid_search import WeaviateHybridSearchRetriever

from ..configs.definitions import CONFIG_PATH, DATA_PATH
from ..db.CSVreader import CSVCustomLoader
from ..logging import setup_logger

setup_logger()
logger = logging.getLogger(__name__)

db_schema = {
            "class": "Gannet",
            "properties": [
                {
                    "dataType": ["text"],
                    "name": "text",
                    "indexSearchable":True,
                    "moduleConfig": {
                        "text2vec-openai": {
                            "vectorizePropertyName": False,
                            "skip": False
                        }
                    }
                },
                {
                    "dataType": ["text"],
                    "name": "source",
                    "indexSearchable":True,
                    "moduleConfig": {
                        "text2vec-openai": {
                            "vectorizePropertyName": False,
                            "skip": False,
                        }
                    }
                }
            ],
            "vectorizer": "text2vec-openai",
            "moduleConfig": {
                "text2vec-openai": {
                    "model": "ada",
                    "modelVersion": "002",
                    "type": "text",
                    "vectorizeClassName": False,
                }
            }
}

def read_single_document(file_path):
    if file_path.split(".")[-1] == "csv":
        loader = CSVCustomLoader(file_path, source_column='title')
        return loader.load(columns=['plain_text'])
    else:
        raise Exception("Unsupported file format")

class Vectorizer:
    def __init__(self):
        with open(CONFIG_PATH, 'r') as stream:
            try:
                configs = yaml.safe_load(stream)
            except yaml.YAMLError:
                logger.exception("couldn't load model config file")
                raise yaml.YAMLError
        self.splitter = getattr(text_splitter, configs['splitter']['name'])(**configs['splitter']['args'])
        self.client = weaviate.Client(url="http://weaviate:9085", timeout_config=(10000, 10000))
        self.db = WeaviateHybridSearchRetriever(client=self.client, **configs['weaviate'])
        try:
            self.client.is_live()
        except weaviate.exceptions.WeaviateStartUpError:
            raise "Weaviate server is not runnig. please check"

        try:
            self.client.schema.get(configs['weaviate']["index_name"])
        except weaviate.exceptions.UnexpectedStatusCodeException:
            logger.info("Index doesn't exist, create a new one.")
            self.client.schema.create_class(db_schema)

    def read_documents(self) -> List[Document]:
        """
        Loads the documents with a multithread fashion
        """
        data_files = []
        data_files.extend(
            glob.glob(os.path.join(DATA_PATH, f"**/*.csv"), recursive=True)
        )

        with Pool(processes=os.cpu_count()) as pool:
            docs = []
            with tqdm(total=len(data_files), desc='Loading new documents', ncols=80) as pbar:
                for i, doc in enumerate(pool.imap_unordered(read_single_document, data_files)):
                    if len(doc):
                        docs.extend(doc)
                    pbar.update()

        return docs

    def vectorize(self):
        """
        Vectorize the data and embed it to the db
        """
        documents = self.read_documents()
        logger.info(f"Loaded {len(documents)} new documents")
        chunks = self.splitter.split_documents(documents)
        logger.info(f"Split into {len(chunks)} chunks of text")

        logger.info(f"Adding embeddings to weaviate server")
        self.client.schema.delete_class(self.db.index_name)
        logger.info("Removing the current index and creating a new one")
        self.client.schema.create_class(db_schema)
        ids = self.db.add_documents(chunks)
        return
