import React from "react";
import { Routes, Route } from "react-router-dom";
import Log from "./Log";
import Signup from "./Signup";
import Lan from "./Lan";
import Nav from "./Nav";
import Pr from "./Pr";
function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Log />}></Route>
        <Route element={<Pr />}>
          <Route path="/lan" element={<Lan />}></Route>
        </Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </div>
  );
}
export default App;
