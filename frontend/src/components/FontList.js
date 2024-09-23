import React from "react";

const FontList = ({ fonts, handleDeleteFont }) => {
  return (
    <div className="card my-4">
      <div className="card-title text-center mt-3">
        <h4>Uploaded Fonts</h4>
      </div>

      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fonts.map((font) => (
              <tr key={font.id}>
                <td>{font.id}</td>
                <td>{font.file_name}</td>
                <td>
                  <style>
                    {`
                      @font-face {
                        font-family: 'Font${font.id}';
                        src: url('http://localhost/font_system/backend/src/serve_font.php?file=${font.file_name}');
                      }
                    `}
                  </style>
                  <span style={{ fontFamily: `Font${font.id}` }}>Example Style</span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteFont(font.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FontList;
