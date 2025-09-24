import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const [load, setload] = useState(true);
  const [lastSeen, setLastSeen] = useState(Date.now()); // track last valid face
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user details

  useEffect(() => {
    const od = async () => {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/od`, {
        username: sessionStorage.getItem("un"),
      });
      setname(res.data.name);
      setdep(res.data.dep);
      setcol(res.data.col);
      if (res.data.status === "i") setsi("orange");
      else if (res.data.status === "o") setso("orange");
      else setsl("orange");
      setload(false);
    };
    od();
  }, []);

  // Function to auto capture and verify
  const autoVerify = useCallback(async () => {
    if (!webcamRef.current) return;

    const image = webcamRef.current.getScreenshot();
    if (!image) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/in`, {
        username: sessionStorage.getItem("un"),
        image,
      });

      if (res.data.status === "sc") {
        setLastSeen(Date.now());
        setsi("orange");
        setso("black");
        setsl("black");
      }
    } catch (error) {
      console.error("Verification error", error);
    }
  }, [webcamRef]); // dependency

  // Run every 1 minute
  useEffect(() => {
    const interval = setInterval(autoVerify, 60000);
    return () => clearInterval(interval);
  }, [autoVerify]); // add dependency here
  // Check if absent for 5 mins → auto OUT
  useEffect(() => {
    const checkAbsent = setInterval(async () => {
      if (Date.now() - lastSeen > 5 * 60 * 1000) {
        // 5 min
        await axios
          .post(`${process.env.REACT_APP_API_URL}/out`, {
            username: sessionStorage.getItem("un"),
          })
          .then((res) => {
            if (res.data.status === "sc") {
              setso("orange");
              setsi("black");
              setsl("black");
            }
          });
      }
    }, 60000); // check every 1 min

    return () => clearInterval(checkAbsent);
  }, [lastSeen]);
  const leave = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/leave`, {
        username: sessionStorage.getItem("un"),
      })
      .then((res) => {
        if (res.data.status === "sc") {
          setsi("black");
          setso("black");
          setsl("orange");
        }
      });
  };
  const logout = () => {
    sessionStorage.removeItem("un");
    sessionStorage.removeItem("ud");
    navigate("/");
  };

  return load ? (
    <Load />
  ) : (
    <div className="lanm">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: "300px", height: "300px" }}
      />
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
          STATUS : <button style={{ backgroundColor: `${si}` }}>IN</button>
          <button style={{ backgroundColor: `${so}` }}>OUT</button>
          <button style={{ backgroundColor: `${sl}` }} onClick={leave}>
            LEAVE
          </button>
        </div>

        <button id="lout" onClick={logout}>
          LOG-OUT
        </button>
      </div>
    </div>
  );
}

export default Lan;
