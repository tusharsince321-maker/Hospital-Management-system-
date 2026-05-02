import React from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <div className="flex min-h-full w-full flex-col">
        <Topbar />
        <main className="w-full p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

