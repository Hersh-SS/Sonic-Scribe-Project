import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const convertRouter = express.Router();

convertRouter.post("/midi2xml", bodyParser.raw({ type: "audio/midi", limit: "500mb" }), (req, res) => {
    const id = uuidv4();
    const midiFile = `${id}.midi`;
    const xmlFile = `${id}.xml`;

    fs.writeFile(midiFile, req.body, (err) => {
        if (err) {
            res.status(500).send("An error occurred creating " + midiFile + " for reason: " + err);
        } else {
            exec(`"${process.env.MUSESCORE_PATH_EXE}" ${midiFile} -o ${xmlFile}`, (err, stdout, stderr) => {
                if (err) {
                    res.status(500).send("Error converting midi file to xml file for reasons: " + err + "\n\n" + stderr);
                } else {
                    fs.readFile(xmlFile, "utf8", (err, data) => {
                        if (err) {
                            res.status(500).send("Error reading " + xmlFile + " for reason: " + err);
                        } else {
                            res.status(200).send(data);
                            // Delete the temporary files
                            fs.unlink(midiFile, (err) => {
                                if (err) console.error("Error deleting " + midiFile + ": " + err);
                            });
                            fs.unlink(xmlFile, (err) => {
                                if (err) console.error("Error deleting " + xmlFile + ": " + err);
                            });
                        }
                    });
                }
            });
        }
    });
});

convertRouter.post("/midi2pdf", bodyParser.raw({ type: "audio/midi", limit: "500mb" }), (req, res) => {
    const id = uuidv4();
    const midiFile = `${id}.midi`;
    const pdfFile = `${id}.pdf`;

    fs.writeFile(midiFile, req.body, (err) => {
        if (err) {
            res.status(500).send("An error occurred creating " + midiFile + " for reason: " + err);
        } else {
            exec(`"${process.env.MUSESCORE_PATH_EXE}" ${midiFile} -o ${pdfFile}`, (err, stdout, stderr) => {
                if (err) {
                    res.status(500).send("Error converting midi file to pdf file for reasons: " + err + "\n\n" + stderr);
                } else {
                    fs.readFile(pdfFile, (err, data) => {
                        if (err) {
                            res.status(500).send("Error reading " + pdfFile + " for reason: " + err);
                        } else {
                            res.status(200).send(data);
                            // Delete the temporary files
                            fs.unlink(midiFile, (err) => {
                                if (err) console.error("Error deleting " + midiFile + ": " + err);
                            });
                            fs.unlink(pdfFile, (err) => {
                                if (err) console.error("Error deleting " + pdfFile + ": " + err);
                            });
                        }
                    });
                }
            });
        }
    });
});

convertRouter.post("/xml2midi", bodyParser.raw({ type: "text/xml", limit: "500mb" }), (req, res) => {
    const id = uuidv4();
    const xmlFile = `${id}.xml`;
    const midiFile = `${id}.midi`;

    fs.writeFile(xmlFile, req.body, (err) => {
        if (err) {
            res.status(500).send("An error occurred creating " + xmlFile + " for reason: " + err);
        } else {
            exec(`"${process.env.MUSESCORE_PATH_EXE}" ${xmlFile} -o ${midiFile}`, (err, stdout, stderr) => {
                if (err) {
                    res.status(500).send("Error converting xml file to midi file for reasons: " + err + "\n\n" + stderr);
                } else {
                    fs.readFile(midiFile, (err, data) => {
                        if (err) {
                            res.status(500).send("Error reading " + midiFile + " for reason: " + err);
                        } else {
                            res.status(200).send(Buffer.from(data));
                            // Delete the temporary files
                            fs.unlink(xmlFile, (err) => {
                                if (err) console.error("Error deleting " + xmlFile + ": " + err);
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

convertRouter.post("/xml2pdf", bodyParser.raw({ type: "text/xml", limit: "500mb" }), (req, res) => {
    const id = uuidv4();
    const xmlFile = `${id}.xml`;
    const pdfFile = `${id}.pdf`;

    fs.writeFile(xmlFile, req.body, (err) => {
        if (err) {
            res.status(500).send("An error occurred creating " + xmlFile + " for reason: " + err);
        } else {
            exec(`"${process.env.MUSESCORE_PATH_EXE}" ${xmlFile} -o ${pdfFile}`, (err, stdout, stderr) => {
                if (err) {
                    res.status(500).send("Error converting xml file to midi file for reasons: " + err + "\n\n" + stderr);
                } else {
                    fs.readFile(pdfFile, (err, data) => {
                        if (err) {
                            res.status(500).send("Error reading " + pdfFile + " for reason: " + err);
                        } else {
                            res.status(200).send(Buffer.from(data));
                            // Delete the temporary files
                            fs.unlink(xmlFile, (err) => {
                                if (err) console.error("Error deleting " + xmlFile + ": " + err);
                            });
                            fs.unlink(pdfFile, (err) => {
                                if (err) console.error("Error deleting " + pdfFile + ": " + err);
                            });
                        }
                    });
                }
            });
        }
    });
});

export default convertRouter;