import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

import { Link } from "react-router-dom";
import Homescreen from "./screens/HomeScreen";
import TestGenProbModal from "./screens/TestGenProbModal";
const Home = () => {
  /*const [content, setContent] = useState("");

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
*/
  return (
    <div className="container">
      
      <TestGenProbModal />
      <Homescreen />
    </div>
  );
};

export default Home;
