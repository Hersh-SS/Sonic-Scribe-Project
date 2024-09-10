import * as mm from "@magenta/music/esm";
import * as _ from "lodash";

const TIME_TO_NOTE_TYPE = {
	1: "1024th",
	2: "512th",
	4: "256th",
	8: "128th",
	16: "64th",
	32: "32nd",
	64: "16th",
	128: "eighth",
	256: "quarter",
	512: "half",
	1024: "whole",
	2048: "breve",
	4096: "long",
	8192: "maxima",
};

const NOTE_TYPE_TO_TIME = {
	"1024th": 1,
	"512th": 2,
	"256th": 4,
	"128th": 8,
	"64th": 16,
	"32nd": 32,
	"16th": 64,
	eighth: 128,
	quarter: 256,
	half: 512,
	whole: 1024,
	breve: 2048,
	long: 4096,
	maxima: 8192,
};

/**
 * Tries to use the remote xml converter if it fails it uses the local converter
 * @param {*} noteSequence
 * @returns
 */
export async function noteSequenceToMusicXML(noteSequence) {
	try {
		return await remoteNoteSequenceToMusicXML(noteSequence);
	} catch (error) {
		console.error("Remote method failed:", error);
		return localNoteSequenceToMusicXML(noteSequence);
	}
}

/**
 * Requests a note sequence to musicXML conversion from the conversion server using musescore convert
 * @param {*} noteSequence
 * @returns
 */
async function remoteNoteSequenceToMusicXML(noteSequence) {
	const midi = mm.sequenceProtoToMidi(noteSequence);
	const midiFile = new Blob([midi], { type: "audio/midi" });

	const response = await fetch(`${process.env.BACKEND_API_ENDPOINT}/convert/midi2xml`, {
		method: "POST",
		body: midiFile,
		headers: {
			"Content-Type": "audio/midi",
		},
	});

	const musicxml = await response.text();

	// The response is the MusicXML data
	return musicxml;
}

/**
 * Converts to note sequence locally, uses my own algorithm (it sucks)
 * @param {*} noteSequence
 * @returns
 */
