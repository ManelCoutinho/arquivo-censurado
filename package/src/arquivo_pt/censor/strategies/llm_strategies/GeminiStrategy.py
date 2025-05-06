from environs import Env
from google import genai
from google.genai import types
from arquivo_pt.utils import clean_text
from arquivo_pt.censor.strategies.Strategy import Strategy
from arquivo_pt.prompts.PromptFactory import PromptFactory

class GeminiStrategy(Strategy):
    def __init__(self, api_key, model_name, prompt, temperature=0.7):
        self.client = genai.Client(
            api_key=api_key
        )
        self.model_name = model_name 
        self.temperature = temperature
        self.prompt = prompt

    def run(self, text, opening_censor_tag, closing_censor_tag):
        prompt = self.prompt.invoke({
            "raw_text": text,
            "opening_censor_tag": opening_censor_tag,
            "closing_censor_tag": closing_censor_tag
        })
        
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=clean_text(prompt.messages[1].content))
                ]
            )
        ]

        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
            system_instruction=[
                types.Part.from_text(text=clean_text(prompt.messages[0].content)),
            ],
            temperature=self.temperature,
            thinking_config=types.ThinkingConfig(
                include_thoughts=True if self.model_name == 'gemini-2.5-flash-preview-04-17' else False,
                thinking_budget=1024,
            ) if self.model_name == 'gemini-2.5-flash-preview-04-17' else None,
            max_output_tokens=len(prompt.messages[1].content) + 256,
        )
        
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=contents,
            config=generate_content_config
        )

        return response.text
