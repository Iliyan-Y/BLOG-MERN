import React, { useState } from "react";
import { Layout } from "antd";

//Components
import DisplayList from "./components/DisplayList";
import MenuBar from "./components/MenuBar";
import CreateNote from "./components/CreateNote";

const { Content } = Layout;
const ToDoList = () => {
  const [sellectedList, setSellectedList] = useState("");

  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, textAlign: "center" }}
      >
        <div>
          <h1>To Do List</h1>
          <MenuBar
            sellectedList={sellectedList}
            setSellectedList={setSellectedList}
          />
          <CreateNote sellectedList={sellectedList} />
          <DisplayList sellectedList={sellectedList} />
        </div>
      </div>
    </Content>
  );
};

export default ToDoList;
