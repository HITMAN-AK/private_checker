import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../src/css/sup.css";
function Signup() {
  const navigate = useNavigate();
  const [nu, setnu] = useState(false);
  const [sh, setsh] = useState(false);
  const [sb, setsb] = useState(true);
  const [mess1, setmess1] = useState("");
  const [mess2, setmess2] = useState("");
  const [ca, setca] = useState("");
  const [col, setcol] = useState("red");
  const uname = useRef(null);
  const pass = useRef(null);
  const uid = useRef(null);
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
          await axios
            .post("http://localhost:800/off/newup", {
              uuid: sessionStorage.getItem("userid"),
              uname: uname.current.value,
              pass: pass.current.value,
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
