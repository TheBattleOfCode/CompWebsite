import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

import { Link } from "react-router-dom";
const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
        <p>
        <Link to={"/ProbNumberGen/6244c1af0a11e1a39bdd7068"} className="nav-link">
              Go test the number Gen problem
            </Link></p>
      </header>
    </div>
  );
};

export default Home;
