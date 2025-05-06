import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

export default function LoadingDots() {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const id = setInterval(() => {
			setDots((d) => (d.length === 3 ? "" : d + "."));
		}, 450);                                  // adjust speed if you like
		return () => clearInterval(id);
	}, []);

	return (
		<Typography
			component="span"
			sx={{
				letterSpacing: 2,
				ml: 1,
			}}
		>
			Censurando{dots}
		</Typography>
	);
}