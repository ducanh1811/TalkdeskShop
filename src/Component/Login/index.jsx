import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../slice/couterSlice";
import { useState } from "react";
import { Col, Button, Input } from "antd";
import { Typography } from "antd";
import styles from "./Login.module.scss";
import classname from "classnames/bind";
const cx = classname.bind(styles);
const { Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function login() {
    const data = JSON.stringify({
      identifier: userName,
      password: password,
    });

    var config = {
      method: "post",
      url: "https://backoffice.nodemy.vn/api/auth/local/",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNjgwMTY0MzY1LCJleHAiOjE2ODI3NTYzNjV9.DNl-fEIwImrbsRvnmZZP5dP64k9MQPQmDuZfXJjHHjY",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const user = JSON.stringify(response.data);
        localStorage.setItem("user", user);
        //chuyển dữ liệu lên store
        dispatch(setUser(response.data.user));
        //chuyển sang trang home
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
        setErr("Sai tài khoản hoặc mật khẩu");
        navigate("/login");
      });
  }

  return (
    //  <div style={{ display: "flex", justifyContent: "center", alignItems: "center",  }}>

    //     <Col style={{ gap: 16 }}>
    //         <Text type="heading1">Trang Login</Text>
    //         <br/>
    //         <Text style={{color: "red"}}>{err}</Text>
    //         <Input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tên đăng nhập" />
    //         <Input onPressEnter={login} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" />
    //         <Button onClick={login}  type="primary">Đăng nhập</Button>
    //     </Col>
    // </div>
    <div className={cx("body")}>
      <div className={cx("wrapper")}>
        <h1>Đăng Nhập</h1>
        <span>
        <Text style={{color: "red"}}>{err}</Text>
        </span>
        <div className={cx("form")}>
          <div className={cx("inputs")}>
            <div className={cx("input")}>
              <input
                name="username"
                type="text"
                placeholder="Tài khoản"
                onChange={(e) => setUserName(e.target.value)}
              />
              <div className={cx("error-input")}></div>
              <span></span>
            </div>
            {/* <div className={cx("input">
                            <input type="email" placeholder="Email" />
                            <div className={cx("error-input"></div>
                            <span></span>
                        </div> */}
            <div className={cx("input")}>
              <input
                name="password"
                onPressEnter={login}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
              />
              <div className={cx("error-input")}></div>
              <span></span>
            </div>
            {/* <div className={cx("input">
                            <input type="password" placeholder="Confirm Password" />
                            <div className={cx("error-input"></div>
                            <span></span>
                        </div> */}
          </div>
          <button className={cx("loginbtn")}  onClick={login}>Đăng nhập</button>
          {/* <div className={cx('signup')}>
                            Already have an account?
                            <a href="#"> Signup</a>
                        </div> */}
        </div>
      </div>
    </div>
  );
}
