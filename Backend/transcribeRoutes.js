import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const transcribeRouter = express.Router();

transcribeRouter.post("", bodyParser.raw({ type: ["audio/wav", "audio/mpeg"], limit: "200mb" }), (req, res) => {
    const id = uuidv4();
    const musicFile = `${id}.${req.get('Content-Type').split('/').pop()}`;
    const wavFile = `${id}.wav`;
    const midiFile = `${id}.midi`;

    fs.writeFile(musicFile, req.body, async (err) => {
        if (err) {
            res.status(500).send("An error occurred creating " + musicFile + " for reason: " + err);
        } else {
            if (musicFile.endsWith('.mpeg')) {
                try {
                    await exec(`ffmpeg -i ${musicFile} ${wavFile}`);
                } catch (err) {
                    res.status(500).send("Error converting MP3 to WAV: " + err);
                    return;
                }
            }

            const inputFile = musicFile.endsWith('.mpeg') ? wavFile : musicFile;
            exec(`python3 Transformer/m_inference.py -i ${inputFile} -o ${midiFile}`, (err, stdout, stderr) => {
                if (err) {
                    res.status(500).send("Error converting music file to midi file for reasons: " + err + "\n\n" + stderr);
                } else {
                    fs.readFile(midiFile, (err, data) => {
                        if (err) {
                            res.status(500).send("Error reading " + midiFile + " for reason: " + err);
                        } else {
                            res.status(200).send(Buffer.from(data));
                            // Delete the temporary files
                            fs.unlink(musicFile, (err) => {
                                if (err) console.error("Error deleting " + musicFile + ": " + err);
                            });
                            fs.unlink(wavFile, (err) => {
                                if (err) console.error("Error deleting " + wavFile + ": " + err);
                            });
                            fs.unlink(midiFile, (err) => {
                                if (err) console.error("Error deleting " + midiFile + ": " + err);
                            });
                        }
                    });
                }
            });
        }
    });
});

export default transcribeRouter;