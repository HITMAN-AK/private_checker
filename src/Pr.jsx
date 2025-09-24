import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Log from "./Log";
import axios from "axios";
function Pr() {
  const [per, setper] = useState();
  const v = async () => {
    const ud = sessionStorage.getItem("ud");
    const un = sessionStorage.getItem("un");
    if (ud !== null) {
      console.log(ud);
      await axios
        .post(`${process.env.REACT_APP_API_URL}/pr`, { ud: ud, un: un })
        .then((res) => {
          if (res.data.per === "ac") {
            setper(true);
          } else {
            setper(false);
          }
        });
    }
  };
  v();
  return per ? <Outlet /> : <Log />;
}
export default Pr;
