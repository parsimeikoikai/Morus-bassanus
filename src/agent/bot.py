import yaml
import logging
import weaviate

from ..configs.definitions import CONFIG_PATH
from .prompts import BOT_PROMPT
from ..settings import get_settings
from ..logging import setup_logger

from langchain.chat_models import ChatOpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.retrievers import WeaviateHybridSearchRetriever
from langchain.chains import RetrievalQA

setup_logger()
logger = logging.getLogger(__name__)

class QA:
    def __init__(self):

        with open(CONFIG_PATH, 'r') as stream:
            try:
                configs = yaml.safe_load(stream)
            except yaml.YAMLError:
                logger.exception("couldn't load model config file")
                raise yaml.YAMLError
            
        self.llm = ChatOpenAI(openai_api_key=get_settings().openai_api_key, **configs['OpenAI'])
        client = weaviate.Client(url=configs["weaviate_url"], timeout_config=1000, startup_period=15)
        self.retrieval = WeaviateHybridSearchRetriever(client=client, **configs["weaviate"])

        self.from_chain = load_qa_with_sources_chain(llm=self.llm, **configs['chain'], prompt = BOT_PROMPT)
        self.chain = RetrievalQA(combine_documents_chain=self.from_chain, return_source_documents=True,
                                 retriever=self.retrieval)

    def retrieve(self, query):
        docs = self.retrieval.get_relevant_documents(query)
        return docs

    def __call__(self, query):
        res = self.chain({"query": query})
        logger.info(res)
        answer = res['result']
        sources = res["source_documents"]
        return {"answer": answer.strip(), "sources": [x.metadata["source"] for x in sources]}
    