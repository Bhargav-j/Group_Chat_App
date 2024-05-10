// import React from 'react';
import { Routes, Route } from "react-router-dom";
// import AppRoutes from "./routes/index";
import ChatRoutes from "./routes/ChatRoutes";

function Layout() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="*" element={<ChatRoutes />} />
      </Routes>
      {/* <Footer/> */}
    </>
  );
}

export default Layout;
