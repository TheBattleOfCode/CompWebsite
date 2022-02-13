import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Button } from 'react-bootstrap';
import "./Navbar.css";
import Dropdown from "./Dropdown";
import AuthService from "../../services/auth.service";
import EventBus from "../../common/EventBus";
import userImg from "./user.svg";
import dropIcon from "./icons8-down-10.png"

function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [switchInOut, setSwitchInOut] = useState(false);
  const [actives, setActives] = useState('home');

  const Drop = () =>{setSwitchInOut(!switchInOut);}

  
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };
  return (
    <>
      <nav className="navbar rounded">
        <Link to="/" className="navbar-logo"style={{textDecoration: 'none'}} >
        Battle Of Code 
        </Link>
        <div className="nav-items">
                <li className="nav-item " >
                    <Link to={"/home"} id={actives != 'home' ? "" : "active"} onClick={()=>{setActives("home")}} className="nav-link">
                        Home
                    </Link>
                </li>

                {showAdminBoard && (
                    <li className="nav-item">
                        <Link to={"/admin"} id={actives != 'admin' ? "" : "active"} onClick={()=>setActives("admin")} className="nav-link">
                            Admin Board
                        </Link>
                    </li>
                )}

                {showAdminBoard && (
                    <li className="nav-item">
                        <Link to={"/createProb"}  id={actives != 'createproblem' ? "" : "active"} onClick={()=>setActives("createproblem")}className="nav-link">
                            Create Problem
                        </Link>
                    </li>
                )}

                <li className="nav-item">
                    <Link to={"/contest"}  id={actives != 'contest' ? "" : "active"} onClick={()=>setActives("contest")}className="nav-link">
                        Contests
                    </Link>

                </li>
                <li className="nav-item">
                    <Link to={"/standings"}  id={actives != 'standings' ? "" : "active"} onClick={()=>setActives("standings")}className="nav-link">
                        Standings
                    </Link>
                </li>
        </div>
            {currentUser ? (
                <div className="nav-last">
                    <li className="nav-item">
                    
                        <Link className="nav-link"  onClick = {Drop}>
                                <img src = {userImg}></img>
                                <span>       </span>
                                <img src={dropIcon}></img> 
                        </Link>
                                     
                        {
                            !switchInOut ? <></>:
                            <div className="drop-down">
                                <li className="nav-item">
                                    <Link to={"/profile"} className="nav-link" onClick={()=>{Drop() ;setActives("")}}>
                                    {currentUser.username}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link" onClick={()=>{logOut(); setActives("")}}>
                                        Logout
                                    </Link>
                                </li>
                            </div>

                        }
                    </li>
                    {/**/}
                </div>
            ) : (
                <div className="nav-last">
                    <li className="nav-item">
                        <Link to={"/login"} className="nav-link">
                        <Button variant="light">Login</Button> 
                        </Link>
                    </li>

                    <li className="nav-last">
                        <Link to={"/register"} className="nav-link">
                        <Button variant="light">Sign up</Button> 
                        </Link>
                    </li>
                </div>
            )}
        
      </nav>
    </>
  );
}

export default Navbar;
