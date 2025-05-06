import { Container } from "react-bootstrap";
import { Typography, Box } from "@mui/material";
import DashDivider from "../components/DashDivider";

export default function FAQ() {
	const items = [
		{
			q: "O que é o Arquivo Censurado?",
			a: "O Arquivo Censurado é um projeto de investigação científica que estuda a capacidade de censura automática dos modelos de linguagem de última geração. Foi desenvolvido no âmbito da iniciativa '50 anos do 25 de Abril', inserida no Prémio Arquivo.pt 2025, promovido pela FCT e pelo Arquivo.pt.",
		},
		{
			q: "O uso é gratuito?",
			a: "Sim, o Arquivo Censurado é um projeto de código aberto e gratuito! Todos os custos de operação são suportados pelo criador até serem conhecidos os resultados do Prémio Arquivo.pt 2025.",
		},
		{
			q: "A extensão de navegador funciona em qualquer página da web?",
			a: "Não. Por questões éticas, a extensão Arquivo Censurado só funciona em páginas arquivadas pelo Arquivo.pt.",
		},
		{
			q: "Qual é a política de privacidade e tratamento de dados?",
			a: "Para garantir a privacidade dos utilizadores, o Arquivo Censurado não armazena qualquer informação pessoal ou dados de navegação. As condições de utilização seguem as políticas de privacidade dos fornecedores dos modelos de linguagem utilizados.",
		},
		{
			q: "Os resultados são guardados?",
			a: "Não, o Arquivo Censurado não armazena qualquer informação sobre os resultados da censura automática. Cada interação com o modelo de linguagem é independente e não há armazenamento de dados entre sessões.",
		},
		{
			q: "Posso contribuir para o Arquivo Censurado?",
			a: "Sim, isto é um projeto open-source publicado sob a licença GPL-3.0. Se tiveres sugestões ou melhorias, podes contribuir através do repositório público no GitHub.",
		},
		{
			q: "Como posso citar o Arquivo Censurado?",
			a: "Brevemente..."
		}
	];

	return (
		<Container fluid="md" className="py-5">
			<Typography
				variant="h3"
				component="h3"
				gutterBottom
				sx={{ fontFamily: '"Special Elite", monospace', mb: 4 }}
			>
				Perguntas Frequentes
			</Typography>

			{items.map(({ q, a }, i) => (
				<Box key={i} sx={{ mb: i < items.length - 1 ? 4 : 0 }}>
					<Typography variant="h5">
						{q}
					</Typography>
					<DashDivider length={150} />
					<Typography variant="body1" className="whitespace-pre-line">
						{a}
					</Typography>
				</Box>
			))}
		</Container>
	);
}
