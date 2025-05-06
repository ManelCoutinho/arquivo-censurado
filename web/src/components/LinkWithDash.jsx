import React, { forwardRef, useRef, useLayoutEffect } from "react";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";

/**
 * Styled MUI <Link> that shows a dashed overlay on hover.
 * The dash string ("-----") is generated automatically from the link text
 * and injected via the data‑dash attribute, which the ::after pseudo‑element reads.
 */
const StyledLink = styled(Link)(({ theme }) => ({
	color: theme.palette.primary.main,
	textDecoration: "none",
	position: "relative",
	"&:hover::after,&[aria-current='page']::after": {
		content: "attr(data-dash)",
		position: "absolute",
		width: "100%",
		left: 0,
		bottom: "-0.25em",
		color: "red",
		fontFamily: '"Special Elite", monospace',
		whiteSpace: "nowrap",
		overflow: "hidden",
		lineHeight: 0.5,
		pointerEvents: "none",
	},

}));

/**
 * Reusable component: <LinkWithDash href="/">Label</LinkWithDash>
 */
const LinkWithDash = forwardRef(function LinkWithDash(props, ref) {
	const { children, ...linkProps } = props;
	const localRef = useRef(null);

	// Merge forwarded ref with local ref
	const setRefs = (node) => {
		localRef.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	};

	// Update data‑dash whenever the children (link text) change
	useLayoutEffect(() => {
		const el = localRef.current;
		if (el) {
			const text = (el.textContent || "").trim();
			el.dataset.dash = "-".repeat(text.length);
		}
	}, [children]);

	return (
		<StyledLink ref={setRefs} {...linkProps}>
			{children}
		</StyledLink>
	);
});

export default LinkWithDash;
