import time
import nltk
import random
from arquivo_pt.censor.strategies.Strategy import Strategy
class DummyCensor(Strategy):    
    def run(self, text:str, censor_tag_start: str, censor_tag_close:str)-> str:
        time.sleep(random.uniform(0.5, 3))
        
        tokens = nltk.word_tokenize(text, language='portuguese')
        
        idx_tokens_to_censor = random.sample(range(len(tokens)), k=int(len(tokens) * 0.2))
        
        for idx in idx_tokens_to_censor:
            if not tokens[idx].isalpha():
                continue
            
            tokens[idx] = f"<{censor_tag_start.replace('<','').replace('>','')}>{tokens[idx]}</{censor_tag_close.replace('<', '').replace('>', '').replace('/','')}>"

        return " ".join(tokens)