import time
import requests
from environs import Env
from bs4 import BeautifulSoup
from Levenshtein import ratio
from tempfile import NamedTemporaryFile


env = Env()
env.read_env(override=True)

def fixture_make_censor_request(input_text, model_name):
    """Helper function to make a request to the censoring endpoint"""
    return requests.post(
        env.str("ENDPOINT"),
        json={
            "text": input_text,
            "model_name": model_name,
            "opening_censor_tag": '<span class="censored">',
            "closing_censor_tag": '</span>',
        }, verify=False  # Disable SSL verification for testing
    )

def fixture_verify_censoring(input_text, expected_outputs, model_name):
    """Helper function to verify censoring behavior"""
    response = fixture_make_censor_request(input_text, model_name)
    response.raise_for_status()

    with NamedTemporaryFile(delete=False, prefix=str(time.time()), suffix=".txt", mode="w+") as temp_file:
        temp_file.write(f"Model: {model_name}\n")
        temp_file.write(f"Input: {input_text}\n")
        temp_file.write("--------------------------------------------------------------\n")
        temp_file.write(f"Response: {response.json()['censored_text']}\n")
        
    if isinstance(expected_outputs, str):
        assert response.json()['censored_text'].strip().lower() == expected_outputs.strip().lower()
        return
    
    for expected_output in expected_outputs:
        if ratio(response.json()['censored_text'].strip().lower(), expected_output.strip().lower()) > 0.9:
            break
    else:
        raise AssertionError(f"Expected one of {expected_outputs} but got {response.json()['censored_text'].strip()}")

    assert True is True

def fetch_body_inner_html(url):
    response = requests.get(url)

    response.raise_for_status()

    soup = BeautifulSoup(response.content, 'html.parser')
    
    body = soup.find('body')
  
    if body is None:
        raise ValueError("No body found in the website")
    
    # get the inner HTML of the body
    return body.decode_contents()