import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import CensorForm from "../components/form/CensorForm";
import news_db from "../assets/db/news";
import extensions_db from "../assets/db/extensions";

import NewsGrid from "../components/NewsGrid";
import DashDivider from "../components/DashDivider";
import LinkWithDash from "../components/LinkWithDash";
import ButtonExtension from "../components/ButtonExtension";

const Home = () => {
    const [htmlValue, setHtmlValue] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <Container fluid="lg" className="py-5">
            <Row className="mb-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Typography variant="h3" component="h3" align="center" gutterBottom>
                            Testa o <span className="text-primary fw-bold">Arquivo Censurado</span>
                        </Typography>
                        <Typography align="center" variant="p" component="p">
                            Experimenta submeter um texto e vê como seria censurado pela
                            ditadura portuguesa antes do 25&nbsp;de Abril de&nbsp;1974.
                        </Typography>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={10} lg={8}>
                        <CensorForm
                            htmlValue={htmlValue}
                            setHtmlValue={setHtmlValue}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    </Col>
                </Row>
            </Row>
            <DashDivider length={150} />
            <Row className="my-5 text-center">
                <Typography variant="h5" component="h5" gutterBottom>
                    Ou, se preferires, clica numa das notícias do arquivo:
                </Typography>
            </Row>

            <NewsGrid news={news_db} setHtmlValue={setHtmlValue} />
            <DashDivider length={150} />
            <Row className="mx-1">
                <Row className="mt-4">
                    <Typography variant="h5" component="h5" gutterBottom>
                        <span className="text-primary fw-bold">Arquivo Censurado:</span> Uma extensão no teu navegador (Chrome, Firefox, Safari)
                    </Typography>
                </Row>
                <Row className="mt-3">
                    <Typography variant="p" component="p" align="justify" className="my-3">
                        Para além desta plataforma web onde podes explorar as capacidades censórias do nosso modelo de linguagem,
                        disponibilizamos uma extensão web que permite censurar em tempo real as entradas do projeto <LinkWithDash href="https://arquivo.pt/" target="_blank" rel="noreferrer">Arquivo.PT</LinkWithDash>.
                    </Typography>
                    <Row className="justify-content-center mb-3">
                        {extensions_db.map((extension, i) => (
                            <Col key={i}
                                xs={12} md={4}
                                className="d-flex justify-content-center my-3">
                                <ButtonExtension extension={extension}></ButtonExtension>
                            </Col>
                        ))}
                    </Row>
                    <Typography variant="p" component="p" align="justify" className="my-3">
                        Também podes visitar o nosso repositório e instalar a extensão por ti mesmo: <LinkWithDash href="https://github.com/ManelCoutinho/arquivo-censurado/tree/main/chrome-extension#-instala%C3%A7%C3%A3o-e-utiliza%C3%A7%C3%A3o" target="_blank" rel="noreferrer">Github</LinkWithDash>.
                    </Typography>
                </Row>
            </Row>
        </Container>
    );
}

export default Home
