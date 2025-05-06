from arquivo_pt.censor.strategies.Strategy import Strategy

class Censor:
    def __init__(self, strategy:Strategy):
        self.strategy = strategy

    def run(self, text: str, *args, **kwargs) -> str:
        return self.strategy.run(text, *args, **kwargs)