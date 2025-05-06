from pydantic import Field
from typing import Optional
from arquivo_pt.dto.DTO import DTO

class CensorResponse(DTO):
    original_text: str
    model_used: str
    censored_text: str
    opening_censor_tag: str
    closing_censor_tag: str