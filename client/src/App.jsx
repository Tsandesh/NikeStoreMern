import React from "react";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Succes from "./components/Succes";
import Cancel from "./components/Cancel";
import { Cart, Footer, Navbar } from "./components";
import { footerAPI } from "./data/data";

const App = () => {
  return (
    <>
      <Navbar />
      <Cart />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Home />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
      <Footer footerAPI={footerAPI} />
    </>
  );
};

export default App;
