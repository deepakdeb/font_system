import React, { useState, useEffect } from "react";
import FontUpload from "./components/FontUpload";
import FontGroupForm from "./components/FontGroupForm";
import FontList from "./components/FontList";
import FontGroupList from "./components//FontGroupList";
import FontGroupEdit from "./components/FontGroupEdit";
import Notifications from "./components/Notifications";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [fonts, setFonts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editFontGroupData, setEditFontGroupData] = useState([]);

  useEffect(() => {
    fetchFonts();
    fetchGroups();
  }, []);

  const base_url = "http://localhost/font_system/";

  const fetchFonts = async () => {
    const response = await fetch(
      base_url  + "backend/src/index.php?action=getFonts"
    );
    const data = await response.json();
    setFonts(data);
  };

  const fetchGroups = async () => {
    const response = await fetch(
      base_url  + "backend/src/index.php?action=getGroups"
    );
    const data = await response.json();
    setGroups(data);
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("font", file);

      const response = await fetch(
        base_url  + "backend/src/index.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setError(null);
        setSuccess("Font uploaded successfully!");
        fetchFonts();
      } else {
        throw new Error(data.message || "Failed to upload font.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGroupSubmit = async (groupName, fontGroupData) => {
    if (fontGroupData.length < 2) {
      alert("Please select at least two fonts.");
      return;
    }

    try {
      const response = await fetch(
        base_url  + "backend/src/index.php",
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
        setError(null);
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
        base_url  + "backend/src/index.php",
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
        fetchGroups();
      }
    }
  };

  const handleDeleteFont = async (fontId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this font?"
    );

    if (confirmDelete) {
      const response = await fetch(
        base_url  + "backend/src/index.php",
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
        fetchFonts();
      }
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setEditGroupName(group.group_name);
    setEditFontGroupData(group.fontGroupData || []);
  };

  const handleSaveEditGroup = async () => {
    // Validation: Ensure the group name is not empty
    if (!editGroupName.trim()) {
      alert("Group name is required.");
      return;
    }
  
    // Validation: Ensure at least two fonts are selected
    if (editFontGroupData.length < 2) {
      alert("Please select at least two fonts.");
      return;
    }
  
    // Validation: Ensure all selected fonts have titles
    for (let i = 0; i < editFontGroupData.length; i++) {
      const font = editFontGroupData[i];
      if (!font.font || !font.fontTitle.trim()) {
        alert("Each font must have a title.");
        return;
      }
    }

    const fontIds = editFontGroupData.map((row) => Number(row.font));
    const hasDuplicateFonts = new Set(fontIds).size !== fontIds.length;
    if (hasDuplicateFonts) {
      alert("Each font can only be added once per group.");
      return;
    }
  
    // If all validations pass, proceed with the update
    try {
      const response = await fetch(
        base_url  + "backend/src/index.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            editGroup: {
              id: editingGroup.id,
              groupName: editGroupName,
              fontGroupData: editFontGroupData,
            },
          }),
        }
      );
  
      const data = await response.json();
      if (data.status === "success") {
        setSuccess("Font group updated successfully!");
        fetchGroups();  // Refresh the font group list
        setEditingGroup(null);  // Close the edit form
      } else {
        throw new Error(data.message || "Failed to update font group.");
      }
    } catch (error) {
      setError("Failed to update font group. Please try again.");
    }
  };
  

  const handleEditFontChange = (index, e) => {
    const updatedFonts = [...editFontGroupData];
    updatedFonts[index][e.target.name] = e.target.value;
    setEditFontGroupData(updatedFonts);
  };

  const addFontRow = () => {
    setEditFontGroupData([...editFontGroupData, { font: "", fontTitle: "" }]);
  };

  const removeFontRow = (index) => {
    const updatedFonts = [...editFontGroupData];
    updatedFonts.splice(index, 1);
    setEditFontGroupData(updatedFonts);
  };

  return (
    <div className="container">
      <h1 className="text-center mt-3 mb-5">Font Group System</h1>

      {/* Success and Error Notifications */}
      <Notifications success={success} error={error} />

      {/* Upload Font Section */}
      <FontUpload handleUpload={handleUpload} />

      {/* Font List */}
      <FontList fonts={fonts} handleDeleteFont={handleDeleteFont} base_url={base_url} />

      {/* Font Group Creation Form */}
      <FontGroupForm fonts={fonts} handleGroupSubmit={handleGroupSubmit} />

      {/* Font Group List */}
      <FontGroupList
        groups={groups}
        handleEditGroup={handleEditGroup}
        handleDeleteGroup={handleDeleteGroup}
      />

      {/* Edit Group Section */}
      {editingGroup && (
        <FontGroupEdit
          editGroupName={editGroupName}
          setEditGroupName={setEditGroupName}
          editFontGroupData={editFontGroupData}
          setEditFontGroupData={setEditFontGroupData}
          fonts={fonts}
          handleEditFontChange={handleEditFontChange}
          addFontRow={addFontRow}
          removeFontRow={removeFontRow}
          handleSaveEditGroup={handleSaveEditGroup}
        />
      )}
    </div>
  );
};

export default App;
