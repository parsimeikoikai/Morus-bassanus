import yaml
import logging
import weaviate
from pymongo import MongoClient
from bson import ObjectId
import json

from ..configs.definitions import CONFIG_PATH
from .prompts import BOT_PROMPT
from ..settings import get_settings
from ..logging import setup_logger

from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.retrievers import WeaviateHybridSearchRetriever, ContextualCompressionRetriever
from langchain.embeddings import OpenAIEmbeddings
from langchain.retrievers.document_compressors import EmbeddingsFilter
from langchain.chains import RetrievalQA, ConversationalRetrievalChain, LLMChain

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

        self.question_generation_llm = OpenAI(openai_api_key=get_settings().openai_api_key, temperature=0)
        self.llm = ChatOpenAI(openai_api_key=get_settings().openai_api_key, **configs['OpenAI'])

        client = weaviate.Client(url=configs["weaviate_url"], timeout_config=1000, startup_period=15)
        self.memory = MongoClient(configs["mongodb"]["url"])[configs["mongodb"]["db"]]

        self.question_generator = LLMChain(llm=self.question_generation_llm, prompt=CONDENSE_QUESTION_PROMPT)
        self.retrieval = WeaviateHybridSearchRetriever(client=client, **configs["weaviate"])
        embeddings = OpenAIEmbeddings(openai_api_key=get_settings().openai_api_key)
        embeddings_filter = EmbeddingsFilter(embeddings=embeddings, similarity_threshold=0.9)
        self.compression_retriever = ContextualCompressionRetriever(base_compressor=embeddings_filter, base_retriever=self.retrieval)

        self.from_chain = load_qa_with_sources_chain(llm=self.llm, **configs['chain'], prompt = BOT_PROMPT, document_variable_name="context")
        self.chain = ConversationalRetrievalChain(combine_docs_chain=self.from_chain, retriever=self.retrieval,
                    question_generator=self.question_generator,
                    return_source_documents=True,
                    output_key="result")

    def get_history(self, user_id, num_messages=5):
        """
        retrieves the chat history from Mongodb db given a user_id
        """
        collection = self.memory["messages"]
        cursor = collection.find({"sender": ObjectId(user_id)})
        history = []
        if cursor:
            for document in cursor[:num_messages]:
                history.append(HumanMessage(content=document["message"]["text"]))
                history.append(AIMessage(content=document["message"]["answer"]))
        logger.info(history)
        return history

    def retrieve(self, query):
        """
        retrieves the sources given a user query
        """
        docs = self.compression_retriever.get_relevant_documents(query)
        return docs

    def __call__(self, query, user_id):
        res = self.chain({"question": query, "chat_history": self.get_history(user_id)})
        answer = res['result']
        sources = res["source_documents"]
        return {"answer": answer.strip(), "sources": [x.metadata["source"] for x in sources]}

