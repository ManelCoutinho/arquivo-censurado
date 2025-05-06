import React, { useRef, useLayoutEffect } from "react";
import { styled } from "@mui/material/styles";

/**
 * DashDivider: a reusable horizontal divider that displays a row of dashes.
 *
 * Props:
 * - length (number): number of dash characters to render (default: 100)
 * - sx (object): optional MUI styling for the container
 */
const StyledDivider = styled("div")(({ theme }) => ({
	overflow: "hidden",
	fontFamily: '"Special Elite", monospace',
	whiteSpace: "nowrap",
	lineHeight: 0.5,
	color: theme.palette.text.primary,
	"&::before": {
		content: "attr(data-dash)",
	},
}));

export default function DashDivider({ length = 100, sx = {}, ...props }) {
	const ref = useRef(null);

	useLayoutEffect(() => {
		if (ref.current) {
			ref.current.dataset.dash = "-".repeat(length);
		}
	}, [length]);

	return <StyledDivider ref={ref} sx={sx} {...props} />;
}
