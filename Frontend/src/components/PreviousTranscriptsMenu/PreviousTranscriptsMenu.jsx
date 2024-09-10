import React from "react";
import { useState, useEffect } from "react";
import { getCachedNoteSequences } from "../../scoreDB";
import { navigate } from "gatsby";
import tempImage from "../../images/blurredSheet.png";

import "./PreviousTranscriptsMenu.css"
import "./TranscriptionSelector.css"

export default function PreviousTranscriptsMenu() {
    const [transcripts, setTranscripts] = useState([]);

    useEffect(() => {
        const getTranscripts = async () => {
            setTranscripts(await getCachedNoteSequences());
        }

        getTranscripts();
    }, []);

    return (
        <div className="previousTranscriptsMenu-container">
            {transcripts.map((t, i) => <TranscriptionSelector key={i} noteSequence={t?.noteSequence} title={t?.title} />)}
        </div>
    );
}

function TranscriptionSelector({ noteSequence, title,}) {
    const openTranscript = () => {
        navigate("/results", { state:{noteSequence: noteSequence} });
    };

    return (
        <div className="transcriptionSelector-container" onClick={openTranscript}>
            <div className="transcriptionSelector-image">
                <img src={tempImage} width={"100%"} height={"100%"}></img>
            </div>
            <p className="transcriptionSelector-title">{title}</p>
        </div>
    );
}
