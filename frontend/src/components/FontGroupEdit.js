import React from "react";

const FontGroupEdit = ({
  editGroupName,
  setEditGroupName,
  editFontGroupData,
  setEditFontGroupData,
  fonts,
  handleEditFontChange,
  addFontRow,
  removeFontRow,
  handleSaveEditGroup,
}) => {
  return (
    <div className="card my-4">
      <div className="card-title text-center mt-3">
        <h4>Edit Font Group</h4>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label>Group Name</label>
          <input
            type="text"
            className="form-control"
            value={editGroupName}
            onChange={(e) => setEditGroupName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fonts</label>
          {editFontGroupData.map((font, index) => (
            <div key={index} className="mb-2 d-flex align-items-center">
              <select
                className="form-control me-2"
                name="font"
                value={font.font}
                onChange={(e) => handleEditFontChange(index, e)}
              >
                <option value="">Select Font</option>
                {fonts.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.file_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control me-2"
                name="fontTitle"
                placeholder="Font Title"
                value={font.fontTitle}
                onChange={(e) => handleEditFontChange(index, e)}
              />
              <button
                className="btn btn-danger ml-2"
                onClick={() => removeFontRow(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="btn btn-primary mt-2" onClick={addFontRow}>
            Add Font
          </button>
        </div>

        <button className="btn btn-success mt-3" onClick={handleSaveEditGroup}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default FontGroupEdit;
