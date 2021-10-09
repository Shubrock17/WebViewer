import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Viewer from "../Viewer";
import SearchBar from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload} from "@fortawesome/free-solid-svg-icons";

const MyView = () => {
  const filterPosts = (posts, query) => {
    if (!query) {
      return posts;
    }

    return posts.filter((post) => {
      const postName = post.name.toLowerCase();
      return postName.includes(query);
    });
  };

  const [filelist, setfilelist] = useState(null);
  const [filename, setfilename] = useState(null);
  const [boolean, setboolean] = useState(false);
  const { search } = window.location;
  const query = new URLSearchParams(search).get("s");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const filteredPosts = filterPosts(filelist, searchQuery);

  useEffect(() => {
    axios
      .get("http://localhost:5000/ppt")
      .then((resp) => {
        console.log(resp.data);
        setfilelist(resp.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const [fileset, setfileset] = useState();
  const showViewer = (value, value2) => {
    setboolean(true);
    setfileset(value);
    setfilename(value2);
  };
  const DisplayImagesFromContainer = () => (
    <div>
      <h1
        style={{
          fontFamily: "georgia",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          height: "0vh",
        }}
      >
        List of All files
      </h1>
      <div style={{ marginLeft: "2.5%", padding: "1%", marginBottom: "2%" }}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <ul style={{ display: "block", fontSize: "1.0em", fontWeight: "normal" }}>
        {filteredPosts.map((post) => {
          return (
            <>
              {!post.isprivate && (
                <li
                  style={{
                    listStyle: "square",
                    paddingTop: "12px",
                    paddingBottom: "0px",
                  }} 
                >
                  {" "}
                    <div
                      style={{ display: "inline", width: "50%", float: "left"}}
                      onClick={(event) => {
                        showViewer(post.pdfurl, post.name);
                      }}
                    >
                      {post.name}
                    </div>{" "}
                    <div
                      style={{ display: "inline", width: "5%", float: "left" }}
                    >
                      <a href={post.ppturl}download={post.name}>
                      <FontAwesomeIcon
                        icon={faDownload}
                      />
                      </a>
                    </div>
                </li>
              )}
            </>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {!boolean && filelist && DisplayImagesFromContainer()}
      {boolean && (
        <div>
          <Viewer pdf={fileset} filename={filename} />
        </div>
      )}
    </>
  );
};

export default MyView;
