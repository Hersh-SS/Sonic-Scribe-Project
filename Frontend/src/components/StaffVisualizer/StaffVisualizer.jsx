import { quantizeNoteSequence } from "@magenta/music/esm/core/sequences";
import React from "react";
import { useEffect, useState, useRef } from "react";
import * as mm from "@magenta/music";
import PlaySVG from "../../images/play-button.svg";
import StopSVG from "../../images/stop-button.svg";
import "./StaffVisualizer.css"

export default function StaffVisualizer({ noteSequence, setAudioPlayback }) {
    const visualizerRef = useRef(null);
    const [visualizer, setVisualizer] = useState(null);
    const [player, setPlayer] = useState(null);
	const [playing, setPlaying] = useState(false);

    useEffect(() => {
        // inits visualizer once the note sequence has been parsed
        if (noteSequence) {
            let notes = noteSequence;
            if (!notes.quantizationInfo) notes = quantizeNoteSequence(noteSequence, 4);

            let config = {
				noteRGB: '255, 255, 255',
				activeNoteRGB: '0, 255, 255',
			}

            const visualizer = new mm.StaffSVGVisualizer(notes, visualizerRef.current, config);
            setVisualizer(visualizer)
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
        <div class="staffVisualizer-container">
			<div class="staffVisualizer-canvas">
                <div ref={visualizerRef}></div>
				{
				!playing ? 
				<button class="staffVisualizer-button"
					onClick={() => {
						player.start(noteSequence);
						setPlaying(true);
						if(setAudioPlayback) setAudioPlayback(true);
					}}
				>
					<img src={PlaySVG} alt="PLAY" width={100} height={100} />
				</button> 
				:
				<button class="staffVisualizer-button"
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
