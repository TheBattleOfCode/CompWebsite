import React, { useState, useEffect } from "react";

import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import Sidebar from "./sidebar/Sidebar";
import Dashboard from "./Dashboard";

const BoardAdmin = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
    <div>
      <div className="container-fluid" id="main">
                 <div className="row row-offcanvas row-offcanvas-left">
                   <Sidebar/>
                  <Dashboard/>
                
             </div>
            </div>  
    </div>
  );
};

export default BoardAdmin;
