import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { Layout } from "antd";

//local
import { DataContext } from "../DataContext";
import Head from "./header";
import Body from "./Body";
//auth
import About from "./About";
import LogIn from "./Auth/LogIn";
import SignIn from "./Auth/SignIn";
//apps
import UserBlogHome from "./Blog/UserBlogHome";
import ToDoList from "./toDoList/toDoList";
import CreatePost from "./Blog/createPost";
import UserProfile from "./Auth/UserProfile";
import VrefPage from "./Auth/VrefPage";

const Home = () => {
  const { currentOpenPage, userToken, userData } = useContext(DataContext);
  const { Footer } = Layout;

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          <Head />
          <Switch>
            <Route exact path="/" component={About} />
            <Route path="/apps" component={Body} />

            <Route path="/user/login" component={LogIn} />
            <Route path="/user/signin" component={SignIn} />
            <Route path="/verify" component={VrefPage} />

            {/* ------------AppS-------------- */}
            {userData ? (
              <>
                <Route path="/createPost" component={CreatePost} />
                <Route path="/toDoList" component={ToDoList} />
                <Route path="/user/blog" component={UserBlogHome} />
                <Route path="/user/me" component={UserProfile} />
              </>
            ) : (
              ""
            )}

            <Redirect from="/" to={currentOpenPage} />
          </Switch>

          <Footer
            style={{ textAlign: "center", background: "black", color: "white" }}
          >
            Blog Anything Project 2020
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Home;
