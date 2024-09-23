import React from "react";

const FontGroupList = ({ groups, handleEditGroup, handleDeleteGroup }) => {
  return (
    <div className="card my-4">
      <div className="card-title text-center mt-3">
        <h4>Font Groups</h4>
      </div>

      <div className="card-body">
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
                <td>{group.id} {console.log(group.fontGroupData.length)}</td>
                <td>{group.group_name}</td>
                <td>{group.fonts}</td>
                <td>{group.fontGroupData.length}</td>
                <td>
                  <button
                    onClick={() => handleEditGroup(group)}
                    className="btn btn-primary me-2"
                  >
                    Edit
                  </button>
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
  );
};

export default FontGroupList;
