import React, { useEffect, useState } from "react";
import MusicXMLParser from "../MusicXMLParser/MusicXMLParser"
import { noteSequenceToMusicXML } from "../../noteSequenceToMusicXML";

import "./TranscriptionResultsPreview.css";


export default function TranscriptionResultsPreview({ noteSequence }) {
    const [xml, setXML] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setXML(await noteSequenceToMusicXML(noteSequence))
        }

        fetchData();
    },[]);

	return (xml ? <MusicXMLParser sourceFileURL={xml} preview={true} width={"80vw"} height={"100%"} drawTitle={false}/> : "");
}
