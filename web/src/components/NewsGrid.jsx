import React from "react";
import Grid from '@mui/material/Grid';
import NewsCard from "./NewsCard";


export default function NewsGrid({ news, setHtmlValue }) {
	const cardMaxWidth = '400px';

	return (
		<Grid container spacing={2} justifyContent="center" className="mb-5">
			{news.map((item, i) => (
				<Grid key={i}
					size={{ xs: 12, sm: 12, md: 6, lg: 4, xxl: 2.4 }}
					sx={{
						maxWidth: cardMaxWidth,
						width: '100%'
					}}
				>
					<NewsCard item={item} setHtmlValue={setHtmlValue} />
				</Grid>
			))}
		</Grid>
	);
}
