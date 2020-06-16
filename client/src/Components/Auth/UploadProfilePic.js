import React from "react";

import { UploadOutlined } from "@ant-design/icons";

const UploadProfilePic = (props) => {
  //validate the file type
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      alert("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 1.2;
    if (!isLt2M) {
      alert("Image must smaller than 1.2MB!");
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
    // setLoadedFile(e.target.files[0]);
    let file = e.target.files[0];
    if (file) {
      beforeUpload(file)
        ? props.setBase64Img(await getBase64(file))
        : console.error("Incorrect file format");
    }
  };

  // const handleUpload = async () => {
  //   if (loadedFile) {
  //     beforeUpload(loadedFile)
  //       ? props.setBase64Img(await getBase64(loadedFile))
  //       : console.log("no");
  //   } else {
  //     alert("sellect file first");
  //   }

  //   // const x = await getBase64(loadedFile);
  // };

  return (
    <div
      style={{
        width: "70%",
        alignSelf: "center",
        padding: "1em",
      }}
    >
      <label
        htmlFor="upBtn"
        style={{
          border: "1px solid grey",
          padding: "0.5em",
          borderRadius: "8px",
          background: "#8de63c",
        }}
      >
        Sellect <UploadOutlined />
      </label>
      <input
        onChange={handleCooseFile}
        type="file"
        id="upBtn"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadProfilePic;
