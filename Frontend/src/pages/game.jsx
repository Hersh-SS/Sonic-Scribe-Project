import React, { useEffect, useState } from 'react';
import { quantizeNoteSequence } from "@magenta/music/esm/core/sequences";
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { TWINKLE_TWINKLE } from '../SampleNoteSequences';

const isBrowser = typeof window !== "undefined"

function getNoteX(note, width) {
	let x;
	switch (note % 12) {
		case (0):
			x = (note - 21 - 1) * width;
			break;
		case (1):
			x = (note - 21 - 1.4) * width;
			break;
		case (2):
			x = (note - 21 - 2) * width;
			break;
		case (3):
			x = (note - 21 - 2.1) * width;
			break;
		case (4):
			x = (note - 21 - 3) * width;
			break;
		case (5):
			x = (note - 21 - 3) * width;
			break;
		case (6):
			x = (note - 21 - 3.4) * width;
			break;
		case (7):
			x = (note - 21 - 4) * width;
			break;
		case (8):
			x = (note - 21 - 4.25) * width;
			break;
		case (9):
			x = (note - 21) * width;
			break;
		case (10):
			x = (note - 21 - 0.1) * width;
			break;
		case (11):
			x = (note - 21 - 1) * width;
			break;
	}
	x -= Math.floor((note - 21) / 12) * width * 5
	return x;
}

function PianoKey({ note, activeNotes, windowWidth, windowHeight }) {
	const isBlackKey = [1, 3, 6, 8, 10].includes(note % 12);
	const fill = activeNotes[note] ? 'yellow' : isBlackKey ? 'black' : 'white';
	const defaultWidth = windowWidth / 52; // 52 white keys on a piano
	const defaultHeight = 150 / 919 * windowHeight > 150 ? 150 : 150 / 919 * windowHeight;
	const width = isBlackKey ? defaultWidth / 2 : defaultWidth;
	const height = isBlackKey ? 2 * defaultHeight / 3 : defaultHeight;
	const x = getNoteX(note, defaultWidth);
	const y = windowHeight - defaultHeight;

	// Settings for C labels
	const size = 20 / 37 * width; // 20/37 * width is close to font size 20 when the keyboard is displayed in 1920 x 1080
	const labely = y + height - size;
	const text = `C${Math.floor(note / 12) - 1}`;

	return (
		<>
			<Rect x={x} y={y} width={width} height={height} fill={fill} stroke='black' />
			{note % 12 == 0 ? <Text x={x} y={labely} width={width} align='center' text={text} fontSize={size} fill='black' /> : ""}
		</>
	);
}

function createNoteMap(noteSequence = TWINKLE_TWINKLE, windowWidth, windowHeight, noteScale = windowHeight / 10) {
	const pianoHeight = 150 / 919 * windowHeight > 150 ? 150 : 150 / 919 * windowHeight;

	if (quantizeNoteSequence && !noteSequence.quantizationInfo) noteSequence = quantizeNoteSequence(noteSequence);
	let noteMap = {};
	noteMap.notes = noteSequence.notes.map((note, i) => {
		const isBlackKey = [1, 3, 6, 8, 10].includes(note.pitch % 12);
		const fill = isBlackKey ? '#6BAA2D' : '#A0E571';
		const defaultWidth = windowWidth / 52;
		const width = isBlackKey ? defaultWidth / 2 : defaultWidth;
		const height = (note.startTime - note.endTime) * noteScale;
		const x = getNoteX(note.pitch, defaultWidth);
		const y = windowHeight - (pianoHeight + note.startTime * noteScale); // calculate y based on windowHeight

		return {
			key: i,
			pitch: note.pitch,
			startTime: note.startTime,
			endTime: note.endTime,
			x: x,
			y: y,
			width: width,
			height: height,
			fill: fill,
		};
	});
	noteMap.totalTime = noteSequence.totalTime;
	noteMap.noteScale = noteScale;

	return noteMap;
}

function NoteMap({ noteMap, elapsedTime, windowHeight }) {
	// Only render notes that are visable
	const visibleNotes = noteMap.notes.filter(note => {
		const y = note.y + elapsedTime * noteMap.noteScale;
		return note.y < windowHeight && y > 0;
	});

	return visibleNotes.map((note) => {
		const y = note.y + elapsedTime * noteMap.noteScale;
		return <Rect key={note.key} x={note.x} y={y} width={note.width} height={note.height} fill={note.fill} stroke='black' />;
	});
}

