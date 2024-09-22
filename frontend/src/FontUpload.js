import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FontUpload = ({ handleUpload }) => {
    const [error, setError] = useState(null);  // State for storing error message

    // Handle valid files
    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            handleUpload(acceptedFiles[0]);
            setError(null);  // Clear any previous errors when a valid file is dropped
        }
    };

    // Handle invalid files (file type mismatch)
    const onDropRejected = (fileRejections) => {
        setError('Invalid file format. Please upload a .ttf file.');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            'font/ttf': ['.ttf'],
        },  // Accept only font files with both MIME types and extensions
        multiple: false,  // Allow only one file at a time
    });

    return (
        <div>
            {/* Show error message if present */}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <div {...getRootProps()} className="dropzone" style={dropzoneStyle}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the file here...</p>
                ) : (
                    <p>Drag & drop font files here, or click to select files</p>
                )}
            </div>
        </div>
    );
};

const dropzoneStyle = {
    border: '2px dashed #007bff',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
    color: '#007bff',
    cursor: 'pointer',
};

export default FontUpload;
