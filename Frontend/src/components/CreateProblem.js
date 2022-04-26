import React, { useState } from "react";
import probService from "../services/prob.service";
import { Remarkable } from 'remarkable';


const CreateProblem = () => {


  const [selectValue, setSelectValue] = useState("");

  const [probTitle, setProbTitle] = useState("");
  const [probDesc, setProbDesc] = useState("");
  const [probScore, setProbScore] = useState("");
  const [probFile, setProbFile] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [fail,setFail] = useState(false);





  const submitNumberGen = () => {
    console.log("To check input");
    const md = new Remarkable();
    probService.SaveProb(
      probTitle,
      md.render(probDesc),
      probScore,
      probFile,
      "NumberGen").then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
          setFail(false);
        }
      );

    setSuccessful(true);
    console.log("done");


  }



  return (

    <div>
      <h1>Create Problem</h1>
      <h2>Select the problem style :</h2>

      <div>
        <select id="dropdown" onChange={(e) => setSelectValue(e.target.value)}>
          <option value="N/A">Choose a problem style</option>
          <option value="Number gen">Number gen</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <h3>{selectValue}</h3>

      <div className="form-group">
        <label htmlFor="Title">Title</label>
        <input
          type="text"
          className="form-control"
          name="Title"
          value={successful ? "":probTitle}
          onChange={(e) => setProbTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Description">Description</label>
        <textarea
          type="text"
          className="form-control"
          name="Description"
          value={successful ? "":probDesc}
          onChange={(e) => setProbDesc(e.target.value)}
        />
      </div>


      <div className="form-group">
        <label htmlFor="Score">Score</label>
        <input
          type="text"
          className="form-control"
          name="Score"
          value={successful ? "":probScore}
          onChange={(e) => setProbScore(e.target.value)}
        />
      </div>

      {selectValue === "Number gen" && <div>

        {
          <div>




            <div className="form-group">
              <label htmlFor="File">File</label>
              <textarea
                type="text"
                className="form-control"
                name="File"
                value={successful ? "":probFile}
                onChange={(e) => setProbFile(e.target.value)}
              />
            </div>




            <div className="form-group">
              <button className="btn btn-primary btn-block" onClick={submitNumberGen}>Submit</button>
            </div>
            {successful && (
              <div className="form-group">
                <div className="alert alert-success" role="alert">
                  Problem created successfully!
                </div>
              </div>)
            }
            {fail && (
              
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    Problem creation failed!
                  </div>
                </div>)}
          </div>
        }


      </div>}



    </div>


  );
}

export default CreateProblem;