import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import probService from "../../services/prob.service";
import TestProfile from "../testProfile";
import Prob from "./Probs";


const Homescreen = () => {

    const [probs, setProbs] = useState([]);

    // const probs = probService.GetProbs();

    //getting the problems
    const getData = async () => {
        const data = await probService.GetProbs();
        console.log(data);
        setProbs(data.data);
    };



    const clickProb = () => {
        console.log(probs);
    }

    useEffect(() => {
        getData();
    }, []);


    return (
        <div>
            <div className="row">
                {probs.map(prob => (
                    <div className="col-md2">
                        <div>
                            <Prob prob={prob} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homescreen;