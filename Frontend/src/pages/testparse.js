import React, { useState } from 'react';
import MusicXMLParser from '../components/MusicXMLParser/MusicXMLParser'; // Adjust the import path as necessary

const TestParsePage = () => {
 const [file, setFile] = useState(null);
 const [xmlString, setXmlString] = useState('');

 const handleFileChange = (event) => {
    setFile(event.target.files[0]);
 };

 const handleParse = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const xmlString = event.target.result;
        setXmlString(xmlString); // Store the XML string in state
      };
      reader.readAsText(file); // Read the file as text
    }
 };

 return (
    <div>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      <button onClick={handleParse}>Parse MusicXML</button>
      {xmlString && <MusicXMLParser sourceFileURL={xmlString} isPreview={false} />}
    </div>
 );
};

export default TestParsePage;
