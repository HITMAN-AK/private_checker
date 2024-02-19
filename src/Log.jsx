import React, { useState } from "react";
import { useRef } from "react";
import "./css/log.css";
import { useNavigate } from "react-router";
import axios from "axios";
function Log() {
  const usr = useRef(null);
  const pass = useRef(null);
  const [lmess, setlmess] = useState("");
  const navigate = useNavigate();
  const siup = () => {
    navigate("/signup");
  };
  const submit = async (event) => {
    event.preventDefault();
    if (usr.current.value !== "") {
      if (pass.current.value !== "") {
        await axios
          .post("http://localhost:800/off/login", {
            luname: usr.current.value,
            lpass: pass.current.value,
          })
          .then((res) => {
            const j = res.data;
            console.log(j);
            if (j.name === "bc") {
              sessionStorage.setItem("un", usr.current.value);
              sessionStorage.setItem("ud", j.uuid);
              navigate("/lan");
            }
            if (j.name === "ip") {
              setlmess("INCORRECT PASSWORD");
            }
            if (j.name === "iu") {
              setlmess("INCORRECT USERNAME");
            }
            if (j.name === "bic") {
              setlmess("BOTH ARE INCORRECT");
            }
          });
      } else {
        setlmess("FIELD IS EMPTY");
      }
    } else {
      setlmess("FIELD IS EMPTY");
    }
  };
  return (
    <div className="login">
      <form action="POST" onSubmit={submit}>
        <h1 className="tit">login</h1>
        <br />
        <label htmlFor="una">username</label>
        <br />
        <div>
          <span className="una"></span>
          <input ref={usr} id="una" placeholder="username.." required />
          <br />
        </div>
        <br />
        <label htmlFor="una">password</label>
        <br />
        <div>
          <span className="pass"></span>
          <input ref={pass} id="pass" placeholder="password.." required />
          <br />
        </div>
        <div className="fogpass">
          <button>forgot password?</button>
        </div>
        <button type="submit" className="sr">
          submit
        </button>
        <button type="reset" className="sr">
          reset
        </button>
        <br />
        <button className="sup" onClick={siup}>
          SIGN UP
        </button>
        <br />
        <div id="lmess">{lmess}</div>
      </form>
    </div>
  );
}
export default Log;
