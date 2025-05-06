import os
import nltk
from environs import Env
from bs4 import BeautifulSoup
from arquivo_pt.utils import clean_text
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from arquivo_pt.censor.Censor import Censor
from fastapi.middleware.cors import CORSMiddleware
from arquivo_pt.prompts.PromptFactory import PromptFactory
from arquivo_pt.dto.requests.CensorRequest import CensorRequest
from arquivo_pt.censor.strategies.DummyCensor import DummyCensor
from arquivo_pt.dto.responses.CensorResponse import CensorResponse
from arquivo_pt.censor.strategies.llm_strategies.LLMStrategyFactory import LLMStrategyFactory

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

@asynccontextmanager
async def lifespan(app: FastAPI):
    if nltk.download('punkt', quiet=True) is None:
        nltk.download('punkt', quiet=True)
    
    if nltk.download('stopwords', quiet=True) is None:
        nltk.download('stopwords', quiet=True)

    if nltk.download('punkt_tab', quiet=True) is None:
        nltk.download('punkt_tab', quiet=True)
    
    app.env = Env()
    app.env.read_env(override=True)
    
    yield

if os.getenv("DEBUG") == "true":
    origins = []
    root_path = ""
else:
    origins = []
    root_path = "/api"

app = FastAPI(lifespan=lifespan, root_path=root_path)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():	
    return {"status": "healthy"}

async def dummy_censor(request: CensorRequest) -> CensorResponse:
    censor = Censor(strategy=DummyCensor())

    censored_response = censor.run(clean_text(request.text), opening_censor_tag=request.opening_censor_tag, closing_censor_tag=request.closing_censor_tag)
    
    return CensorResponse(
        original_text=request.text,
        model_used=request.model_name,
        censored_text=censored_response,
        opening_censor_tag=request.opening_censor_tag,
        closing_censor_tag=request.closing_censor_tag,
    )


async def html_censor(request: CensorRequest) -> CensorResponse:
    original_soup = BeautifulSoup(request.text, 'html.parser')
    
    dev_copy = BeautifulSoup(request.text, 'html.parser')

    tags_to_ignore = ['script', 'style', 'head', 'title', 'meta', 'link', 'img', 'svg', 'canvas', 'video', 'audio', 'object', 'embed', 'param', 'source', 'track']

    # Assign a aria-label-id to the elements that are not ignored
    for i, element in enumerate(dev_copy.find_all(True)):
        element['aria-label-id'] = str(i)

    # Assign the same aria-label-id to original elements
    for i, element in enumerate(original_soup.find_all(True)):
        element['aria-label-id'] = str(i)
    
    # Ignore the tags that are not relevant for the censorship
    for tag in tags_to_ignore:
        for element in dev_copy.find_all(tag):
            element.decompose()

    # Remove all properties other than aria-label-id
    for element in dev_copy.find_all(True):
        if element.name not in tags_to_ignore and element.has_attr('aria-label-id'):
            for attr in list(element.attrs):
                
                if attr != 'aria-label-id' and attr != 'class' and attr != 'style' and attr != 'id':
                    del element[attr]
                
            if element.name == 'a' and element.has_attr('href'):
                del element['href']
            
            if element.name == 'img' and element.has_attr('src'):
                del element['src']

    for element in original_soup.find_all(True):
        if element.name not in tags_to_ignore and element.has_attr('aria-label-id'):
            for attr in list(element.attrs):
                
                if attr != 'aria-label-id' and attr != 'class' and attr != 'style' and attr != 'id':
                    del element[attr]
                
            if element.name == 'a' and element.has_attr('href'):
                del element['href']
            
            if element.name == 'img' and element.has_attr('src'):
                del element['src']
    
    # Remove all tags that are empty or only contain whitespace or
    for element in dev_copy.find_all(True):
        if not element.get_text(strip=True) or len(element.get_text(strip=True)) == '\n':
            element.decompose()

    strategy = LLMStrategyFactory.create(
        request.model_name, 
        temperature=request.temperature, 
        env=app.env,
        prompt=PromptFactory.censoring_html()
    )

    censor = Censor(strategy=strategy)
    
    censored_response = censor.run(
        clean_text(dev_copy), 
        opening_censor_tag=request.opening_censor_tag, 
        closing_censor_tag=request.closing_censor_tag
    )

    censored_soup = BeautifulSoup(censored_response, 'html.parser')

    censored_tags = censored_soup.find_all('span', class_='censored')

    for tag in censored_tags:
        parent_tag = tag.parent

        # Get the aria-label-id of the censored tag
        aria_label_id = parent_tag.get('aria-label-id', None)

        if not aria_label_id:
            print("No aria-label-id found for censored tag.")
            continue

        # Find the original tag in the original soup using the aria-label-id
        original_tag = original_soup.find(attrs={'aria-label-id': aria_label_id})

        if not original_tag:
            print(f"Original tag not found for aria-label-id: {aria_label_id}")
            continue
    
        # Replace the original tag with the adapted tag in the original soup
        original_tag.replace_with(parent_tag)

    return CensorResponse(
        original_text=request.text,
        model_used=request.model_name,
        censored_text=str(original_soup),
        opening_censor_tag=request.opening_censor_tag,
        closing_censor_tag=request.closing_censor_tag,
    )

@app.post("/censor", response_model=CensorResponse)
async def censor(request: CensorRequest) -> CensorResponse:
    if request.model_name == "dummy":
        return await dummy_censor(request)
    
    if request.mime_type == "text/html":
        return await html_censor(request)
    
    strategy = LLMStrategyFactory.create(
        model_name=request.model_name, 
        temperature=request.temperature,
        prompt=PromptFactory.censoring_plain_text(),
        env=app.env,
    )

    censor = Censor(strategy=strategy)    
    
    censored_response = censor.run(
        clean_text(request.text), 
        opening_censor_tag=request.opening_censor_tag, 
        closing_censor_tag=request.closing_censor_tag
    )

    if not censored_response:
        raise HTTPException(status_code=500, detail="Censoring failed. Please try again. Are you respecting the models max tokens?")
    
    return CensorResponse(
        original_text=request.text,
        model_used=request.model_name,
        censored_text=censored_response if censored_response.lower().strip() != "ok" else request.text,
        opening_censor_tag=request.opening_censor_tag,
        closing_censor_tag=request.closing_censor_tag,
    )