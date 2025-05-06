from abc import ABC
from arquivo_pt.dto.responses.CensorResponse import CensorResponse

class Strategy(ABC):
    def run(self, text: str, opening_censor_tag: str, closing_censor_tag:str, *args, **kwargs) -> CensorResponse:
        raise NotImplementedError("The run method must be implemented in the subclass.")