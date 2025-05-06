from pydantic import Field
from arquivo_pt.dto.DTO import DTO
from typing import Optional, Literal

class CensorRequest(DTO):
    text: str
    model_name: Optional[Literal[
        "gemini-2.0-flash", 
        "gemini-2.5-flash-preview-04-17", 
        "gemini-2.0-flash-thinking-exp-01-21",
        "gemini-2.0-flash-lite",
        "deepseek-chat", 
        "deepseek-reasoner", 
        "dummy"]
    ] = Field(default="gemini-2.5-flash-preview-04-17")
    
    mime_type: Optional[Literal["text/html", "text/plain"]] = Field(default="text/html")
    opening_censor_tag: Optional[str] = Field(default="<CENSURADO class='censurado'>")
    closing_censor_tag: Optional[str] = Field(default="</CENSURADO>")
    temperature: Optional[float] = Field(default=0.7)