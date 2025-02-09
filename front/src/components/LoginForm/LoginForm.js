import styles from "./LoginForm.module.css";
import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "../nav/Nav";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../features/auth/authSlice.js";
import WithGuardFrom from "../../util/WithGuardFrom.js";
import { LOGGEDIN } from "../../util/constants.js";
import ButtonLoadingHandler from "../Loading/ButtonLoadingHandler.jsx";

export const LoginForm = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const { loading } = useSelector((state) => state.auth);
  const [LoginData, setLoginData] = useState({ email: "", password: "" });
  const [Errors, setErrors] = useState({ email_err: "", password_err: "" });
  const [showPass, setshowPass] = useState(false);

  const inputHandler = (e) => {
    const key = e.target.id;
    const value = e.target.value;
    setLoginData({ ...LoginData, [key]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(login(LoginData))
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => handel_errors_state(err));
  };

  const autoLoginHandler = () => {
    setLoginData({ email: "demo@demo.com", password: "demo1demo1" });
  };
  const handel_errors_state = (err) => {
    if (err.email === "That email is not registered") {
      setErrors({ email_err: err.email, password_err: "" });
    } else if (err.password === "That password is not correct") {
      setErrors({ email_err: "", password_err: err.password });
    } else {
      alert("something went wrong please try again later");
    }
  };

  return (
    <div>
      <Nav />

      <div className={styles.Form_container}>
        <div className={styles.header_container}>
          <i className="fa-solid fa-right-to-bracket"></i>
          <h2>Welcome!</h2>
          <span>Sign in to your account</span>
        </div>

        <form onSubmit={submitHandler}>
          <div className={styles.form_control}>
            <label htmlFor="email">
              Email <p className={styles.err}>{Errors.email_err}</p>
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={LoginData.email}
              onChange={inputHandler}
            />
            <i className="fa-solid fa-user"></i>
          </div>

          <div className={styles.form_control}>
            <label htmlFor="password">
              Password <p className={styles.err}>{Errors.password_err}</p>
            </label>
            <input
              required
              type={showPass ? "text" : "password"}
              id="password"
              name="password"
              value={LoginData.password}
              onChange={inputHandler}
            />
            <i
              onClick={() => {
                setshowPass(!showPass);
              }}
              className={`${styles.pass} ${
                showPass
                  ? "fa-sharp fa-regular fa-eye-slash"
                  : "fa-solid fa-eye"
              }`}
            ></i>
          </div>

          <div className={styles["login-reigister-container"]}>
            <ButtonLoadingHandler loading={loading} loadingText={"Loading..."}>
              <button className={styles.button} type="submit">
                Login <i className="fa-sharp fa-solid fa-arrow-right"></i>
              </button>
            </ButtonLoadingHandler>
            <span className={styles.forgetpass}>
              <span>don't have an account?</span> <br />
              <span className={styles.autoLogin} onClick={autoLoginHandler}>
                auto login !
              </span>
              <br />
              <Link className={styles.register_login} to={"/register"}>
                {" "}
                register now !
              </Link>
              <br />
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithGuardFrom(LoginForm, LOGGEDIN);
