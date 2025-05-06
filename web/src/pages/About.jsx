import { Container } from "react-bootstrap";
import { Typography } from "@mui/material";
import DashDivider from "../components/DashDivider";
import LinkWithDash from "../components/LinkWithDash";


export default function About() {

	return (
		<Container fluid="md" className="py-5 text-start">
			<Typography variant="h3" component="h3" gutterBottom>
				Sobre o projecto
			</Typography>
			
			<Typography gutterBottom>
				O <span className="text-primary fw-bold">Arquivo Censurado</span> é um projeto de investigação provocador, desenvolvido no âmbito da iniciativa "25 de Abril e a Democracia", promovida pelo <LinkWithDash href="https://sobre.arquivo.pt/pt/colabore/premios-arquivo-pt/premio-arquivo-pt-2025/" target="_blank" rel="noreferrer">Prémio Arquivo.PT</LinkWithDash> 2025.
				O seu objetivo é simples mas urgente: sensibilizar as pessoas para os perigos da censura digital nesta nova era da inteligência artificial.
			</Typography>
			<Typography gutterBottom>
				Num tempo em que a tecnologia avança mais depressa do que o debate público que a acompanha, queremos lançar um alerta: será que os modelos de linguagem mais recentes — os mesmos que hoje nos ajudam a escrever, traduzir ou pesquisar — não podem também ser usados para apagar ideias, reescrever a história ou silenciar opiniões?
			</Typography>
			
			<DashDivider length={150} className="my-4"/>

			<Typography variant="h5" component="h5" gutterBottom>
				Como funciona?
			</Typography>

			<Typography gutterBottom>
				Os utilizadores podem experimentar o Arquivo Censurado diretamente nesta aplicação web ou através da extensão desenvolvida para os principais navegadores (Chrome, Firefox e Safari).
				Quando escreves um texto ou visitas uma página, a nossa API comunica com modelos de linguagem treinados em diversos contextos — e simula como seria a sua resposta se estivessem ao serviço de um regime autoritário.
			</Typography>

			<Typography variant="h5" component="h5" gutterBottom sx={{ mt: 2 }}>
				A extensão do navegador
			</Typography>
			
			<Typography gutterBottom>
				A extensão é a forma mais imersiva de usar o Arquivo Censurado. Com ela, podes navegar pelas páginas históricas alojadas no <LinkWithDash href="https://arquivo.pt/" target="_blank" rel="noreferrer">Arquivo.PT</LinkWithDash> e ver, em tempo real, o que seria "apagado" pela censura. É uma viagem inquietante pelo passado — e talvez um aviso sobre o futuro.
			</Typography>

			<DashDivider length={150} className="my-4" />

			<Typography variant="h5" component="h5" gutterBottom>
				Os impactos sociais e éticos do Arquivo Censurado
			</Typography>

			<Typography gutterBottom>
				Para uma democracia funcional o debate sobre inteligência artificial deve ir muito além das promessas de eficiência e produtividade. 
				É urgente refletir sobre como estas tecnologias podem ser usadas para moldar (ou distorcer) a memória coletiva, controlar a informação e limitar a liberdade de expressão.<br/>
				O <span className="text-primary fw-bold">Arquivo Censurado</span> cruza duas realidades fundamentais das democracias contemporâneas: o acesso à informação e o risco de censura. Pretende, assim, contribuir para essa discussão, de forma aberta, crítica e informada.<br/>
				Os exemplos de censura aqui apresentados são meramente ilustrativos tendo sido retirados aleatoriamente de páginas arquivadas pelo <LinkWithDash href="https://arquivo.pt/" target="_blank" rel="noreferrer">Arquivo.PT</LinkWithDash>.
			</Typography>

		</Container>
	)

}
