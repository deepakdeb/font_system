import React, { useState, useEffect } from "react";
import FontUpload from "./FontUpload";
import FontGroupForm from "./FontGroupForm";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [fonts, setFonts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null); // Error message state
  const [success, setSuccess] = useState(null); // Success message state

  useEffect(() => {
    fetchFonts();
    fetchGroups();
  }, []);

  const fetchFonts = async () => {
    const response = await fetch(
      "http://localhost/font_system/backend/src/index.php?action=getFonts"
    );
    const data = await response.json();
    setFonts(data);
  };

  const fetchGroups = async () => {
    const response = await fetch(
      "http://localhost/font_system/backend/src/index.php?action=getGroups"
    );
    const data = await response.json();
    setGroups(data);
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("font", file);

      const response = await fetch(
        "http://localhost/font_system/backend/src/index.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setError(null); // Clear any previous error
        setSuccess("Font uploaded successfully!");
        fetchFonts(); // Refresh the font list
      } else {
        throw new Error(data.message || "Failed to upload font.");
      }
    } catch (err) {
      setError(err.message); // Set the error message to display
    }
  };

  const handleGroupSubmit = async (groupName, fontGroupData) => {
    if (fontGroupData.length < 2) {
      alert("Please select at least two fonts.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/font_system/backend/src/index.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupName, fontGroupData }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setError(null); // Clear any previous errors
        setSuccess("Font group created successfully!");
        fetchGroups();
      } else {
        throw new Error(data.message || "Failed to create font group.");
      }

      return data;
    } catch (error) {
      return {
        status: "error",
        message: "Failed to create font group. Please try again.",
      };
    }
  };

  const handleDeleteGroup = async (groupId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this font group?"
    );

    if (confirmDelete) {
      const response = await fetch(
        "http://localhost/font_system/backend/src/index.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deleteGroup: groupId }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        fetchGroups(); // Refresh the list of font groups after deletion
      }
    }
  };

  const handleDeleteFont = async (fontId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this font?"
    );

    if (confirmDelete) {
      const response = await fetch(
        "http://localhost/font_system/backend/src/index.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deleteFont: fontId }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        fetchFonts(); // Refresh the list of fonts after deletion
      }
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-3 mb-5">Font Group System</h1>

      {/* Success Message Display */}
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Upload Font Section */}
      <FontUpload handleUpload={handleUpload} />

      <div className="card my-4">
        <div className="card-title text-center mt-3">
          <h4>Uploaded Fonts</h4>
        </div>

        <div className="card-body">
          {/* Font List Table */}

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
                    {/* Apply the uploaded font style */}
                    <style>
                      {`
                                                @font-face {
                                                    font-family: 'Font${font.id}';
                                                    src: url('http://localhost/font_system/backend/src/serve_font.php?file=${font.file_name}');
                                                }
                                            `}
                    </style>
                    <span style={{ fontFamily: `Font${font.id}` }}>
                      Example Style
                    </span>
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
      {/* Font Group Form */}
      <FontGroupForm fonts={fonts} handleGroupSubmit={handleGroupSubmit} />

      <div className="card my-4">
        <div className="card-title text-center mt-3">
          <h4>Font Groups</h4>
        </div>

        <div className="card-body">
          {/* Font Groups List Table with Font Count */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Group Name</th>
                <th>Fonts</th>
                <th>Font Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.id}</td>
                  <td>{group.group_name}</td>
                  <td>{group.fonts}</td>
                  <td>{group.font_count}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
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
    </div>
  );
};

export default App;
