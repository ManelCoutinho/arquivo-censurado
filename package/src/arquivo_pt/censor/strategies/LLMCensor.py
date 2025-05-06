from arquivo_pt.censor.strategies.Strategy import Strategy
class LLMCensor(Strategy):
    def __init__(self, strategy):
        super().__init__()       
        self.strategy = strategy 
        
    def run(self, text:str, opening_censor_tag: str, closing_censor_tag:str) -> str:
        return self.strategy.run(text, opening_censor_tag, closing_censor_tag)