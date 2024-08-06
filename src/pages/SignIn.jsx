import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";

const LoginContainer = styled.main`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  direction: rtl;

  .input-group {
    padding-bottom: 1rem;
  }
`;

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [boxing, setBoxing] = useState(localStorage.getItem("boxing"));
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendPostRequest = async () => {
    setLoading(!loading);
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      localStorage.setItem(
        "boxing",
        JSON.stringify({ token: data.data.token, user: data.data.user })
      );
      setBoxing(
        JSON.stringify({ token: data.data.token, user: data.data.user })
      );
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendPostRequest();
  };

  const authenticateRequest = async () => {
    setLoading(!loading);
    try {
      const token = JSON.parse(boxing)?.token;
      if (!token) throw new Error("No token found");
      const response = await fetch(
        "http://localhost:3000/api/auth/verify-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setLoading(!loading);
      if (data.message === "Token is valid") {
        navigate("/setgrouplesson");
      }
    } catch (error) {
      setLoading(!loading);
      console.error("Error verifying token:", error);
    }
  };

  useEffect(() => {
    if (boxing) {
      authenticateRequest();
    }
  }, [boxing]);

  return (
    <LoginContainer className="login-container">
      <h2>התחברות מנהל</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {!loading && <ClipLoader />}
    </LoginContainer>
  );
};

export default SignIn;
