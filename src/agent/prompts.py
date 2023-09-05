from langchain.prompts import PromptTemplate

BOT_TEMPLATE = """ 
Answer the following question based on the provided news articles from the humanitarian section, which discuss global crises and problems.
Ensure that your responses are factual and comprehensive, and cite information directly from the articles.
In the event that a direct answer is not available in the articles, You must state that you don't know.
It is extremely important to not provide any information that isn't mentioned in the articles.


Question: {question}
=========

{context}

=========

ANSWER:
"""
BOT_PROMPT = PromptTemplate(
    input_variables=["question", "context"],
    template=BOT_TEMPLATE,
)