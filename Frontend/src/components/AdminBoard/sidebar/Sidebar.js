import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import authService from '../../../services/auth.service';
import userService from '../../../services/user.service';
const Sidebar = () => {
    const currentUser = authService.getCurrentUser();
  const [ userName, setUserName ] = React.useState(currentUser.username);
    
    return (
         <div className="col-md-3 col-lg-2 sidebar-offcanvas pl-0 rounded" id="sidebar" role="navigation" style={{backgroundColor:"#1b1919"}}>
            <ul className="nav flex-column sticky-top pl-0 pt-5 p-3 mt-3 align-items-center text-center">
            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Admin" className="rounded-circle" width="100" />
                <li className="nav-item mb-2 mt-3"><a className="nav-link text-light" href="#"><h5>{userName}</h5></a></li>
                <li className="nav-item mb-2 "><a className="nav-link text-light" href="#"><i className="fas fa-user font-weight-bold"></i> <span className="ml-3">Stats</span></a></li>
                <li className="nav-item mb-2">
                    <a className="nav-link text-light" href="#submenu1" data-toggle="collapse" data-target="#submenu1"><i className="far fa-file-word font-weight-bold"></i> <span className="ml-3">Admins ▾</span></a>
                    
                </li>
                <li className="nav-item mb-2"><a className="nav-link text-light" href="/Data"><i className="far fa-chart-bar font-weight-bold"></i> <span className="ml-3">Data</span></a></li>
                <li className="nav-item mb-2"><a className="nav-link text-light" href="/Users"><i className="fas fa-file-export font-weight-bold"></i><span className="ml-3">Users</span></a></li>
            </ul>
       </div>
    )
}
 
export default Sidebar