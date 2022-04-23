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
    const [ answerTry, setAnswerTry ] = React.useState("");
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
            setInOut({ "input": dataInOut.data.genInput, "output": dataInOut.data.genOutput, "answered": dataInOut.data.answered });
        }
    };

    React.useEffect(() => {
        if (generatedInOut.output) {
            console.log(generatedInOut);
            setInOut({ "input": generatedInOut.input, "output": generatedInOut.output, "answered": false });
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


    function submitAnswer() {
        let encrypted = hash(answerTry);
        // 505 for AKS
        if (encrypted === inOut.output) {
            setInOut({ "input": inOut.input, "output": answerTry, "answered": true });
            // change it in the database

            // add score to the user
        }
        else {
            alert("Incorrect!");
        }
    }

    return (
        <div className="w-100 p-3">

            <div className="container"></div>

            <div className="row">

                <div className="col-9 align-self-start">
                    <h1 className="h1 text-center">{prob.title + " (" + prob.score + " points)"}</h1>
                    <h3 className="h3">Description</h3>
                    <div dangerouslySetInnerHTML={{ __html: prob.description }}></div>

                </div>


            </div>


            {!!currentUser && <div className="row justify-content-start" id="aa">
                <div className="col-9">
                    <h4 className="h4">Click to get your input</h4>
                    <button onClick={() => navigator.clipboard.writeText(inOut.input)} className="btn btn-warning " >Copy</button>
                    {!inOut.answered &&
                        <div>
                            
                            <div className="form-group w-25">
                                <label for="submission"><h4>submission</h4></label>
                                <input type="text"
                                    className="form-control"
                                    name="submission"
                                    placeholder="Your answer here"
                                    value={answerTry}
                                    onChange={(e) => setAnswerTry(e.target.value)} />

                                <br></br>
                                <button type="submit"
                                    name="submit"
                                    className="btn btn-primary"
                                    onClick={submitAnswer}>submit</button>
                            </div>
                        </div>}
                    {inOut.answered &&
                        <div>
                            <h3> You answered correctly! <br></br>  Your answer was {inOut.output}</h3>
                        </div>}
                </div>



            </div>}
            {!currentUser &&
                <p>To get an Input and get solving, <a href="login.php">login</a> or <a href="signup.php">signup</a>.</p>
            }
            <br></br><br></br>
            <footer className="card-footer">
                {// all rights reserved
                }
                <p>&copy; 2022 FFDV, inc.</p>


            </footer>

        </div>
    );
}

export default ProbNumberGen;
