import React from "react";
import { useParams } from "react-router-dom";
import authService from "../services/auth.service";
import genProblemService from "../services/gen-problem.service";
import probService from "../services/prob.service";

function ProbNumberGen() {
    const currentUser = authService.getCurrentUser();
    // getting the problem

    const getAnswer = async () => {
        const currentProblem = probService.GetProb(id);
        const data = await currentProblem;
        setProb(data.data);
    };

    let { id } = useParams();
    const [ prob, setProb ] = React.useState([]);


    React.useEffect(() => {
        getAnswer();

        
    }, []);
    console.log(prob);


    return (
        <div>

            <div className="container"></div>

            <div className="row">

                <div className="col-9 align-self-start">
                    <h1 className="h1 text-center">{prob.title +" ("+prob.score+" points)"}</h1>
                    <h3 className="h3">Description</h3>
                    <p className="fs-4 p-sm-3 text-sm-start">{prob.description}</p>

                </div>

                
            </div>


            {!!currentUser && <div className="row justify-content-start" id="aa">
                <div className="col-9">
                    <h4 className="h4">Click to get your input</h4>
                    <button onClick={() => navigator.clipboard.writeText("copied Text")}>Copy</button>

                    <div>
                        <br></br>
                        <input type="text" name="submission"  placeholder="Your answer here" />
                        <button type="submit" name="submit">submit (to do)</button>
                    </div>
                </div>

                

            </div>}
            {!currentUser &&
                    <p>To get an Input and get solving, <a href="login.php">login</a> or <a href="signup.php">signup</a>.</p>
}

            <footer className="card-footer">
                <p>Author: Foulen ben foulen</p>

            </footer>

        </div>
    );
}

export default ProbNumberGen;
