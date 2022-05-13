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


  const submitNumberGen = (event) => {
    event.preventDefault();
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
    setProbDesc("");
    setProbTitle("");
    setProbScore("");
    setProbFile("");

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
    <form onSubmit={submitNumberGen}>
      <div className="form-group">
        <label htmlFor="Title">Title</label>
        <input
          type="text"
          className="form-control"
          id = "Title"
          name="Title"
          value={probTitle}
          onChange={(e) => setProbTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="Description">Description</label>
        <textarea
          type="text"
          className="form-control"
          name="Description"
          id="Description"
          value={probDesc}
          onChange={(e) => setProbDesc(e.target.value)}
          required
        />
      </div>


      <div className="form-group">
        <label htmlFor="Score">Score</label>
        <input
          type="text"
          className="form-control"
          name="Score"
          id="Score"
          value={probScore}
          onChange={(e) => setProbScore(e.target.value)}
          required
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
                id="File"
                value={probFile}
                onChange={(e) => setProbFile(e.target.value)}
                required
              />
            </div>




            <div className="form-group">
              <button className="btn btn-primary btn-block" type="submit">Submit</button>
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
      </form>



    </div>


  );
}

export default CreateProblem;