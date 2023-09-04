import logging

from ..configs.schemas import *
from ..agent.bot import QA
from ..logging import setup_logger

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException

setup_logger()
logger = logging.getLogger(__name__)
objects = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    objects["bot"] = QA()
    yield


app = FastAPI(lifespan=lifespan)


@app.post("/ask")
async def root(data: Query) -> Answer:
    """
     This endpoint returns takes a user query an returns an answer from LLM.

     input: 
     {
     "query": str: user query,
     }

     outputs: 
    {   "answer": str: model answer to the query,
        "sources": List[str]: sources used to get the answer
    }
    """
    try:
        res = objects["bot"](query=data.query)
        return Answer(**res)
    
    except Exception as e:
        logger.exception("Error during answering")
        raise HTTPException(status_code=500, detail="Couldn't answer the query, please check server logs for more "
                                                    "details.")


@app.post("/retrieve")
def retrieve(data: Query):
    """
     This endpoint returns takes a user query an returns the sources relevant to the query.

     input: 
     {
     "query": str: user query,
     }

     outputs: 
    {  
     [ 
        "page_content": str: the source text content,
        "sources": Dict(): meta data stored with the document
     ]
    }
    """
    try:
        res = objects["bot"].retrieve(query=data.query)
        return res
    except Exception as e:
        logger.exception("Error during retrieving")
        raise HTTPException(status_code=500, detail="Couldn't retrieve sources for the query, please check server logs for more "
                                                    "details.")