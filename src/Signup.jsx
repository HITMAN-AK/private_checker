import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
import axios from "axios";
import "../src/css/sup.css";
function Signup() {
  const navigate = useNavigate();
  const [nu, setnu] = useState(false);
  const [bs, setbs] = useState(true);
  const [sh, setsh] = useState(false);
  const [sb, setsb] = useState(true);
  const [mess1, setmess1] = useState("");
  const [mess2, setmess2] = useState("");
  const [ca, setca] = useState("");
  const [col, setcol] = useState("red");
  const uname = useRef(null);
  const pass = useRef(null);
  const uid = useRef(null);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const nsub = async () => {
    if (uname.current.value === "") {
      if (pass.current.value === "") {
        setmess2("FIELD IS EMPTY");
      } else {
        setmess2("FIELD IS EMPTY");
      }
    } else {
      if (pass.current.value === "") {
        setmess2("FIELD IS EMPTY");
      } else {
        if (pass.current.value.length > 5) {
          if (image) {
            await axios
              .post("http://localhost:800/off/newup", {
                uuid: sessionStorage.getItem("userid"),
                uname: uname.current.value,
                pass: pass.current.value,
                image:image
              })
              .then((res) => {
                if (res.data.status === "sc") {
                  sessionStorage.removeItem("userid");
                  navigate("/");
                } else {
                  setmess2("USERNAME ALREADY EXSIST");
                }
              });
          } else {
            setmess2("NO PICTURE WAS CAPTURED");
          }
        } else {
          setmess2("PASSWORD MUST BE ABOVE 5 CHARACTER");
        }
      }
    }
  };
  const usub = async () => {
    if (uid.current.value === "") {
      setmess1("FIELD IS EMPTY");
    } else {
      await axios
        .get("http://localhost:800/off/cuid", {
          headers: {
            uuid: uid.current.value,
          },
        })
        .then((res) => {
          if (res.data.status === "sc") {
            sessionStorage.setItem("userid", uid.current.value);
            setnu(true);
          } else if (res.data.status === "ae") {
            setmess1("ALREADY CREATED");
          } else {
            setmess1("INVALID USER ID");
          }
        });
    }
  };
  const captureImage = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImage(capturedImage);
    setbs(false);
    console.log(capturedImage);
  };
  const retake = () => {
    setbs(true);
    setImage(null);
  };
  const check = async () => {
    if (uname.current.value === "") {
      setca("FIELD IS EMPTY");
    } else {
      await axios
        .post("http://localhost:800/off/ca", {
          uname: uname.current.value,
        })
        .then((res) => {
          if (res.data.status === "sc") {
            setca("USER NAME AVAILABLE");
            setcol("green");
          } else {
            setca("USER NAME NOT AVAILABLE");
            setcol("red");
          }
        });
    }
  };
  const show = () => {
    setsh(true);
    setsb(false);
  };
  const hide = () => {
    setsh(false);
    setsb(true);
  };
  return (
    <div className="smain">
      {nu ? (
        <div className="nbody">
          <div id="cup">CREATE YOUR USERNAME AND PASSWORD</div>
          <h4>PHOTO FOR FACE IDENTIFICATION</h4>
          {!image ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "100%", maxWidth: "500px", marginBottom: "20px" }}
            />
          ) : (
            <div style={{ marginTop: "20px" }}>
              <img
                src={image}
                alt="Captured"
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </div>
          )}
          {bs ? (
            <button
              onClick={captureImage}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "black",
                color: "white",
              }}
            >
              Capture
            </button>
          ) : (
            <button
              onClick={retake}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                backgroundColor: "black",
                color: "white",
              }}
            >
              Retake
            </button>
          )}
          <input
            className="upsm"
            type="text"
            placeholder="ENTER YOUR USERNAME"
            ref={uname}
          />
          <button id="ck" onClick={check}>
            CHECK
          </button>
          <br />
          <div id="av" style={{ color: `${col}` }}>
            {ca}
          </div>
          <input
            className="upsm"
            type={sh ? "text" : "password"}
            placeholder="ENTER YOUR PASSWORD"
            ref={pass}
          />
          {sb ? (
            <button id="sp" onClick={show}></button>
          ) : (
            <button id="hp" onClick={hide}></button>
          )}
          <br />
          <button className="upsm" id="nsub" onClick={nsub}>
            SUBMIT
          </button>
          <div className="upsm" id="mess">
            {mess2}
          </div>
        </div>
      ) : (
        <div className="sbody">
          <input
            className="usm"
            type="text"
            placeholder="ENTER THE USER ID"
            ref={uid}
          />
          <button className="usm" onClick={usub}>
            SUBMIT
          </button>
          <div className="usm" id="mss">
            {mess1}
          </div>
        </div>
      )}
    </div>
  );
}
export default Signup;
