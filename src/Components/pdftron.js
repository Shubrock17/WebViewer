import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";

const Home = () => {
  const viewdiv = useRef(null);
  useEffect(() => {
    WebViewer(
      {
        path: "lib",
        initialDoc:
          "https://v2.convertapi.com/d/o0l72eqxjnzp9suws3e0djzlzuqtmjju/7265e42bruteforce_3_idea.pdf",
      },
      viewdiv.current
    ).then((instance) => {});
  }, []);
  return (
    <>
      <h1>Home Page</h1>

      <div
        className="webviewer"
        ref={viewdiv}
        style={{ height: "100vh" }}
      ></div>
    </>
  );
};

export default Home;
