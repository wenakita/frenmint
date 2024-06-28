import React from "react";

function Analytics() {
  return (
    <div className="container ">
      <iframe
        title="Google Data Studio Report"
        src="https://lookerstudio.google.com/embed/reporting/273c7527-0bda-4060-a2ef-004f81fdf9b8/page/p_x5sbjzathd"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        className="w-screen h-screen"
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
}

export default Analytics;
