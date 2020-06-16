import React from "react";
import { Layout } from "antd";

//local
import BlogHome from "./Blog/blogHome";

const { Content } = Layout;

const Body = () => {
  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, textAlign: "center" }}
      >
        <BlogHome />
      </div>
    </Content>
  );
};

export default Body;
