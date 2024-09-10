import * as React from "react";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import "bootstrap/dist/css/bootstrap.min.css";
import BG from "../images/headphone-bg.png";
import sheet1 from "../images/score_0.png";
import sheet2 from "../images/score_01.png";
import '../styles/index.css'

import { Container, Row, Col, Image } from "react-bootstrap";

const styles = {
	background: {
		backgroundImage: `url(${BG})`,
		backgroundPosition: "center",
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundAttachment: "fixed",
		backgroundPosition: "relative",
		width: "100vw",
		height: "100vh",
	},
};

const IndexPage = () => {
	return (
		<div>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
			<div className="cComponent" style={styles.background}>
				<NavigationBar />
				
				<Container>
					<div class="info">
						<Row>
							<Col className="header">Welcome to Sonic Scribe</Col>
						</Row>
						<Row>
							<Col>
								<p class="p1">
									Experience the seamless transformation of your favorite tunes into written notes with our innovative audio-to-sheet music converter.
								</p>
								<p class="p1">
									Our platform allows you to effortlessly convert audio tracks, melodies, or compositions into accurate and readable sheet music.
								</p>
								<Row>	
									<p className="p2">
										Simply upload your audio file, and watch as our advanced technology transcribes the music into sheet notation, providing musicians and
										composers with a new way to capture, preserve, and explore melodies.
									</p>					
								</Row>
							</Col>
							<Col>
									<div id="slideshow">
										<div class="slide-wrapper">	
											
											<div class="slide">
												<Image class="slide-number" src={sheet1}  width="400" height="510"/>
											</div>
											<div class="slide">
												<Image class="slide-number" src={sheet2} width="400" height="510"/>
											</div>
										</div>
									</div>
							</Col>
						</Row>
							
					</div>
				</Container>
			</div>
		</div>
	);
};

export default IndexPage;

export const Head = () => <title>SonicScribe</title>;

