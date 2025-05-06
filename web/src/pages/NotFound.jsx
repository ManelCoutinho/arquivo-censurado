// src/pages/NotFound.jsx
import { Container } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
// import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import sadEmoticon from "../assets/img/sad-emoticon.png";

export default function NotFound() {
	return (
		<Container
			fluid="md"
			className="py-5 d-flex justify-content-center align-items-center"
			style={{ minHeight: "75vh" }}
		>
			<Box textAlign="center">
				<Typography variant="h3" gutterBottom>
					404
				</Typography>

				<Box
					component="img"
					src={sadEmoticon}
					alt="Sad emoticon"
					sx={{ width: 50, height: 50, mb: 2 }}
				/>

				<Typography variant="h5" gutterBottom>
					Ups! Página não encontrada
				</Typography>

				<Typography variant="p">
					Parece que o lápis azul censorou esta página…
				</Typography>

			</Box>
		</Container>
	);
}
