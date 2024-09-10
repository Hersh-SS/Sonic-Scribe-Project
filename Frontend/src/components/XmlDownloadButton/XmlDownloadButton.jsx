import * as React from "react";
import { noteSequenceToMusicXML } from "../../noteSequenceToMusicXML";
import { downloadFile } from "../../downloadHelper";
import "./XmlDownloadButton.css";

const XmlDownloadButton = ({noteSequence}) => {
    return (
        <button class="xmlDownloadButton-button" 
            onClick={async () => {
                const musicXML = await noteSequenceToMusicXML(noteSequence);
                downloadFile(musicXML, "music.xml", "application/octet-stream");
            }}
        >
            Download XML
        </button>
    );
}

export default XmlDownloadButton;