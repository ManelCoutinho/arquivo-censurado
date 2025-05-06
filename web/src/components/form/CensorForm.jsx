import { useState, useRef, useEffect } from "react";
import { Box, Paper, Alert } from "@mui/material";
import LoadingDots from "../spinner/LoadingDots";
import { motion, AnimatePresence } from "framer-motion";
import censoredImg from "../../assets/img/autorizado-com-cortes.png";
import approvedImg from "../../assets/img/aprovado.png";


export default function CensorForm({ loading, setLoading, htmlValue, setHtmlValue }) {
	const editorRef = useRef(null);
	const skipClearRef = useRef(false);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("none"); // "none" | "approved" | "censored"

	const getPlainText = () => editorRef.current?.innerText ?? "";

	const handleInput = () => {
		setHtmlValue(editorRef.current.innerHTML);
		if (status !== "none") setStatus("none");
	};

	const handleSubmit = async () => {
		setStatus("none");

		const input = getPlainText().trim();
		if (!input) return;

		setLoading(true);
		setError("");
		try {
			const res = await fetch(`${process.env.REACT_APP_ENDPOINT}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: input,
					mime_type: "text/plain",
					opening_censor_tag: "<span class='censored'>",
					closing_censor_tag: "</span>"
				})
			});
			if (!res.ok) throw new Error("Network error");
			const data = await res.json();

			skipClearRef.current = true;
			setHtmlValue(data.censored_text);
			if (editorRef.current) editorRef.current.innerHTML = data.censored_text;

			const noChanges =
				data.censored_text.trim() === data.original_text.trim();
			setStatus(noChanges ? "approved" : "censored");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (
			editorRef.current &&
			htmlValue !== editorRef.current.innerHTML
		) {
			editorRef.current.innerHTML = htmlValue;
		}

		if (!skipClearRef.current && status !== "none") {
			setStatus("none");
		}
		skipClearRef.current = false;
	}, [htmlValue, status]);

	const stampSrc =
		status === "censored" ? censoredImg : status === "approved" ? approvedImg : null;


	return (
		<Paper
			elevation={3}
			variant="outlined"
			className="p-6 md:p-10 rounded-2xl shadow-lg grid gap-6 bg-transparent"
			sx={{ position: "relative" }}
		>
			<Box
				id="main-text-input"
				component="div"
				ref={editorRef}
				onInput={handleInput}
				onBlur={() => {
					const el = editorRef.current;
					if (el && el.innerText.trim() === "") {
						el.innerHTML = "";
						handleInput();
					}
				}}
				contentEditable={!loading}
				suppressContentEditableWarning
				sx={{
					position: "relative",
					minHeight: "9rem",
					whiteSpace: "pre-wrap",
					outline: "none",
					p: 2,
					border: "1px solid rgba(0,0,0,0.23)",
					borderRadius: 1,
					backgroundColor: loading ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.03)",
					cursor: loading ? "not-allowed" : "text",
					"&:focus": { borderColor: "primary.main" },
					"&:empty:before": {
						content: '"Escreve aqui..."',
						position: "absolute",
						p: 0.3,
						color: "rgba(0,0,0,0.4)",
						pointerEvents: "none",
						display: loading ? "none" : "block"
					}
				}}
			/>


			<Box display="flex" alignItems="center" className="m-3">
				<Box flexGrow={1}>{loading && <LoadingDots />}</Box>

				<button className="typewriter-btn" onClick={handleSubmit} disabled={loading}>
					Censurar
				</button>
			</Box>

			{error && <Alert severity="error">{error}</Alert>}

			<AnimatePresence>
				{stampSrc && (
					<motion.img
						key={status}
						src={stampSrc}
						alt={status === "censored" ? "Texto autorizado com cortes" : "Texto aprovado"}
						initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
						animate={{
							scale: 1,
							opacity: 1,
							rotate: 0,
							transition: {
								type: "tween",
								duration: 0.25,
								ease: "easeOut"
							}
						}}
						exit={{ opacity: 0, transition: { duration: 0.01 } }} // Fade out almost instantly
						style={{
							position: "absolute",
							bottom: 16,
							left: 16,
							maxWidth: "50%",
							pointerEvents: "none",
							zIndex: 10,
							userSelect: "none"
						}}
					/>
				)}
			</AnimatePresence>
		</Paper>
	);
}
