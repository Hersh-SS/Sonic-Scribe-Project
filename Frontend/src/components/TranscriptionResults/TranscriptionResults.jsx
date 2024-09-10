import * as React from "react";
import { useState } from "react";
import PianoRollVisualizer from "../PianoRollVisualizer/PianoRollVisualizer";
import StaffVisualizer from "../StaffVisualizer/StaffVisualizer";
import XmlDownloadButton from "../XmlDownloadButton/XmlDownloadButton";
import MidiDownloadButton from "../MidiDownloadButton/MidiDownloadButton";
import "./TranscriptionResults.css";
import NavigationBar from "../NavigationBar/NavigationBar";
import { navigate } from "gatsby";
import TranscriptionResultsPreview from "../TranscriptionResultsPreview/TranscriptionResultsPreview";


const TranscriptionResults = ({ noteSequence }) => {
    const [audioPlayback, setAudioPlayback] = useState(false);
    const [preview, setPreview] = useState(0); // 0 Piano Roll, 1 Staff, 2 Sheet Music

    const handleConvertMore = () => {
        navigate("/transcribe");
    }

    const handlePlayAlong = () => {
        navigate("/game", { state: { noteSequence: noteSequence } });
    }

    const handleSwitchView = () => {
        setPreview(curr => (curr+1) % 3);
    }

    const getPreview = () => {
        if(preview === 0) return <PianoRollVisualizer noteSequence={noteSequence} setAudioPlayback={setAudioPlayback} />;
        else if(preview === 1) return <StaffVisualizer noteSequence={noteSequence} setAudioPlayback={setAudioPlayback} />;
        else if(preview === 2) return <TranscriptionResultsPreview noteSequence={noteSequence} />;
    }

    return (
        <div class="transcriptionResults-bg">
            <NavigationBar />
            <h1 class="transcriptionResults-title">Your audio has been converted:</h1>
            <div class="transcriptionResults-preview">
                {getPreview()}
            </div>
            <div class="transcriptionResults-buttonContainer">
                <XmlDownloadButton noteSequence={noteSequence} />
                <button class="transcriptionResults-switchButton" disabled={audioPlayback}
                    onClick={() => {
                        handleSwitchView();
                    }}
                >
                    Switch View
                </button>
                <MidiDownloadButton noteSequence={noteSequence} />
            </div>
            <div class="transcriptionResults-buttonContainer">
                <button class="transcriptionResults-convertButton" onClick={() => handleConvertMore()}>Convert More</button>
                <button class="transcriptionResults-playAlongButton" onClick={() => handlePlayAlong()}>Play Along</button>
            </div>
        </div>
    );
}

export default TranscriptionResults;