function Grid({ notes, elapsedTime, noteScale, windowWidth, windowHeight }) {
	const pianoHeight = 150 / 919 * windowHeight > 150 ? 150 : 150 / 919 * windowHeight;

	// Array magic to so array only contains time stamps that are visable on screen
	const start = Math.floor(elapsedTime / 5);
	const horizontalLines = Array.from({ length: Math.ceil(windowHeight / (5 * noteScale)) + 1 }, (_, i) => (i + start) * 5);

	const defaultWidth = windowWidth / 52;

	return (
		<>
			{notes.map((midiNumber) => {
				const x = getNoteX(midiNumber, defaultWidth);
				return <Line key={midiNumber} points={[x, 0, x, windowHeight]} stroke='gray' strokeWidth={1} />;
			})}
			{horizontalLines.map((time, i) => {
				const y = windowHeight - pianoHeight - time * noteScale + elapsedTime * noteScale;
				const size = 20 * windowWidth / 1920; // font size 20 when the keyboard is displayed in 1920 x 1080
				return <>
					<Line key={i} points={[0, y, windowWidth, y]} stroke='gray' strokeWidth={1} />
					<Text x={2} y={y - size} width={windowWidth} align='left' text={Math.floor(time / 60) > 0 ? `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}` : `${time}`} fontSize={size} fill='gray' />
				</>;
			})}
		</>
	);
}

function ProgressBar({ time, elapsedTime, windowWidth }) {
	return <Rect x={0} y={0} width={windowWidth * elapsedTime / time} height={10} fill='green' />
}

function StartText({ windowWidth, windowHeight }) {
	const size = 50 * windowWidth / 1920; // font size 50 when the keyboard is displayed in 1920 x 1080
	return <Text text="Press a button to start" fontSize={size} align='center' verticalAlign='middle' x={0} y={0} width={windowWidth} height={windowHeight} fill='white' />
}

function ScoreText({ score, windowWidth, windowHeight }) {
	const size = 50 * windowWidth / 1920; // font size 50 when displayed in 1920 x 1080
	return <Text text={'Score: ' + score} fontSize={size} align='left' x={0} y={10} width={windowWidth} height={windowHeight} fill='white' />
}

function GameOverText({ windowWidth, windowHeight, score }) {
	const size1 = 50 * windowWidth / 1920; // font size 50 when displayed in 1920 x 1080
	const size2 = 30 * windowWidth / 1920; // font size 30 when displayed in 1920 x 1080
	const rectWidth = 200 * windowWidth / 1920;
	const rectHeight = 80 * windowWidth / 1920;

	return <>
		<Text
			text={`Game Over! Your score: ${score}`}
			x={0}
			y={0}
			width={windowWidth}
			height={windowHeight}
			fontSize={size1}
			fill='white'
			align='center'
			verticalAlign='middle'
		/>
		<Rect
			x={windowWidth / 2 - rectWidth / 2}
			y={windowHeight / 2 - rectHeight + size1 * 2.5}
			width={rectWidth}
			height={rectHeight}
			fill='white'
		/>
		<Text
			text='Restart'
			x={windowWidth / 2 - rectWidth / 2}
			y={windowHeight / 2 - rectHeight + size1 * 2.5}	
			width={rectWidth}
			height={rectHeight}
			fontSize={size2}
			fill='black'
			align='center'
			verticalAlign='middle'
		/>
	</>
}

