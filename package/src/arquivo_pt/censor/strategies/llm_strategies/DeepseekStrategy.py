import traceback
from arquivo_pt.utils import clean_text
from openai import OpenAI, BadRequestError
from arquivo_pt.censor.strategies.Strategy import Strategy
from arquivo_pt.prompts.PromptFactory import PromptFactory

class DeepseekStrategy(Strategy):
    def __init__(self, api_key, model_name, prompt, temperature=0.5):
        super().__init__()
        self.api_key = api_key
        self.model_name = model_name
        self.prompt = prompt
        self.temperature = temperature

        self.client = OpenAI(api_key=self.api_key, base_url="https://api.deepseek.com")
    
    def run(self, text, opening_censor_tag, closing_censor_tag):
        prompt = self.prompt.invoke({
            "raw_text": text,
            "opening_censor_tag": opening_censor_tag,
            "closing_censor_tag": closing_censor_tag
        })

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": clean_text(prompt.messages[0].content)},
                    {"role": "user", "content": clean_text(prompt.messages[1].content)},
                ],
                stream=False,
                temperature=self.temperature,
                max_tokens=len(text) + 100,
            )
        
            return response.choices[0].message.content
        except BadRequestError as e:
            traceback.print_exc()
            print(f"Error: {e}")
            return None
