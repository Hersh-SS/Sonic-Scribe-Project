import * as React from "react";
import { useState, useEffect, useRef } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import * as mm from "@magenta/music";
import UploadButtonComponent from "../UploadButton/UploadButton";
import { initOnsetsAndFrames, transcribeFromAudioFile } from "../../transcribe";
import PreviousTranscriptsMenu from "../PreviousTranscriptsMenu/PreviousTranscriptsMenu";
import { pushNoteSequence } from "../../scoreDB";
import { navigate } from "gatsby";

import "./TranscribePage.css";

const TranscribePage = () => {
	const [modelReady, setModelReady] = useState(false);
	const [file, setFile] = useState(null);
	const [model, setModel] = useState('OnsetsAndFrames');
	const convertButtonRef = useRef();

	useEffect(() => {
		// loading onsets and frames
		const init = async () => {
			try {
				setModelReady(await initOnsetsAndFrames());
			} catch (error) {
				console.error("Error initializing model:", error);
			}
		};

		init();
	}, []);

	function createArray(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				const result = reader.result;
				resolve(result);
			};

			reader.onerror = (event) => {
				reject(reader.error);
			};

			reader.readAsArrayBuffer(file);
		});
	}

	const handleConvert = async () => {
		// waiting for a file
		if (file && modelReady) {
			convertButtonRef.current.textContent = "Converting...";
        	// convertButtonRef.style.backgroundColor = "green";
			// if it is a midi file it can be parsed directly
			if (file.name.split(".")[1] === "mid" || file.name.split(".")[1] === "midi") {
				let ns = mm.midiToSequenceProto(await createArray(file))
				pushNoteSequence({ noteSequence: ns, title: file.name.split(".")[0] });
				navigate("/results", { state: { noteSequence: ns } });
			}
			else if (model === "HFTTransformer") {
				try {
					const fileType = file.name.split('.').pop().toLowerCase();
					let blob, response;

					if (fileType === 'mp3') {
						blob = new Blob([await file.arrayBuffer()], { type: "audio/mpeg" }); // Change to use arrayBuffer

						response = await fetch(`${process.env.BACKEND_API_ENDPOINT}/transcribe`, {
							method: "POST",
							body: blob,
							headers: {
								"Content-Type": "audio/mpeg",
							},
						});
					} else if (fileType === 'wav') {
						blob = new Blob([await file.arrayBuffer()], { type: "audio/wav" }); // Change to use arrayBuffer

						response = await fetch(`${process.env.BACKEND_API_ENDPOINT}/transcribe`, {
							method: "POST",
							body: blob,
							headers: {
								"Content-Type": "audio/wav",
							},
						});
					} else {
						console.error('Unsupported file type');
						convertButtonRef.current.textContent = 'Convert';
						alert('Unsupported file type');
						return;
					}
				
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
				
					const arrayBuffer = await response.arrayBuffer();
					let ns = mm.midiToSequenceProto(arrayBuffer);
				
					pushNoteSequence({ noteSequence: ns, title: file.name.split(".")[0] });
					navigate("/results", { state: { noteSequence: ns } });
				} catch (error) {
					console.error('There was a problem with the fetch operation: ', error);
					convertButtonRef.current.textContent = 'Convert';
					alert('There was a problem with the fetch operation: ', error);
				}
			}
			else { // model === "OnsetsAndFrames"
				// Handles .wav and .mp3 transcription
				try {
					let output = await transcribeFromAudioFile(file);
					pushNoteSequence({ noteSequence: output, title: file.name.split(".")[0] });
					navigate("/results", { state: { noteSequence: output } });
				} catch (error) {
					console.error("Error transcribing file:", error);
					convertButtonRef.current.textContent = 'Convert';
					alert("Error transcribing file:", error);
				}
			}
		}
	}

	const handleTutorialButton = () => {

	};

	const getTooltip = () => {
		if (model === "OnsetsAndFrames") {
			return <span className="transcribe-container-transcriber-selector-tooltip-text"><a href="https://arxiv.org/abs/1710.11153" target="_blank">Onsets and Frames</a>: Weaker LSTM model that will run locally on your computer. Transcription time depends on your computer.</span>
		}
		else { // model === "HFTTransformer"
			return <span className="transcribe-container-transcriber-selector-tooltip-text"><a href="https://arxiv.org/abs/2307.04305" target="_blank">hFT-Transformer</a>: Stronger Transformer model that will run remotely. Transcription time is roughly half the input length.</span>
		}
	}

	return (
		<>
			<NavigationBar />
			<div className="transcribe-container">
				{modelReady ? (
					<div className="transcribe-container-transcriber">
						<h1>Audio Transcriber</h1>
						<div className="transcribe-container-transcriber-selector">
							<select onChange={(e) => setModel(e.target.value)} value={model}>
								<option value="OnsetsAndFrames">Onsets and Frames</option>
								<option value="HFTTransformer">hFT-Transformer</option>
							</select>
							<div className="transcribe-container-transcriber-selector-tooltip">?
								{getTooltip()}
							</div>
						</div>
						<UploadButtonComponent setFile={setFile}></UploadButtonComponent>
						<button ref={convertButtonRef} className="transcribe-container-convert-button" onClick={handleConvert}>
							Convert
						</button>
						<button className="transcribe-tutorial-container" onClick={() => handleTutorialButton()}>
							<p>Tutorial</p>
						</button>
					</div>
				) : (
					<div className="transcribe-container-transcriber">
						<h1>Loading Model...</h1>
					</div>
				)}
				<div className="transcribe-container-transcriptions">
					<h1>Previous Transcriptions</h1>
					{modelReady ? <PreviousTranscriptsMenu /> : ""}
				</div>
			</div>
		</>
	);
};

export default TranscribePage;

export const Head = () => <title>SonicScribe</title>;
