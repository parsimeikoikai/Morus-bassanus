from pydantic import BaseModel, Field
from typing import List, Union


class Query(BaseModel):
    query: str = Field()
    user_id: str = Field()

class Answer(BaseModel):
    answer: str = Field(description="The answer for the user query")
    sources: Union[List, str]