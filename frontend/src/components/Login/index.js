import React, { useState } from "react";
import Container from "../Container";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../store/modules/auth/reducers";
import AuthLinks from "../AuthLinks";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);

  const dispatch = useDispatch();

  const canSubmit = email && password && !isAuthenticating;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      let response = await dispatch(userLogin({ email, password }));
      // response = unwrapResult(response);
    } catch (error) {
      console.log(error);
      console.log("Failed to Login- Try again! ");
    }
  };

  return (
    <div className="home">
      <Container>
        <h1>WHO'S WHO?</h1>
        <form className="home__details" onSubmit={handleSubmit}>
          <div>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>

          <div>
            <label>Password: </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div>
            <button className="button" type="submit" disabled={!canSubmit}>
              {isAuthenticating ? "loading.." : "Login"}
            </button>
          </div>
        </form>

        <AuthLinks />
      </Container>
    </div>
  );
};

export default Login;
