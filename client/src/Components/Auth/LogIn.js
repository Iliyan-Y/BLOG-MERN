import React, { useContext } from "react";
import { Layout, Form, Input, Button, Checkbox } from "antd";
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

  const onFinish = (values) => {
    const newUser = {
      email: values.email,
      password: values.password,
    };

    axios
      .post("http://localhost:5000/user/login", newUser)
      .then(async (res) => {
        // console.log(`Welcome: ${res.data.user.name}`);
        await setUserToken(res.data.token);
        goTo.push("/");
      })
      .catch((err) =>
        alert(
          err.message +
            " Please check your email and password and try again. Plese check your email for verification as well"
        )
      );
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
          <h1 style={{ fontSize: "250%", color: "grey" }}>Log In</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
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
