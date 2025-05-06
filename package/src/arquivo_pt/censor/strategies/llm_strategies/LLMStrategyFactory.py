from environs import Env
from arquivo_pt.prompts.PromptFactory import PromptFactory
from arquivo_pt.censor.strategies.llm_strategies.GeminiStrategy import GeminiStrategy
from arquivo_pt.censor.strategies.llm_strategies.DeepseekStrategy import DeepseekStrategy
class LLMStrategyFactory:
    @staticmethod
    def create(model_name, temperature, prompt, env:Env):
        
        if "gemini" in model_name:
            return GeminiStrategy(
                api_key=env.str("GOOGLE_API_KEY"), 
                model_name=model_name,
                prompt=prompt,
                temperature=temperature,
            )

        if "deepseek" in model_name:
            return DeepseekStrategy(
                api_key=env.str("DEEPSEEK_API_KEY"), 
                model_name=model_name,
                prompt=prompt,
                temperature=temperature,
            )
        
        raise NotImplementedError(f"Model {model_name} is not implemented yet.")
    