function localNoteSequenceToMusicXML(noteSequence) {
	let noteSeq = new mm.NoteSequence(noteSequence);

	let tempo = noteSeq.tempos[0] ? noteSeq.tempos[0].qpm : 120;
	const SMALLEST_NOTE_LENGTH_SECONDS = 60 / (tempo * 256);

	// get notes ready for MusicXML conversion and change time scale
	let notes = noteSeq.notes.slice().map((note) => ({
		measure: 0,
		pitch: note.pitch,
		startTime: Math.ceil(note.startTime / SMALLEST_NOTE_LENGTH_SECONDS),
		endTime: Math.ceil(note.endTime / SMALLEST_NOTE_LENGTH_SECONDS),
		duration: 0,
		noteType: null,
		dot: false,
		notations: [],
	}));

	// Sort notes by start time and end time
	notes.sort((a, b) => {
		if (a.startTime === b.startTime) {
			return a.endTime - b.endTime;
		}
		return a.startTime - b.startTime;
	});

	// Add notes for each measure
	let notesWithMeasure = [];
	const measureLength = 4 * 256; // only supports 4/4 time signature
	for (let i = 0; i < notes.length; i++) {
		let note = _.cloneDeep(notes[i]);

		let startingMeasure = Math.floor(note.startTime / measureLength) + 1;
		let endingMeasure = Math.floor(note.endTime / measureLength) + 1;

		// This note extends into the next measure and needs to be split
		if (startingMeasure !== endingMeasure) {
			let clonedNode = _.cloneDeep(note);

			// Fix note
			note.measure = startingMeasure;
			note.notations = [`<tied type="start"/>`];
			notesWithMeasure.push(note);

			// Cloned note is part of the next measure
			clonedNode.startTime = measureLength * startingMeasure;
			clonedNode.notations = [`<tied type="stop"/>`];
			clonedNode.measure = endingMeasure;
			notesWithMeasure.push(clonedNode);
		} else {
			// Measure hasn't change nothing to do
			note.measure = startingMeasure;
			notesWithMeasure.push(note);
		}
	}

	// Sort notes by start time and end time
	notesWithMeasure.sort((a, b) => {
		if (a.startTime === b.startTime) {
			return a.endTime - b.endTime;
		}
		return a.startTime - b.startTime;
	});

	// Tieing notes
	let notesWithTies = [];
	for (let i = 0; i < notesWithMeasure.length; i++) {
		let note = _.cloneDeep(notesWithMeasure[i]);
		let noteDuration = note.endTime - note.startTime;
		notesWithTies.push(note);

		if (note.notations.length === 0) {
			// Find all overlapping notes
			let overlapingNotes = notesWithMeasure.filter(
				(n, j) => i !== j && n.startTime > note.startTime && n.startTime < note.startTime + noteDuration && n.pitch !== note.pitch
			);

			// This will prevent us from creating duplicate ties at the same start time
			let seenStartTimes = new Set();
			overlapingNotes = overlapingNotes.filter((note) => {
				if (seenStartTimes.has(note.startTime)) {
					return false;
				} else {
					seenStartTimes.add(note.startTime);
					return true;
				}
			});

			// If this note needs ties
			if (overlapingNotes.length > 0) {
				notesWithTies[notesWithTies.length - 1].notations = [`<tied type="start"/>`];
				notesWithTies[notesWithTies.length - 1].endTime = overlapingNotes[0].startTime; // this note ends when the next note begins

				let tiedNotes = [];
				for (let [j, overlapedNote] of overlapingNotes.entries()) {
					let tiedNote = _.cloneDeep(notesWithMeasure[i]); // clone of the original note, this copy wil be used to create the tie
					tiedNotes.push(tiedNote); // push a copy of this note

					tiedNotes[tiedNotes.length - 1].startTime = overlapedNote.startTime;
					tiedNotes[tiedNotes.length - 1].measure = Math.floor(overlapedNote.startTime / measureLength) + 1;

					// end time is equal to the next overlaping notes start if there is one
					if (j + 1 < overlapingNotes.length) {
						tiedNotes[tiedNotes.length - 1].endTime = overlapingNotes[j + 1].startTime;
					}

					// If this isn't the last note in the tie stop and restart the tie
					if (tiedNotes.length < overlapingNotes.length) {
						tiedNotes[tiedNotes.length - 1].notations = [`<tied type="stop"/>`, `<tied type="start"/>`];
					}
					// Else this is the last note stop the tie
					else {
						tiedNotes[tiedNotes.length - 1].notations = [`<tied type="stop"/>`];
					}
				}

				notesWithTies = notesWithTies.concat(tiedNotes);
			}
		}
	}

	// Classify notes
	for (let i = 0; i < notesWithTies.length; i++) {
		let noteType = findClosestNoteType(notesWithTies[i]);
		notesWithTies[i].duration = NOTE_TYPE_TO_TIME[noteType.noteType] * (noteType.isDotted ? 1.5 : 1);
		notesWithTies[i].noteType = noteType.noteType;
		notesWithTies[i].dot = noteType.isDotted;
	}

	// Sort notes by start time and end time we we use this to check if the note is a chord
	notesWithTies.sort((a, b) => {
		if (a.startTime === b.startTime) {
			return a.endTime - b.endTime;
		}
		return a.startTime - b.startTime;
	});

	// Build musicXML file
	// Header
	let musicXML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE score-partwise PUBLIC
    "-//Recordare//DTD MusicXML 4.0 Partwise//EN"
    "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
    <part-list>
        <score-part id="P1">
            <part-name>Music</part-name>
        </score-part>
    </part-list>
    <part id="P1">
		  	`;

	// First measure
	musicXML += `
        <measure number="1">
        <attributes>
            <divisions>256</divisions>
            <key>
                <fifths>0</fifths>
            </key>
            <time>
        <beats>4</beats>
        <beat-type>4</beat-type>
        </time>
            <staves>2</staves>
            <clef number="1">
                <sign>G</sign>
                <line>2</line>
            </clef>
            <clef number="2">
                <sign>F</sign>
                <line>4</line>
            </clef>
        </attributes>`;

	// Adding notes
	let measureNum = 1;
	for (let [i, note] of notesWithTies.entries()) {
		// Handle measure changes
		if (note.measure !== measureNum) {
			measureNum = note.measure;
			musicXML += `
        </measure>
        <measure number="${measureNum}">`;
		}

		musicXML += `
            <note>
                ${i > 0 ? (notesWithTies[i - 1].startTime === note.startTime ? "<chord />" : "") : ""}
                <pitch>
                        <step>${getNote(note.pitch).step}</step>
                        <alter>${getNote(note.pitch).alter}</alter>
                        <octave>${getNote(note.pitch).octave}</octave>
                </pitch>
                <duration>${note.endTime - note.startTime}</duration>
                <type>${note.noteType}</type>
                ${note.dot ? "<dot />" : ""}
                <notations>
                    ${note.notations.reduce((acc, currVal) => {
						return acc + currVal + "\n";
					}, "")}
				</notations>
            </note>`;
	}

	// End of the XML document
	musicXML += `
        </measure>
	</part>
</score-partwise>`;

	return musicXML;
}

function findClosestNoteType(note) {
	let noteDuration = note.endTime - note.startTime;
	let closestNoteType = null;
	let smallestDifference = Infinity;
	let isDotted = false;

	// Loop through all note durations
	for (let noteLength of Object.keys(TIME_TO_NOTE_TYPE)) {
		let noteLengthNumber = Number(noteLength);
		let regularDifference = Math.abs(noteDuration - noteLengthNumber);
		let dottedDifference = Math.abs(noteDuration - noteLengthNumber * 1.5);

		// Check if the note duration is closer to the dotted note length
		if (dottedDifference < regularDifference && dottedDifference < smallestDifference) {
			smallestDifference = dottedDifference;
			closestNoteType = TIME_TO_NOTE_TYPE[noteLength];
			isDotted = true;
		} else if (regularDifference < smallestDifference) {
			smallestDifference = regularDifference;
			closestNoteType = TIME_TO_NOTE_TYPE[noteLength];
			isDotted = false;
		}
	}

	return { noteType: closestNoteType, isDotted: isDotted };
}

// This only uses sharps and only works for C Major fix later
function getNote(midiPitch) {
	const notes = {
		0: "A", // A
		1: "A", // A#
		2: "B", // B
		3: "C", // C
		4: "C", // C#
		5: "D", // D
		6: "D", // D#
		7: "E", // E
		8: "F", // F
		9: "F", // F#
		10: "G", // G
		11: "G", // G#
	};

	const alters = {
		0: 0, // A
		1: 1, // A#
		2: 0, // B
		3: 0, // C
		4: 1, // C#
		5: 0, // D
		6: 1, // D#
		7: 0, // E
		8: 0, // F
		9: 1, // F#
		10: 0, // G
		11: 1, // G#
	};

	return {
		step: notes[(midiPitch - 21) % 12],
		alter: alters[(midiPitch - 21) % 12],
		octave: Math.floor((midiPitch - 12) / 12),
	};
}
