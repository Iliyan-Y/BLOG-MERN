import React, { useState, useContext } from "react";
import axios from "axios";
import { Layout } from "antd";
import UploadProfilePic from "./UploadProfilePic";
import { DataContext } from "../../DataContext";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";

const { Content } = Layout;
const inputStyle = {
  borderRadius: "8px",
  margin: "0.5em auto",
  width: "85%",
};

const UserProfile = () => {
  const goTo = useHistory();
  const { userData, userToken } = useContext(DataContext);
  const [base64Img, setBase64Img] = useState("");
  const [newName, setNewName] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPassVrf, setNewPassVrf] = useState("");
  const [newPass, setNewPass] = useState("");

  function userNameChange() {
    if ((newName.length > 0 && newName.length < 3) || newName.length === 0)
      return alert("User name min leng is 3 characters");

    let body = {
      id: userData._id,
      name: newName,
    };
    axios
      .post("http://localhost:5000/user/nameChange", body)
      .then(async (res) => {
        //console.log(res);
        setNewName("");
        window.location.reload(false);
      })
      .catch((err) => console.error(err));
  }

  function picChange() {
    let body = {
      img: base64Img !== "" ? base64Img : userData.img,
      id: userData._id,
    };
    axios
      .post("http://localhost:5000/user/pic", body)
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => console.error(err));
  }

  function passChange() {
    const config = {
      headers: { Authorization: `Bearer ${userToken}` },
    };
    let body2 = {
      id: userData._id,
      newPass,
      oldPass,
    };

    if (newPass.length < 6) {
      return alert("Password must be at least 6 characters");
    } else if (newPass !== newPassVrf) {
      return alert("New password doesn't match");
    } else if (
      newPass.length > 5 &&
      newPass === newPassVrf &&
      oldPass.length > 5
    ) {
      axios
        .post("http://localhost:5000/user/passChange", body2, config)
        .then((res) => {
          //console.log(res);
          setOldPass("");
          setNewPass("");
          setNewPassVrf("");
          goTo.push("/");
        })
        .catch((err) =>
          alert(
            `${err} \nSomething went wrong please double check your old password`
          )
        );
    } else {
      alert("Something went wrong please double check");
    }
  }

  function handleCansel() {
    setBase64Img("");
    setNewName("");
    setNewPass("");
    setOldPass("");
    setNewPassVrf("");
    goTo.push("/");
  }

  //styles
  const BtnStyle = styled.button`
    border-radius: 8px;
    margin: 0.2em;
    &:hover {
      cursor: pointer;
      background: lightgreen;
    }
  `;

  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360, textAlign: "center" }}
      >
        {userData ? (
          <div
            id="userProfile"
            style={{
              background: "#c4c4c4",
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              padding: "1em",
              width: "50%",
              margin: "0 auto",
              borderRadius: "14px",
            }}
          >
            <h1> Welcome {userData.name} </h1>
            <span
              style={{
                margin: "1em auto",
                background: "black",
                width: "101%",
                height: "2px",
              }}
            ></span>
            <h3>{userData.email}</h3>
            <div>
              <BtnStyle onClick={picChange}>Save</BtnStyle>
              <BtnStyle onClick={handleCansel}>Cancel</BtnStyle>
            </div>
            <img
              src={base64Img !== "" ? base64Img : userData.img}
              alt="preview"
              style={{
                margin: "0.3em auto",
                background: "pink",
                width: "84px",
                height: "84px",
              }}
            />
            <p style={{ margin: "0.3em auto" }}>New Profile Pic</p>
            <p style={{ fontSize: "small" }}>
              For best results use 84px square image less then 1mb
            </p>
            <UploadProfilePic
              setBase64Img={setBase64Img}
              base64Img={base64Img}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "60%",
                margin: "0 auto",
              }}
            >
              <span
                style={{
                  margin: "1em auto",
                  background: "black",
                  width: "101%",
                  height: "1px",
                  opacity: 0.5,
                }}
              ></span>
              <h1>Change User Name</h1>
              <input
                style={inputStyle}
                type="text"
                placeholder="New User Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div>
                <BtnStyle onClick={userNameChange}>Save</BtnStyle>
                <BtnStyle onClick={handleCansel}>Cancel</BtnStyle>
              </div>
              <span
                style={{
                  margin: "1em auto",
                  background: "black",
                  width: "101%",
                  height: "1px",
                  opacity: 0.5,
                }}
              ></span>
              <h1>Change password</h1>
              <input
                style={inputStyle}
                type="password"
                placeholder="Current Password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
              <input
                style={inputStyle}
                type="password"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />

              <input
                style={inputStyle}
                type="password"
                placeholder="Repeat New Password"
                value={newPassVrf}
                onChange={(e) => setNewPassVrf(e.target.value)}
              />
              <div>
                <BtnStyle onClick={passChange}>Save</BtnStyle>
                <BtnStyle onClick={handleCansel}>Cancel</BtnStyle>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </Content>
  );
};

export default UserProfile;
