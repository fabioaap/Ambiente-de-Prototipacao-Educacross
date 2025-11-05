
import React from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-[#F7F6FF]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
