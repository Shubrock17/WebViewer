import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";

const Pdftron = (props) => {
  const Viewdiv = useRef(null);
  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc:props.url,
      },
      Viewdiv.current
    ).then((instance) => {});
  }, []);
  return (
    <>
      <div
        className="webviewer"
        ref={Viewdiv}
        style={{ height: "100vh" }}
      ></div>
    </>
  );
};

export default Pdftron;
