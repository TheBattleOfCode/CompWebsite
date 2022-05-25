import React, { useEffect, useState } from 'react';
import authService from '../../services/auth.service';
import genProblemService from '../../services/gen-problem.service';
import genInOutProbs from '../../services/gen-problem.service';

export default function Prob({ prob }) {
    const [genProbs, setGenProbs] = useState([]);
    const currentUser = authService.getCurrentUser();
    const [stateProb, setStateProb] = useState("white");
    const [inOut, setInOut] = useState([]);
    //get gen problems
    const getGenProbs = async () => {
        const inOutlocal = genProblemService.GetGenProb(currentUser.id, prob._id);
        setInOut(await inOutlocal);
       
    };

    useEffect(() => {
        if (inOut.data) {
            setStateProb(inOut.data.answered? "success" : "secondary");
        }
    }, [inOut]);
    useEffect(() => {
        getGenProbs();
    }, []);



    return (
        <tr className={"bg-"+ stateProb +" rounded"}>
            <td>{prob.title}</td>
            <td>{prob.type} </td>
            <td>
                <button className="btn btn-outline-primary" >
                    <a href={'/ProbNumberGen/' + prob._id}>
                        Enter
                    </a>
                </button>
            </td>

        </tr>
    );
}
