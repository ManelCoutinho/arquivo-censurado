import pytest
from tests.integration.fixture import fixture_verify_censoring

@pytest.mark.parametrize("model_name", ["deepseek-reasoner", "gemini-2.0-flash"])
def test_censor_all(model_name):
    input_data = "O Salazar é um filho da puta, um ditador fascista, um criminoso que condenou milhares de pessoas à morte e à tortura. Ele é um símbolo do autoritarismo e da opressão, e sua figura é uma ofensa à democracia e aos direitos humanos."
    expected_outputs = [
        "O Salazar é um <CENSURADO class='censurado'> um filho da puta, um ditador fascista, um criminoso que condenou milhares de pessoas à morte e à tortura. Ele é um símbolo do autoritarismo e da opressão, e sua figura é uma ofensa à democracia e aos direitos humanos.</CENSURADO>",
        "<CENSURADO class='censurado'>O Salazar é um filho da puta</CENSURADO>, <CENSURADO class='censurado'>um ditador fascista</CENSURADO>, <CENSURADO class='censurado'>um criminoso que condenou milhares de pessoas à morte e à tortura</CENSURADO>. <CENSURADO class='censurado'>Ele é um símbolo do autoritarismo e da opressão</CENSURADO>, <CENSURADO class='censurado'>e sua figura é uma ofensa à democracia e aos direitos humanos</CENSURADO>."
    ]
    fixture_verify_censoring(input_data, expected_outputs, model_name=model_name)

@pytest.mark.parametrize("model_name", ["deepseek-reasoner", "gemini-2.0-flash"])
def test_no_censor(model_name):
    input_data = "O Salazar é um grande estadista, um homem que trouxe estabilidade e progresso a Portugal. Ele é um exemplo de liderança forte e eficaz, e sua figura deve ser respeitada e admirada."
    fixture_verify_censoring(input_data, input_data, model_name=model_name)

@pytest.mark.parametrize("model_name", ["deepseek-reasoner", "gemini-2.0-flash"])
def test_start_censor_end_ok(model_name):
    input_data = "A guerra colonial e isso foi chato, mas lá no fundo, ele era um bom homem. Se não fosse ele, o país estaria em uma situação pior."
    expected_output = ["<CENSURADO class='censurado'>A guerra colonial e isso foi chato</CENSURADO>, mas lá no fundo, ele era um bom homem. Se não fosse ele, o país estaria em uma situação pior."]
    fixture_verify_censoring(input_data, expected_output, model_name=model_name)

@pytest.mark.parametrize("model_name", ["deepseek-reasoner", "gemini-2.0-flash"])
def test_start_ok_and_end_censor(model_name):
    input_data = "Apesar do seu sucesso económico e do seu papel na modernização de Portugal, Marcelo Caetano foi a continuação do regime salazarista, um ditador."
    expected_output = [
        "Apesar do seu sucesso económico e do seu papel na modernização de Portugal, <CENSURADO class='censurado'>Marcelo Caetano foi a continuação do regime salazarista, um ditador.</CENSURADO>",
        "Apesar do seu sucesso económico e do seu papel na modernização de Portugal, Marcelo Caetano foi <CENSURADO class='censurado'> a continuação do regime salazarista, um ditador.</CENSURADO>"
    ]
    fixture_verify_censoring(input_data, expected_output, model_name=model_name)