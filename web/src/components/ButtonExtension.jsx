import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@mui/material";

// Helper function (as defined above)
const measureTextWidth = (text, font) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = font;
	const metrics = context.measureText(text);
	return metrics.width;
};


export default function ButtonExtension({ extension }) {
	const buttonRef = useRef(null);
	const [pseudoPadding, setPseudoPadding] = useState('1.5rem'); // Default fallback

	useEffect(() => {
		if (buttonRef.current && extension.disable) {
			const computedStyle = window.getComputedStyle(buttonRef.current);
			const font = computedStyle.font;

			// Calculate content width
			const buttonWidth = buttonRef.current.offsetWidth;
			const borderLeftPx = parseFloat(computedStyle.borderLeftWidth);
			const borderRightPx = parseFloat(computedStyle.borderRightWidth);
			const contentWidth = buttonWidth - (borderLeftPx + borderRightPx);


			// Calculate text width
			const letterSpacingPx = parseFloat(computedStyle.letterSpacing);
			const text = extension.name;
			const baseTextWidthPx = measureTextWidth(text, font);
			const spacingWidthPx = (text.length - 1) * letterSpacingPx;
			const totalTextWidthPx = baseTextWidthPx + spacingWidthPx;

			const spaceAroundText = Math.max(0, contentWidth - totalTextWidthPx);

			setPseudoPadding(`${spaceAroundText / 2 - 2}px`);
		}
	}, [extension.name, extension.disable]); // Recalculate if name or disabled status changes

	const buttonClass = `typewriter-btn ${extension.disable ? 'broken' : ''}`;
	const buttonStyle = {
		width: 'var(--extensions-btn-width)',
		...(extension.disable && { '--pseudo-padding': pseudoPadding })
	};


	return (
		<Button
			ref={buttonRef}
			class={buttonClass}
			data-label={extension.name}
			disabled={extension.disable}
			onClick={() => !extension.disable && window.open(extension.url)}
			style={buttonStyle}
		>
			{extension.name}
		</Button>
	);
};


