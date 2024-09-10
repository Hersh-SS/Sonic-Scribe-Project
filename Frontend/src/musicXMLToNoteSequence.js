import * as mm from '@magenta/music';

export async function xmlToNoteSequence(xmlString) {
    // Define the URL of your backend API
    const apiUrl = `${process.env.BACKEND_API_ENDPOINT}/convert/xml2midi`;

    // Create a new FormData instance
    const formData = new FormData();

    // Append the XML string as a Blob
    formData.append('file', new Blob([xmlString], { type: 'text/xml' }));

    // Fetch the API
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
    });

    // Check if the request was successful
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the response as an ArrayBuffer
    const midiArrayBuffer = await response.arrayBuffer();

    // Convert the MIDI ArrayBuffer to a NoteSequence
    const noteSequence = mm.midiToSequenceProto(midiArrayBuffer);

    return noteSequence;
}
