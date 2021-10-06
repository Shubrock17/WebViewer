import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";

const Pdftron = () => {
  const Viewdiv = useRef(null);
  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc:
          "https://v2.convertapi.com/d/o0l72eqxjnzp9suws3e0djzlzuqtmjju/7265e42bruteforce_3_idea.pdf",
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
