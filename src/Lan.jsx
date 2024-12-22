import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../src/css/lan.css";
import Load from "./Load";
import { useNavigate } from "react-router";
import Webcam from "react-webcam";
function Lan() {
  const [name, setname] = useState("");
  const [dep, setdep] = useState("");
  const [col, setcol] = useState("");
  const [si, setsi] = useState("black");
  const [so, setso] = useState("black");
  const [sl, setsl] = useState("black");
  const [lo, setlo] = useState(false);
  const [load, setload] = useState(true);
  const [time, settime] = useState(false);
  const [w, setw] = useState(false);
  const [mess, setmess] = useState("");
  const webcamRef = useRef(null);
  const t = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const od = async () => {
      await axios
        .post("http://localhost:800/off/od", {
          username: sessionStorage.getItem("un"),
        })
        .then((res) => {
          setname(res.data.name);
          setdep(res.data.dep);
          setcol(res.data.col);
          if (res.data.status === "i") {
            setsi("orange");
          } else if (res.data.status === "o") {
            setso("orange");
          } else {
            setsl("orange");
          }
        })
        .then(() => {
          setload(false);
        });
    };
    od();
  });
  const i = () => {
    setw(true);
  };
  const ver = async () => {
    setlo(true);
    await axios
      .post("http://localhost:800/off/in", {
        username: sessionStorage.getItem("un"),
        image: webcamRef.current.getScreenshot(),
      })
      .then((res) => {
        if (res.data.status === "sc") {
          window.location.reload(false);
        } else {
          setmess("Invalid-Face");
          setlo(false);
        }
      });
  };
  const o = () => {
    settime(true);
  };
  const l = async () => {
    await axios
      .post("http://localhost:800/off/leave", {
        username: sessionStorage.getItem("un"),
      })
      .then((res) => {
        if (res.data.status === "sc") {
          window.location.reload(true);
        }
      });
  };
  const logout = () => {
    sessionStorage.removeItem("un");
    sessionStorage.removeItem("ud");
    navigate("/");
  };
  const sub = async () => {
    await axios
      .post("http://localhost:800/off/out", {
        username: sessionStorage.getItem("un"),
        time: t.current.value,
      })
      .then((res) => {
        if (res.data.status === "sc") {
          window.location.reload(true);
        }
      });
  };
  return load ? (
    <Load />
  ) : (
    <div className="lanm">
      {w ? (
        lo ? (
          <Load />
        ) : (
          <div className="wv">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "300px", height: "300px" }}
            />
            <button id="vb" onClick={ver}>
              VERIFY
            </button>
            <button
              id="vb"
              onClick={() => {
                window.location.reload(true);
              }}
            >
              GO-BACK
            </button>
            <div id="emess">{mess}</div>
          </div>
        )
      ) : (
        <div className="lanb">
          <div className="dcil">
            NAME : <span>{name}</span>
          </div>
          <div className="dcil">
            DEPARTMENT : <span>{dep}</span>
          </div>
          <div className="dcil">
            COLLEGE : <span>{col}</span>
          </div>
          <div className="dcil">
            STATUS :{" "}
            <button onClick={i} style={{ backgroundColor: `${si}` }}>
              IN
            </button>
            <button id="out" onClick={o} style={{ backgroundColor: `${so}` }}>
              OUT
            </button>
            <button id="leave" onClick={l} style={{ backgroundColor: `${sl}` }}>
              LEAVE
            </button>
          </div>
          {time && (
            <>
              <div className="dcil">
                UPTO :
                <input type="time" className="ts" ref={t} />
                <button type="submit" onClick={sub} className="ts">
                  SUBMIT
                </button>
              </div>
            </>
          )}
          <button id="lout" onClick={logout}>
            LOG-OUT
          </button>
        </div>
      )}
    </div>
  );
}
export default Lan;
