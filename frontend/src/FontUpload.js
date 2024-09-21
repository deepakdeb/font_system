import React, { useState } from "react";

const FontUpload = ({ handleUpload }) => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = () => {
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="my-5">
          <input type="file" onChange={onFileChange} accept=".ttf" />
          <button onClick={onSubmit} className="btn btn-primary">
            Upload Font
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontUpload;
