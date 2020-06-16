import React from "react";
import "antd/dist/antd.css";
import "react-quill/dist/quill.snow.css";

//local
import { DataProvider } from "./DataContext";
import Home from "./Components/Home";

function App() {
  return (
    <div id="red">
      <DataProvider>
        <Home />
      </DataProvider>
    </div>
  );
}

export default App;
