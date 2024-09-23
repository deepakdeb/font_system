import React, { useState } from "react";

const FontGroupForm = ({ fonts, handleGroupSubmit }) => {
  const [groupName, setGroupName] = useState("");
  const [fontGroup, setFontGroup] = useState([{ font: "", fontTitle: "" }]);
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState(""); // For backend errors

  // Reset the form
  const resetForm = () => {
    setGroupName("");
    setFontGroup([{ font: "", fontTitle: "" }]);
    setErrors({});
    setBackendError(""); // Clear backend error
  };

  // Add a new dropdown for font selection with font title
  const addRow = () => {
    setFontGroup([...fontGroup, { font: "", fontTitle: "" }]);
  };

  // Update the font selection and font title for each row
  const handleFontChange = (index, e) => {
    const newFontGroup = [...fontGroup];
    newFontGroup[index].font = e.target.value;
    setFontGroup(newFontGroup);
  };

  const handleFontTitleChange = (index, e) => {
    const newFontGroup = [...fontGroup];
    newFontGroup[index].fontTitle = e.target.value;
    setFontGroup(newFontGroup);
  };

  // Remove a row
  const removeRow = (index) => {
    const newFontGroup = [...fontGroup];
    newFontGroup.splice(index, 1);
    setFontGroup(newFontGroup);
  };

  // Validate the form before submission
  const validateForm = () => {
    let formErrors = {};

    // Validate group name
    if (!groupName.trim()) {
      formErrors.groupName = "Group name is required.";
    }

    // Validate font selection
    const selectedFonts = fontGroup.filter((row) => row.font && row.fontTitle);
    if (selectedFonts.length < 2) {
      formErrors.fontGroup =
        "Please select at least two fonts and provide their titles.";
    }

    // Validate unique fonts (no duplicate fonts allowed)
    const fontIds = selectedFonts.map((row) => row.font);
    const hasDuplicateFonts = new Set(fontIds).size !== fontIds.length;
    if (hasDuplicateFonts) {
      formErrors.fontGroup = "Each font can only be added once per group.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const onSubmit = async () => {
    if (validateForm()) {
      const selectedFonts = fontGroup.filter(
        (row) => row.font && row.fontTitle
      );

      // Call handleGroupSubmit and handle backend validation
      const result = await handleGroupSubmit(groupName, selectedFonts);

      if (result.status === "error") {
        setBackendError(result.message); // Display backend error
      } else {
        resetForm(); // Reset form on successful submission
      }
    }
  };

  return (
    <div className="card">
      <div className="card-title text-center mt-3">
        <h4>Create Font Group</h4>
      </div>

      <div className="card-body">
        <div className="mb-5">
          {/* Group Name */}
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control mb-3"
          />
          {errors.groupName && (
            <div className="text-danger">{errors.groupName}</div>
          )}
          {/* Render font selection dropdowns with font title input */}
          {fontGroup.map((row, index) => (
            <div key={index} className="mb-2 d-flex align-items-center">
              {/* Font selection dropdown */}
              <select
                className="form-select me-2"
                value={row.font}
                onChange={(e) => handleFontChange(index, e)}
              >
                <option value="">Select Font</option>
                {fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.file_name}
                  </option>
                ))}
              </select>

              {/* Font title input */}
              <input
                type="text"
                placeholder="Font Title"
                value={row.fontTitle}
                onChange={(e) => handleFontTitleChange(index, e)}
                className="form-control me-2"
              />

              {/* Delete Row button */}
              {index > 0 && (
                <button
                  onClick={() => removeRow(index)}
                  className="btn btn-outline-danger"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          {errors.fontGroup && (
            <div className="text-danger">{errors.fontGroup}</div>
          )}
          {backendError && <div className="text-danger">{backendError}</div>}
          {/* Add Row button */}
          <button onClick={addRow} className="btn btn-outline-success">
            + Add Row
          </button>
          {/* Submit Group button */}
          <button onClick={onSubmit} className="btn btn-success float-end">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontGroupForm;
