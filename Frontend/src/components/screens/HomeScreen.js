import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/auth.service";
import probService from "../../services/prob.service";
import TestProfile from "../testProfile";
import Prob from "./Probs";


const Homescreen = () => {

    const currentUser = authService.getCurrentUser();

    const [probs, setProbs] = useState([]);
    const [typeProbs, setTypeProbs] = useState({});
    const [filtredProbs, setFiltredProbs] = useState([]);

    //getting the problems
    const getData = async () => {
        const data = await probService.GetProbs();
        console.log(data);
        setProbs(data.data);
        setFiltredProbs(data.data);
    };


    //sort the problems by its type
    const sortByType = (type) => {
        if (type === "all") {
            setFiltredProbs(probs);
        } else {
        const sortedProbs = probs.filter(prob => prob.type === type);
        setFiltredProbs(sortedProbs);
        }
    };



    useEffect(() => {
        getData();
    }, []);


    return (
        <div>
            <select id="dropdown" className="form-control" onChange={(e) => sortByType(e.target.value)}>
                <option value="all">ALL</option>
                <option value="gen">gen</option>
                <option value="NumberGen">NumberGen</option>
                <option value="Qna">Qna</option>
            </select>

            <table className="table table-sm shadow-lg p-3 mb-5 bg-white rounded">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Type</th>
                        <th scope="col">Solving rate</th>
                        <th scope="col">Enter</th>
                    </tr>
                </thead>
                <tbody>
                    {filtredProbs.map((prob, index) => (


                        <Prob key={index} prob={prob} />

                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default Homescreen;