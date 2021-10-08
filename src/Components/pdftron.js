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
    ).then((instance) => {
      instance.UI.setHeaderItems(header => {
        header.push({
          type: 'actionButton',
          img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
          onClick: () => {
            const { documentViewer, annotationManager } = instance.Core;

            documentViewer.addEventListener('documentLoaded', async () => {
              const doc = documentViewer.getDocument();
              const xfdfString = await annotationManager.exportAnnotations();
              const options = { xfdfString };
              const data = await doc.getFileData(options);
              const arr = new Uint8Array(data);
              const blob = new Blob([arr], { type: 'application/pdf' });
              console.log(blob);
              const objectURL = URL.createObjectURL(blob);
              console.log(objectURL);
              window.location.href = objectURL;
            });
           }
        });
      });
    });
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
