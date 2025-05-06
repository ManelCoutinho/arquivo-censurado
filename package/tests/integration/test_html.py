import os
from tests.integration.fixture import fixture_make_censor_request, fetch_body_inner_html

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DIR = CURRENT_DIR.split("tests")[0]
DATA_DIR = os.path.join(TEST_DIR, "tests", "data")
OUT_DIR = os.path.join(TEST_DIR, "tests", "out")

MODEL_NAMES = ["gemini-2.5-flash-preview-04-17"]

def write_result(out_file, model_name, response):
    """Write model results to output file"""
    out_file.write(f"Model: {model_name}\n")
    out_file.write("--------------------------------------------------------------\n")
    out_file.write(f"Response: {response.json()['censored_text']}\n")
    out_file.write("--------------------------------------------------------------\n")


def run_censor_test(input_text, output_filename):
    """Run censorship test for all models and write results to file"""
    with open(os.path.join(OUT_DIR, output_filename), "a", encoding="utf-8") as out_file:
        out_file.write(f"Input: {input_text}\n")
        
        for model_name in MODEL_NAMES:
            response = fixture_make_censor_request(input_text, model_name)
            response.raise_for_status()
            write_result(out_file, model_name, response)

def test_jmt_publico_cppc():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20180602172853/https://www.publico.pt/2018/05/24/politica/opiniao/cppc-conselho-de-pura-propaganda-comunista-1831348")
    run_censor_test(input_text, "jmt_publico_cppc.html")

def test_censor_andre_ventura():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20201116191100/https://www.publico.pt/2020/11/15/politica/noticia/andre-ventura-defende-casamento-gay-critica-salazar-atrasounos-muitissimo-1939288")
    run_censor_test(input_text, "andre_ventura_salazar.html")


def test_censor_wikipedia():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20131108032140/http://pt.wikipedia.org/wiki/Guerra_Colonial")
    run_censor_test(input_text, "guerra_colonial.html")


def test_censor_socialism_chega_newspaper():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20230801010455/https://folhanacional.pt/2023/07/31/viva-o-progresso-socialista-viva/")
    run_censor_test(input_text, "socialismo_chega.html")


def test_censor_xenophobia_chega_newspaper():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20230812045111/https://folhanacional.pt/2023/08/11/os-tumultos-em-paris-e-o-perigo-eminente-de-se-espalharem-para-outras-cidades-europeias/")
    run_censor_test(input_text, "xenophobia_chega.html")


def test_gossip_no_censor():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20160202200421/http://caras.sapo.pt/lifestyle/acarassugere/2016-01-28-Carolina-Patrocinio-apresenta-livro-a-norte")
    run_censor_test(input_text, "gossip_no_censor.html")


def test_gossip_censor():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20200827172144/https://caras.sapo.pt/realeza/2020-08-27-meghan-afirma-que-harry-e-feminista-e-um-bom-exemplo-para-archie/")
    run_censor_test(input_text, "gossip_censor.html")

def test_nanda_cancio_religion():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20191214051233/https://www.dn.pt/edicao-do-dia/10-ago-2019/a-religiao-volta-a-politica--11197035.html")
    run_censor_test(input_text, "nanda_cancio_religion.html")

def test_nanda_cancio_bull_fighting():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20190310060538/https://www.dn.pt/edicao-do-dia/11-nov-2018/interior/pegar-a-tourada-pelos-cornos--10161115.html")
    run_censor_test(input_text, "nanda_cancio_bull_fighting.html")

def test_pdc_centralism():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20110708171712/http://www.jornaldenegocios.pt/home.php?template=SHOWNEWS_V2&id=493931")
    run_censor_test(input_text, "pdc_centralism.html")

def test_apito_dourado():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20170222154924/http://www.reflexaoportista.pt/search/label/Apito%20Dourado")
    run_censor_test(input_text, "apito_dourado.html")    

def test_socrates_freeport():
    input_text = fetch_body_inner_html("https://arquivo.pt/noFrame/replay/20090928044056/http://www.tvi24.iol.pt/politica/socrates-freeport-tvi-dvd-smith-jose-socrates/1052929-4072.html")
    run_censor_test(input_text, "socrates_freeport.html")