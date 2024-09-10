import React from "react";
import TranscriptionResults from "../components/TranscriptionResults/TranscriptionResults";
import { TWINKLE_TWINKLE } from "../SampleNoteSequences";


const transcribe = ({ location }) => {
   
	return (
		<div>
			<TranscriptionResults noteSequence={location.state?.noteSequence || TWINKLE_TWINKLE} />
		</div>
	);
};

export default transcribe;

export const Head = () => <title>SonicScribe</title>;
