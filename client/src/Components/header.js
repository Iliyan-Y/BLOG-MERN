import React, { useContext, useState, useEffect } from "react";
import { Layout, Button, Space, Menu, Dropdown } from "antd";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useTransition, animated } from "react-spring";
//local
import dj from "./Icons/dj.png";
import { DataContext } from "../DataContext";

//icons
import { MenuOutlined, UpSquareOutlined } from "@ant-design/icons";

const Head = () => {
  const {
    userData,
    setUserToken,
    userToken,
    reRender,
    setReRender,
  } = useContext(DataContext);
  const { Header } = Layout;
  const goTo = useHistory();

  // -----------Log Out ----------
  const handleLogOut = () => {
    const bodyParameters = {
      key: "value",
    };

    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };

    axios
      .post("http://localhost:5000/user/logout", bodyParameters, config)
      .then((resp) => {
        setUserToken("");
        goTo.push("/apps/blog");
        setReRender(!reRender);
      })
      .catch((err) => console.error(err));
  };

  //-------The User Menu----- .
  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => goTo.push("/user/me")}>Edit Profile</Menu.Item>
      <Menu.Item onClick={handleLogOut}>Log Out</Menu.Item>
    </Menu>
  );

  //-------The Apps Menu----- .
  const appMenu = (
    <Menu>
      <Menu.Item onClick={() => goTo.push("/apps/blog")}>Hoem</Menu.Item>
      <Menu.Item onClick={() => goTo.push("/user/blog")}>My Posts</Menu.Item>
      <Menu.Item onClick={() => goTo.push("/toDoList")}>To Do List</Menu.Item>
    </Menu>
  );

  //-------- Animation -----------
  const [animate, setAnimate] = useState(true);
  const transitions = useTransition(animate, null, {
    from: {
      transform: "rotateX(180deg) scale(5) ",
    },
    enter: {
      textAlign: "center",
      transform: "rotateX(0deg) scale(1)",
    },
    leave: {
      opacity: animate ? 0 : 1,
    },
    config: { mass: 1.6, tension: 200, friction: 6 },
  });
  useEffect(() => {
    function clear() {
      if (userToken) setTimeout(() => setAnimate(true), 100);
      else {
        setTimeout(() => setAnimate(false), 100);
      }
    }
    return clear();
  }, [userToken]);

  //Detect scroll up and down
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    function onScroll() {
      let currentPosition = window.pageYOffset; // document.documentElement.scrollTop;
      if (currentPosition > scrollTop) {
        // downscroll code
        setScrolling(false);
      } else {
        // upscroll code
        setScrolling(true);
      }
      setScrollTop(currentPosition <= 0 ? 0 : currentPosition);
    }

    window.addEventListener("scroll", onScroll);
    return window.addEventListener("scroll", onScroll);
  }, [scrollTop]);

  function backToTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // For Safari
    setScrolling(false);
  }

  return (
    <>
      <Header
        id="header"
        className="site-layout-background"
        style={{
          padding: 0,
          textAlign: "center",
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          position: scrolling ? "sticky" : "aboslute",
          top: scrolling ? 0 : "-100px",
          zIndex: 1,
          transition: "top 0.6s",
        }}
      >
        {/* ------------ LOGO / MENU --------- */}
        {userToken ? (
          <div style={{ order: 2 }}>
            <Dropdown overlay={appMenu} placement="bottomRight">
              <MenuOutlined
                style={{
                  opacity: !animate ? 0 : 1,
                  color: "white",
                  marginLeft: "1.5em",
                  fontSize: "135%",
                }}
              />
            </Dropdown>
          </div>
        ) : (
          <div style={{ order: 2 }}></div>
        )}

        {/* ------------ Title --------- */}
        <div
          onClick={() => goTo.push("/apps/blog")}
          style={{ order: 1, alignSelf: "center" }}
        >
          <h1 style={{ color: "white", transform: "translateX(1.5em)" }}>
            {userData ? "Welcome: " + userData.name : "Blog Anything"}
          </h1>
        </div>

        {/* ------------ User Log --------- */}
        <div style={{ marginRight: "1em" }}>
          <Space>
            {!userToken ? (
              <>
                <Link to="/user/login">
                  <Button type="primary" size="small">
                    LogIn
                  </Button>
                </Link>
                <Link to="/user/signin">
                  <Button type="primary" size="small">
                    SignIn
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {transitions.map(
                  ({ item, key, props }) =>
                    item && (
                      <animated.div key={key} style={props}>
                        <Dropdown overlay={userMenu} placement="bottomRight">
                          <img
                            alt=""
                            style={{
                              margin: "0.1em",
                              width: "4.1em",
                              height: "4.1em",
                              borderRadius: "2.1em",
                              boxShadow:
                                "0px 0px 0px 1.8px rgba(255, 255, 255,0.4)",
                            }}
                            src={userData && userData.img ? userData.img : dj}
                          />
                        </Dropdown>
                      </animated.div>
                    )
                )}
              </>
            )}
          </Space>
        </div>
      </Header>
      <UpSquareOutlined
        onClick={backToTop}
        style={{
          color: "grey",
          fontSize: "350%",
          width: "5%",
          position: scrolling ? "sticky" : "aboslute",
          top: scrolling ? "10%" : "-60px",
          zIndex: 1,
          opacity: window.pageYOffset < 99 ? 0 : 1,
          display: window.pageYOffset > 99 ? "inherit" : "none",
          transition: "top 0.6s, opacity 0.5s",
        }}
      />
    </>
  );
};

export default Head;
