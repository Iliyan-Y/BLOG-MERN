import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

//antd
import { Collapse, Dropdown, Layout, Space, Button } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MenuOutlined,
} from "@ant-design/icons";

//local
import { DataContext } from "../../DataContext";
import OptionMenu from "./optionMenu";
import DisplayEditor from "./TextEditor/DisplayEditor";
import SortForm from "./SortForm";
import DisplayComments from "./comments/displayComments";

const { Panel } = Collapse;

const useGetPosts = (sort) => {
  const [allPosts, setAllPosts] = useState([]);
  const { reRender, setBlogData, userData, userToken } = useContext(
    DataContext
  );

  const body = {
    userId: userData ? userData._id : "",
    sortBy: { createdAt: sort },
  };

  const config = {
    headers: { Authorization: `Bearer ${userToken}` },
  };

  useEffect(() => {
    function unsub() {
      axios.post("/user/blog", body, config).then(async (res) => {
        if (res.data.length > 0) {
          setAllPosts(await res.data);
          setBlogData(await res.data);
        }
      });
    }
    unsub();
  }, [reRender]);
  return allPosts;
};

const UserBlogHome = () => {
  const [sellect, setSellect] = useState(-1);
  const allPosts = useGetPosts(sellect);
  const { setCurrentOpenPage, userData, reRender, setReRender } = useContext(
    DataContext
  );
  const [openPanel, setOpenPanel] = useState(null);
  const [panelDisabled, setPanelDisabled] = useState(false);
  const goTo = useHistory();
  const { Content } = Layout;

  let reLoadContent = userData ? userData._id : "";

  //reload posts on refresh
  useEffect(() => {
    const unsub = () => {
      setReRender(!reRender);
    };
    return unsub();
  }, [reLoadContent]);

  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, textAlign: "center" }}
      >
        <div style={{ marginBottom: "1.2em" }}>
          <Space>
            <Button onClick={() => goTo.push("/createPost")}>
              Create post
            </Button>
            Sort By:
            <SortForm
              setSellect={setSellect}
              reRender={reRender}
              setReRender={setReRender}
            />
          </Space>
        </div>
        <div>
          <Collapse
            expandIconPosition="right"
            style={{ fontSize: "110%" }}
            bordered={false}
            onChange={(panel) => {
              if (openPanel === null) {
                setOpenPanel(panel.toString());
                setCurrentOpenPage(`/user/blog/${panel.toString()}`);
                goTo.push(`/user/blog/${panel.toString()}`);
              } else {
                setOpenPanel(null);
                setCurrentOpenPage("/user/blog/");
                goTo.push(`/user/blog/`);
              }
            }}
            activeKey={openPanel}
          >
            {/* Create panel for each post of the blog to be displayed */}
            {allPosts.map((each) => (
              <Panel
                disabled={panelDisabled}
                header={
                  // Blog Title and Description starts here
                  <div>
                    {openPanel ? (
                      <div
                        style={{
                          display: "flex",
                          marginRight: "-2.4em",
                          justifyContent: "flex-end",
                        }}
                      >
                        {userData ? (
                          <Dropdown
                            onMouseEnter={() => setPanelDisabled(true)}
                            onMouseLeave={() => setPanelDisabled(false)}
                            trigger="click"
                            overlay={
                              <OptionMenu
                                each={each}
                                setPanelDisabled={setPanelDisabled}
                              />
                            }
                          >
                            <span
                              style={{ color: "blue", cursor: "pointer" }}
                              className="ant-dropdown-link"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <span style={{ display: "flex" }}>
                                <p style={{ marginRight: "0.2em" }}>
                                  Edit Post
                                </p>
                                <MenuOutlined style={{ fontSize: "135%" }} />
                              </span>
                            </span>
                          </Dropdown>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : null}
                    <h1>{each.title}</h1>
                    <img
                      style={{ maxHeight: "240px", maxWidth: "85%" }}
                      src={each.thumb}
                      alt="thumbnail"
                    />
                    <p
                      style={{
                        marginBottom: "-14px",
                        color: openPanel !== each._id ? "grey" : "#424242",
                      }}
                    >
                      {each.description}
                      {openPanel !== each._id ? <ArrowDownOutlined /> : ""}
                    </p>
                  </div>
                }
                key={each._id}
              >
                {/* Blog body starts here !  */}
                <div className="Container">
                  <DisplayEditor postData={each.postText} />
                </div>
                <DisplayComments openPanel={openPanel} />
                <ArrowUpOutlined
                  style={{ fontSize: "150%", padding: "0.5em" }}
                  onClick={() => setOpenPanel(null)}
                />
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenPanel(null)}
                >
                  Close
                </p>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </Content>
  );
};

export default UserBlogHome;
