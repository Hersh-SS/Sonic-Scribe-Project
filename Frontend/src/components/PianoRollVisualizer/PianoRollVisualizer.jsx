import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { quantizeNoteSequence } from "@magenta/music/esm/core/sequences";
import * as mm from "@magenta/music";
import "./PianoRollVisualizer.css";
import PlaySVG from "../../images/play-button.svg";
import StopSVG from "../../images/stop-button.svg";

export default function PianoRollVisualizer({ noteSequence, setAudioPlayback }) {
	const visualizerRef = useRef(null);
	const [visualizer, setVisualizer] = useState(null);
	const [player, setPlayer] = useState(null);
	const [playing, setPlaying] = useState(false);
	

	useEffect(() => {
		// init visualizer once the note sequence has been parsed
		if (noteSequence) {
			let notes = noteSequence;
			if (!notes.quantizationInfo) notes = quantizeNoteSequence(noteSequence);

			let config = {
				noteHeight: 6,
				pixelsPerTimeStep: 30,  // like a note width
				noteSpacing: 1,
				noteRGB: '255, 255, 255',
				activeNoteRGB: '0, 255, 255',
				maxPitch: 88,
				minPitch: 0
			}

			const visualizer = new mm.PianoRollCanvasVisualizer(notes, visualizerRef.current, config);
			setVisualizer(visualizer);
			visualizer.redraw();

			setPlayer(
				new mm.Player(false, {
					run: (note) => visualizer.redraw(note),
					stop: () => {
						setPlaying(false);
						if(setAudioPlayback) setAudioPlayback(false);
					}
				})
			);
		}
	}, [noteSequence]);

	return (
		<div class="pianoRollVisualizer-container">
			<div class="pianoRollVisualizer-canvas">
				<canvas ref={visualizerRef} />
				{
				!playing ? 
				<button class="pianoRollVisualizer-button"
					onClick={() => {
						player.start(noteSequence);
						setPlaying(true);
						if(setAudioPlayback) setAudioPlayback(true);
					}}
				>
					<img src={PlaySVG} alt="PLAY" width={100} height={100} />
				</button> 
				:
				<button class="pianoRollVisualizer-button"
					onClick={() => {
						player.stop();
						setPlaying(false);
						if(setAudioPlayback) setAudioPlayback(false);
					}}
				>
					<img src={StopSVG} alt="STOP" width={100} height={100} />
				</button>
				}
			</div>
		</div>
	);
}
