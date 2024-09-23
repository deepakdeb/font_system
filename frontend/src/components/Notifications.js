import React from "react";

const Notifications = ({ success, error }) => {
  return (
    <>
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </>
  );
};

export default Notifications;
