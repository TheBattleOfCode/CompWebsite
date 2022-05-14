import { useEffect, useState } from 'react';
import PieChart from './PieChart';
import React from 'react';
import userService from '../../services/user.service';
import probService from '../../services/prob.service';


const Dashboard = () => {

    const [admins, setAdmins] = useState([]);
    const [country, setCountry] = useState([]);
    const [problems, setProblems] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    

    const getAdmin = async () => {
        const Userdata = await userService.getUsers();

        // set admins with id = 1

        setAdmins(Userdata.data.filter(user => user.roles.includes("619a62a8e8934539f45022c9")));
    }



    const getCountry = async () => {
        const Userdata = await userService.getUsers();
        setCountry(Userdata.data.map(user => user.country));
        console.log(country);
    }


    const getProblems = async () => {
        const probsdata = await probService.GetProbs();
        setProblems(probsdata.data);
    }


    const getAllUsers = async () => {
        const Userdata = await userService.getUsers();
        setAllUsers(Userdata.data);
    }




    useEffect(() => {
        getAdmin();
    }, []);

  

    useEffect(() => {
        getCountry();
    }, []);


    useEffect(() => {
        getProblems();
    }, []);



    useEffect(() => {
        getAllUsers();
    }, []);




    return (
        <div className="col main pt-5 mt-3">
            {/*mini navbar*/}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Admin Board</li>
                </ol>
            </nav>


            {/*stats */}
            <div className="row mb-3">
                <h1 className="col-12 mt-3 mb-3 text-secondary">Stats</h1>
                <div className="col-xl-3 col-sm-6 py-2">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body bg-success" style={{ backgroundColor: "#57b960" }}>
                            <div className="rotate">
                                <i className="fa fa-user fa-4x"></i>
                            </div>
                            <h6 className="text-uppercase">Users</h6>
                            <h1 className="display-4">{allUsers.length}</h1>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6 py-2">
                    <div className="card text-white bg-danger h-100">
                        <div className="card-body bg-danger">
                            <div className="rotate">
                                <i className="fa fa-list fa-4x"></i>
                            </div>
                            <h6 className="text-uppercase">Problems</h6>
                            <h1 className="display-4">{problems.length}</h1>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6 py-2">
                    <div className="card text-white bg-info h-100">
                        <div className="card-body bg-info">
                            <div className="rotate">
                                <i className="fab fa-twitter fa-4x"></i>
                            </div>
                            <h6 className="text-uppercase">Countries</h6>
                            <h1 className="display-4">{country.length - 5}</h1>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6 py-2">
                    <div className="card text-white bg-warning h-100">
                        <div className="card-body">
                            <div className="rotate">
                                <i className="fa fa-share fa-4x"></i>
                            </div>
                            <h6 className="text-uppercase">Admins</h6>
                            <h1 className="display-4">{admins.length}</h1>
                        </div>
                    </div>
                </div>
            </div>

            <hr />
            <br />
            {/*List of amins and pie chart */}
            <div className="row ">
                <div className="col-lg-7 col-md-6 col-sm-12">
                    <h5 className="mt-3 mb-3 text-secondary">
                        Our Admins
                    </h5>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead className="thead-light">
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Country</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{admin.username}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.phone}</td>
                                        <td>{admin.country}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>

                {/*pie chart*/}
                <div className="col-lg-5 col-md-6 col-sm-12 col-sm-offset-5">
                    <h4 className='title mt-3 mb-3 text-center text-secondary'>Some Data</h4>
                    <div className="mb-5" style={{ height: "300px", width: "400px" }}><PieChart /> </div></div>
            </div>

            {/*Newest users*/}
            <h2 className="col-12 mt-3 mb-3 text-secondary">The newest 4 users</h2>
            <div className="mb-3">
                <div className="card-deck">
                    {allUsers.slice(allUsers.length-4,allUsers.length).map((user, index) => (
                        <div className="card card-inverse card-success text-center" key={index}>
                            <div className="card-body">
                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Admin" className="rounded-circle" width="80" />
                                <h5 className="card-title">{user.username}</h5>
                                <p className="card-text">{user.email}</p>
                                <p className="card-text">{user.phone}</p>
                                <p className="card-text">{user.country}</p>

                            </div>
                        </div>

                    ))}
                </div>
            </div>



        </div>
    )
}

export default Dashboard