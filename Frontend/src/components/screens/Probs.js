import React, { useEffect, useState } from 'react';
import authService from '../../services/auth.service';
import genProblemService from '../../services/gen-problem.service';
import genInOutProbs from '../../services/gen-problem.service';

export default function Prob({ prob }) {
    const currentUser = authService.getCurrentUser();
    const [ stateProb, setStateProb ] = useState("white");
    const [ inOut, setInOut ] = useState([]);
    const [ inOutProb, setInOutProb ] = useState([]);
    const [ Acceptance, setAcceptance ] = useState("Not played yet");
    //get gen problems
    const getGenProbs = async () => {
        const inOutlocal = genProblemService.GetGenProb(currentUser.id, prob._id);
        setInOut(await inOutlocal);
    };

    const GetInOutProb = async () => {
        const inOutProbLocal = genProblemService.GetAllGenProbByProb(prob._id);
        setInOutProb(await inOutProbLocal);
    };

    useEffect(() => {
        
        if (inOutProb!=undefined && inOutProb.data!=undefined && inOutProb.data.length!=0) {
            let accepted = 0;
            console.log(inOutProb);
            let allEntered = inOutProb.data.length;
            inOutProb.data.forEach(inOut => {
                if (inOut.answered) {
                    accepted++;
                }
            });
            // accepted / allEntered * 100
            console.log(`${Math.round((accepted / allEntered) * 100)}%`);
            setAcceptance(`${Math.round((accepted / allEntered) * 100)}%`);
        }
    }, [ inOutProb ]);




    useEffect(() => {
        if (inOut.data) {
            setStateProb(inOut.data.answered ? "bg-success" : "table-active");
        }
    }, [ inOut ]);
    
    useEffect(() => {
        getGenProbs();
        GetInOutProb();
    }, []);



    return (
        <tr className={stateProb + " rounded"}>
            <td>{prob.title}</td>
            <td>{prob.type} </td>
            <td>{Acceptance}</td>
            <td>
                <button className={stateProb != "bg-success" ? "btn btn-outline-primary" : "btn btn-outline-dark"} >
                    <a href={'/ProbNumberGen/' + prob._id} style={{ color: stateProb == "bg-success" ? "black" : "blue" }}>
                        Enter
                    </a>
                </button>
            </td>

        </tr>
    );
}
