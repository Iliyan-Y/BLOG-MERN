import React from "react";
import { Layout } from "antd";
import { Redirect } from "react-router-dom";

const { Content } = Layout;
const VrefPage = () => {
  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, textAlign: "center" }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "250%", color: "grey" }}>
            Verification Page{alert("Verification Successful")}
            <Redirect to="/apps/blog" />
          </h1>
        </div>
      </div>
    </Content>
  );
};

export default VrefPage;
