import React, { useState, useEffect } from "react";
import Pdftron from "./Pdftron";
import axios from "axios";
import { auth } from "../Config";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./Search";
import Notificaton from "./Notificaton";

//Renders user personal files 
const Home = () => {
  const filterPosts = (posts, query) => {
    if (!query) {
      return posts;
    }

    return posts.filter((post) => {
      const postName = post.name.toLowerCase();
      return postName.includes(query);
    });
  };

  const [user] = useAuthState(auth);
  const [filelist, setfilelist] = useState(null);
  const [notifications, setnotifications] = useState([]);
  const [fileset, setfileset] = useState();
  const [boolean, setboolean] = useState(false);
  const { search } = window.location;
  const query = new URLSearchParams(search).get("s");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const filteredPosts = filterPosts(filelist, searchQuery);

  //deletes the file from the server
  const deletefile = (item) => {
    axios
      .delete(`http://localhost:5000/ppt/${item}`)
      .then((resp) => {
        callbackend();
      })
      .catch((err) => console.log(err));
  };
  const callbackend = () => {
    axios
      .get(`http://localhost:5000/ppt/user/${user._delegate.email}`)
      .then((resp) => {
        setfilelist(resp.data);
      })
      .catch((err) => console.log(err));
  };
  const callbackend2 = () => {
    axios
      .get(`http://localhost:5000/ppt/user/${user._delegate.email}/commentsreq`)
      .then((resp) => {
        setnotifications(resp.data);
        console.log(resp.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    callbackend();
    callbackend2();

  }, [user]);
  const showViewer = (value) => {
    setboolean(true);
    setfileset(value);
  };


  //List all the files uploaded by the user to the server 
  const DisplayImagesFromContainer = () => (
    <div>
      <div>
        <h1>Comment Notifications</h1>
        {
          notifications.map((resp)=>{
            return resp.map((item)=>{
              return <><Notificaton comment={item.comment} author={item.author} id={item.id} pptid={item.pptid} slide={item.slideid}/><br/></> 
            })
          })
        }
      </div>
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
        List of my files
      </h1>
      <div style={{ marginLeft: "2.5%", padding: "1%", marginBottom: "2%" }}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <ul style={{ display: "block", fontSize: "1.0em", fontWeight: "normal" }}>
        {filteredPosts.map((post) => {
          return (
            <>
              <li
                style={{
                  listStyle: "square",
                  paddingTop: "12px",
                  paddingBottom: "0px",
                }}
                key={post.key}
              >
                {" "}
                <div>
                  <div
                    style={{ display: "inline", width: "35%", float: "left" }}
                    onClick={(event) => {
                      showViewer(post.pdfurl);
                    }}
                  >
                    {post.name}
                  </div>{" "}
                  <div
                    style={{ display: "inline", width: "5%", float: "left" }}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={(event) => {
                        deletefile(post.name);
                      }}
                    />
                  </div>
                  <div>
                    <a href={post.ppturl} download={post.name}>
                      <FontAwesomeIcon icon={faDownload} />
                    </a>
                  </div>
                </div>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {!boolean && filelist && DisplayImagesFromContainer()}
      {boolean && fileset && (
        <div>
          <Pdftron url={fileset} />
        </div>
      )}
    </>
  );
};
export default Home;
