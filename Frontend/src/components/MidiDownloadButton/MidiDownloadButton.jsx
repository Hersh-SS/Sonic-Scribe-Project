import * as React from "react";
import * as mm from "@magenta/music";
import { downloadFile } from "../../downloadHelper";
import "./MidiDownloadButton.css";

const MidiDownloadButton = ({ noteSequence }) => {
    return (
        <button class="midiDownloadButton-button" 
            onClick={() => {
                const midiData = mm.sequenceProtoToMidi(noteSequence);
                downloadFile(midiData, "music.midi", "application/octet-stream");
            }}
        >
            Download MIDI
        </button>
    );
}

export default MidiDownloadButton;