function Piano({ location }) {
	let windowWidth = 500;
	let windowHeight = 1000;
	if (isBrowser) {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	} 
	const noteSequence = location.state?.noteSequence || TWINKLE_TWINKLE;
	const startDelay = 5;
	const notes = Array.from({ length: 88 }, (_, i) => i + 21); // Generate MIDI keys from 21 to 108
	const lineNotes = notes.filter((note) => [0, 5].includes(note % 12));
	const noteMap = createNoteMap(noteSequence, windowWidth, windowHeight);
	const [activeNotes, setActiveNotes] = useState({});
	const [startTime, setStartTime] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(-startDelay);
	const [isStarted, setIsStarted] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false);
	const [score, setScore] = useState(0);

	const restartGame = () => {
		setIsStarted(false);
		setIsGameOver(false);
		setElapsedTime(-startDelay);
		setActiveNotes({});
		setScore(0);
	};

	useEffect(() => {
		const handleUserInput = () => {
			if (!isStarted) {
				setIsStarted(true);
			}
		};

		if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess({ sysex: true })
				.then(onMIDISuccess, onMIDIFailure);
		} else {
			console.warn('No MIDI support in your browser.');
		}

		function onMIDISuccess(midiAccess) {
			for (let input of midiAccess.inputs.values()) {
				input.onmidimessage = getMIDIMessage;
			}
		}

		function onMIDIFailure() {
			console.warn('Could not access your MIDI devices.');
		}

		function getMIDIMessage(message) {
			let command = message.data[0];
			let note = message.data[1];
			let velocity = (message.data.length > 2) ? message.data[2] : 0;

			switch (command) {
				case 144: // noteOn
					if (velocity > 0) {
						// Store the current time as the value in activeNotes
						setActiveNotes(prevNotes => ({ ...prevNotes, [note]: Date.now() }));
					}
					break;
				case 128: // noteOff
					handleUserInput();
					setActiveNotes(prevNotes => {
						const newNotes = { ...prevNotes };
						delete newNotes[note];
						return newNotes;
					});
					break;
				default:
					break;
			}
		}

		window.addEventListener('keydown', handleUserInput);
		window.addEventListener('mousedown', handleUserInput);

		return () => {
			window.removeEventListener('keydown', handleUserInput);
			window.removeEventListener('mousedown', handleUserInput);
		};
	}, []);

	useEffect(() => {
		if (isStarted) {
			const startTime = Date.now() + 1000 * startDelay;
			setStartTime(startTime);

			const interval = setInterval(() => {
				const currentTime = Date.now();
				const elapsedTime = (currentTime - startTime) / 1000; // time in seconds
				setElapsedTime(elapsedTime);
			}, 1000 / 60); // update position every frame

			return () => clearInterval(interval); // clean up on unmount
		}
	}, [isStarted]);

	useEffect(() => {
		// Calculate the score when elapsedTime changes and the song is playing
		const gracePeriod = 0.2; // Adjust this value as needed

		if (elapsedTime >= 0 - gracePeriod && elapsedTime <= noteMap.totalTime + gracePeriod) {
			// Find all the notes that should be playing at the current time or are about to be played within a grace period
			let notesInMap = noteMap.notes.filter(n => elapsedTime >= n.startTime - gracePeriod && elapsedTime <= n.endTime + gracePeriod);

			for (let note in activeNotes) {
				// Check if the user is pressing any of the notes that should be playing
				let matchingNotes = notesInMap.filter(n => n.pitch === parseInt(note));
				if (matchingNotes.length > 0) {
					const notePressTime = (activeNotes[note] - startTime) / 1000; // time in seconds

					let matchingNote;
					if (activeNotes[note]) {
						// If the user is playing the note, keep the note that is meant to be played at the current time
						matchingNote = matchingNotes.find(n => notePressTime >= n.startTime && notePressTime <= n.endTime);
					} else {
						// If the user is not playing the note, keep the note that starts last
						matchingNote = matchingNotes.reduce((lastNote, currentNote) => currentNote.startTime > lastNote.startTime ? currentNote : lastNote);
					}

					if (matchingNote) {
						// If the user is pressing a correct note at the start time, increase the score
						if (notePressTime >= matchingNote.startTime - gracePeriod && notePressTime <= matchingNote.endTime + gracePeriod) {
							setScore(score => score + 1);
						}
						// If the user is still pressing the note after the end time, decrease the score
						else if (notePressTime < matchingNote.startTime - gracePeriod) {
							setScore(score => score - 1);
						}
					} else {
						setScore(score => score - 1);
					}
				} else {
					// If the user is pressing an incorrect note, decrease the score
					setScore(score => score - 1);
				}
			}
		}

		if(elapsedTime > noteMap.totalTime + gracePeriod) {
			setIsGameOver(true);
			window.addEventListener('keydown', restartGame);
			window.addEventListener('mousedown', restartGame);

			return () => {
				window.removeEventListener('keydown', restartGame);
				window.removeEventListener('mousedown', restartGame);
			};
		}
	}, [elapsedTime]);

	return (
		<Stage width={windowWidth} height={windowHeight}>
			<Layer>
				<Rect
					width={windowWidth}
					height={windowHeight}
					fill="#323246"
				/>
				<Grid notes={lineNotes} time={noteMap.totalTime} elapsedTime={elapsedTime} windowWidth={windowWidth} windowHeight={windowHeight} noteScale={noteMap.noteScale} />
				<NoteMap noteMap={noteMap} elapsedTime={elapsedTime} windowHeight={windowHeight} />
				<ProgressBar time={noteMap.totalTime} elapsedTime={elapsedTime} windowWidth={windowWidth} />
				{notes.map((note) => {
					if (![1, 3, 6, 8, 10].includes(note % 12)) {
						return <PianoKey key={note} note={note} activeNotes={activeNotes} windowWidth={windowWidth} windowHeight={windowHeight} />;
					}
					return null;
				})}
				{notes.map((note) => {
					if ([1, 3, 6, 8, 10].includes(note % 12)) {
						return <PianoKey key={note} note={note} activeNotes={activeNotes} windowWidth={windowWidth} windowHeight={windowHeight} />;
					}
					return null;
				})}
				{<ScoreText score={score} windowWidth={windowWidth} windowHeight={windowHeight} />}
				{!isStarted && <StartText windowWidth={windowWidth} windowHeight={windowHeight} />}
				{isGameOver && <GameOverText windowWidth={windowWidth} windowHeight={windowHeight} restartGame={restartGame} score={score} />}
			</Layer>
		</Stage>
	);
}

export default Piano;
