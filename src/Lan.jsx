import React, { useEffect, useState } from "react";
import axios from "axios";
import "../src/css/lan.css";
import Load from "./Load";
function Lan() {
  const [name, setname] = useState("");
  const [dep, setdep] = useState("");
  const [col, setcol] = useState("");
  const [si, setsi] = useState("black");
  const [so, setso] = useState("black");
  const [sl, setsl] = useState("black");
  const [load, setload] = useState(true);
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
  const i = async () => {
    await axios
      .post("http://localhost:800/off/in", {
        username: sessionStorage.getItem("un"),
      })
      .then((res) => {
        if (res.data.status === "sc") {
          window.location.reload(false);
        }
      });
  };
  const o = async () => {
    await axios
      .post("http://localhost:800/off/out", {
        username: sessionStorage.getItem("un"),
      })
      .then((res) => {
        if (res.data.status === "sc") {
          window.location.reload(true);
        }
      });
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
  return load ? (
    <Load />
  ) : (
    <div className="lanm">
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
      </div>
    </div>
  );
}
export default Lan;
