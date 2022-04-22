import React from "react";
import { useParams } from "react-router-dom";
import authService from "../services/auth.service";
import genProblemService from "../services/gen-problem.service";
import { createHash } from "crypto";
import probService from "../services/prob.service";

function ProbNumberGen() {
    let { id } = useParams();
    const [ prob, setProb ] = React.useState([]);
    const [ inOut, setInOut ] = React.useState([]);
    const [ generatedInOut, setGeneratedInOut ] = React.useState([]);
    const currentUser = authService.getCurrentUser();

    function hash(input) {
        return createHash('sha256').update(id + input + currentUser.id).digest('base64');
    }


    function generateInOut(code) {
        eval(code);
        //console.log(generatedInOutFromEval);
        //console.log(generatedInOut);
    }

    const getData = async () => {
        // getting the problem
        const currentProblem = probService.GetProb(id);
        const data = await currentProblem;
        console.log(data);
        setProb(data.data);

        // getting the Input and Output
        const inOut = genProblemService.GetGenProb(currentUser.id, id);
        const dataInOut = await inOut;
        console.log(dataInOut);

        // if there's no data, then we need to generate it
        if (!dataInOut.data) {
            generateInOut(data.data.inOutContentGen);

        }
        else {
            setInOut({ "input": dataInOut.data.genInput, "output": dataInOut.data.genOutput });
        }
    };

    React.useEffect(() => {
        if (generatedInOut.output) {
            console.log(generatedInOut);
            setInOut({ "input": generatedInOut.input, "output": generatedInOut.output });
            let encrypted = hash(generatedInOut.output);
            console.log(encrypted);
            genProblemService.SaveGenProb(
                generatedInOut.input.toString(),
                encrypted,
                currentUser.id,
                id).then(
                    (response) => {
                        console.log(response);
                    },
                    (error) => {
                        console.log(error);
                    }
                );;
                
        }
    }, [ generatedInOut ]);


    React.useEffect(() => {
        getData();
    }, []);



    return (
        <div>

            <div className="container"></div>

            <div className="row">

                <div className="col-9 align-self-start">
                    <h1 className="h1 text-center">{prob.title + " (" + prob.score + " points)"}</h1>
                    <h3 className="h3">Description</h3>
                    <p className="fs-4 p-sm-3 text-sm-start">{prob.description}</p>

                </div>


            </div>


            {!!currentUser && <div className="row justify-content-start" id="aa">
                <div className="col-9">
                    <h4 className="h4">Click to get your input</h4>
                    <button onClick={() => navigator.clipboard.writeText(inOut.input)}>Copy</button>

                    <div>
                        <br></br>
                        <input type="text" name="submission" placeholder="Your answer here" />
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
