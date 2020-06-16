import React, { useState, useEffect } from "react";
import { UploadOutlined, PictureOutlined } from "@ant-design/icons";

const UploadTool = (props) => {
  const [uploaded, setUploaded] = useState();

  //validate the file type
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      alert("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      alert("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCooseFile = async (e) => {
    setUploaded(e.target.files[0]);
  };

  useEffect(() => {
    function unsub() {
      handleUpload();
    }
    return unsub();
  }, [uploaded]);

  const handleUpload = async () => {
    if (uploaded) {
      beforeUpload(uploaded)
        ? props.handleDisplay(await getBase64(uploaded))
        : console.log("no");
    }
  };

  return (
    <label
      htmlFor="ToolsU"
      style={{
        border: "2px grey solid",
        padding: "0.8em",
        borderRadius: "12px",
        background: "white",
        display: "flex",
        justifyContent: "center",
        height: "10%",
        marginTop: "auto",
      }}
    >
      <input
        onChange={handleCooseFile}
        type="file"
        id="ToolsU"
        style={{ display: "none" }}
      />
      <PictureOutlined style={{ fontSize: "135%" }} />{" "}
      <UploadOutlined style={{ fontSize: "135%" }} />
    </label>
  );
};

export default UploadTool;
