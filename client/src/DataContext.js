import React, { useState, createContext, useEffect } from "react";

//trackUser
const useTackUser = () => {
  const [userToken, setUserToken] = useState(
    sessionStorage.getItem("token") || ""
  );

  useEffect(() => {
    sessionStorage.setItem("token", userToken);
  }, [userToken]);

  return [userToken, setUserToken];
};

export const DataContext = createContext();

export const DataProvider = (props) => {
  //navigation
  const [currentOpenPage, setCurrentOpenPage] = useState("/");
  const [selectedApp, setSelectedApp] = useState();
  //manage Blog Data
  const [reRender, setReRender] = useState(false);
  const [updatePost, setUpdatePost] = useState(false);
  const [blogData, setBlogData] = useState();
  //user
  const [userToken, setUserToken] = useTackUser();
  const [userData, setUserData] = useState();
  //To Do List

  useEffect(() => {
    //session timer
    if (userToken !== "") {
      setTimeout(() => {
        setUserToken("");
        alert("Session expire please refresh the page and log in again");
      }, 10799964); // 3 hours

      // get user data based on the token
      fetch("/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((res) => res.json()) //get a row fetch data and convert it to json
        .then((data) =>
          setUserData({
            _id: data._id,
            name: data.name,
            email: data.email,
            img: data.img,
            verify: data.verify,
          })
        ) //display or use the converted data from the fetch
        .catch((err) => console.log(err));
    } else {
      setUserData(undefined);
    }
  }, [userToken]);

  return (
    <DataContext.Provider
      value={{
        currentOpenPage,
        setCurrentOpenPage,
        reRender,
        setReRender,
        updatePost,
        setUpdatePost,
        blogData,
        setBlogData,
        selectedApp,
        setSelectedApp,
        userData,
        userToken,
        setUserToken,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
