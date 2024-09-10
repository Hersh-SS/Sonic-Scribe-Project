import React, { useEffect, useRef } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';

const MusicXMLParser = ({ sourceFileURL, isPreview, width, height, drawTitle, color = "white" }) => {
  const osmdContainerRef = useRef(null);
  const osmdRef = useRef(null);

  const getOptions = () => {
    const previewOptions = {
      drawingParameters: "compacttight",
      drawTitle: drawTitle,
      drawUpToPageNumber: 1,
      pageFormat: "A4_P"
    }

    const notPreviewOptions = {
      defaultColorMusic: color,
      drawingParameters: "compacttight",
      drawTitle: drawTitle,
    }

    if (isPreview) return previewOptions;
    else return notPreviewOptions;
  }

  useEffect(() => {
    osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current);
    osmdRef.current.setOptions(getOptions());
    osmdRef.current.load(sourceFileURL).then(() => {
      osmdRef.current.render();
    });

  }, []);

  return <div ref={osmdContainerRef} style={{ width: width, height: height }} />;
};

export default MusicXMLParser;