import React, { useEffect, useRef } from 'react';
import {
  array,
  bool,
  string,
  shape,
  number,
  oneOfType,
  PropTypes,
} from 'prop-types';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './index.scss';

const JsonViewer = ({ labName, labData }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const options = {
      mode: 'view', // Disable editing
      name: labName,
    };
    editorRef.current = new JSONEditor(containerRef.current, options);
    editorRef.current.set(labData);

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [labData]);

  return (
    <div className="container">
      <div ref={containerRef} />
    </div>
  );
};

JsonViewer.propTypes = {
  labName: PropTypes.string.isRequired,
  labData: PropTypes.objectOf(oneOfType([array, bool, string, number, shape({})])),
};

export default JsonViewer;
