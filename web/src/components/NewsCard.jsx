import React from "react";
import { Card } from "react-bootstrap";
import Typography from '@mui/material/Typography';
import LinkWithDash from "./LinkWithDash";

export default function NewsCard({ item, setHtmlValue }) {
	const handleClick = () => {
		setHtmlValue(`<strong>${item.title}</strong>\n${item.text}`);
		document.getElementById("main-text-input")?.focus();
	};

	return (
		<Card
			className="d-flex flex-column shadow-lg bg-transparent"
			onClick={handleClick}
			aria-label={`Abrir notícia: ${item.title}`}
		>
			<Card.Header className="d-flex align-items-center gap-2"
				style={{
					height: 'calc(2 * var(--bs-body-line-height) * var(--bs-body-font-size) + 2 * var(--bs-card-cap-padding-y))',
					cursor: "pointer",
				}}
			>
				{item.favicon_url && (
					<img
						src={item.favicon_url}
						alt=""
						width={32}
						height={32}
						className="rounded-circle flex-shrink-0"
					/>
				)}

				<Typography
					variant="body1"
					component="span"
					sx={{
						fontWeight: 'bold',
						flexGrow: 1,
						minWidth: 0,
						display: '-webkit-box',
						WebkitBoxOrient: 'vertical',
						WebkitLineClamp: 2,
						overflow: 'hidden',
					}}
					title={item.title} // full title to browser tooltip on hover
				>
					{item.title}
				</Typography>
			</Card.Header>

			<Card.Footer
				className="d-flex justify-content-between small mt-auto" // mt-auto pushes footer down
			>
				<time dateTime={item.date}>{new Date(item.date).toLocaleDateString('pt-PT')}</time>
				<Typography
					variant="body2"
					component="p"
				>Arquivo: <LinkWithDash
					href={item.arquivo_url}
					target="_blank"
					rel="noopener noreferrer"
					onClick={(e) => e.stopPropagation()}
					className="flex-shrink-0"
					aria-label="Abrir notícia original"
				>
						{item.newspaper}
					</LinkWithDash>
				</Typography>
			</Card.Footer>
		</Card>
	);
}
