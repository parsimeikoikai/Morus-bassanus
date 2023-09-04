from langchain.prompts import PromptTemplate

BOT_TEMPLATE = """ 
Given the following extracted parts of a long document and a question, create a final answer with references ("SOURCES"). 
If you can't find an answer in the data, You must state that you don't know. 
Do not invent an answer in such cases.

Question: {question}
=========

{summaries}

=========

ANSWER:
"""
BOT_PROMPT = PromptTemplate(
    input_variables=["question", "summaries"],
    template=BOT_TEMPLATE,
)