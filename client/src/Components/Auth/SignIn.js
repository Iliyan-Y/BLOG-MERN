import React, { useContext } from "react";
import { Layout, Form, Input, Button } from "antd";
import axios from "axios";
import { DataContext } from "../../DataContext";
import { useHistory } from "react-router-dom";

const { Content } = Layout;

const SignIn = () => {
  const goTo = useHistory();
  const { setUserToken } = useContext(DataContext);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  // send verification email
  function emailConfirm(email, id) {
    axios
      .post("/user/emailvref", { email, id })
      .then(() => {
        // console.log("Verification email sent -> responce: ");
        goTo.push("/");
      })
      .catch((err) => console.error(err));
  }

  // send the form
  const onFinish = (values) => {
    const newUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      verify: false,
    };
    axios
      .post("/user/signin", newUser)
      .then(async (res) => {
        await setUserToken(res.data.token);
        emailConfirm(res.data.user.email, res.data.user._id);
      })
      .then(() => alert("Please check your email to activate the account"))
      .catch((err) => {
        console.error(err);
        alert("This email has been registered");
      });
  };

  return (
    <Content style={{ margin: "0 16px" }}>
      <div
        className="site-layout-background"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "1em",
            minWidth: "70%",
            marginTop: "2em",
            border: "1px solid grey",
          }}
        >
          <h1 style={{ fontSize: "250%", color: "grey" }}>Sign In</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  min: 3,
                  required: true,
                  message: "Name must be min 3 characters",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please use valid email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  min: 6,
                  required: true,
                  message: "Password must be min 6 characters",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Password doesn't match",
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Password doesn't match");
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Content>
  );
};

export default SignIn;
