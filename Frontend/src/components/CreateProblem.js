import React, { useState } from "react";
import probService from "../services/prob.service";
import { Remarkable } from 'remarkable';


const CreateProblem = () => {


  const [ selectValue, setSelectValue ] = useState("N/A");

  const [ probTitle, setProbTitle ] = useState("");
  const [ probDesc, setProbDesc ] = useState("");
  const [ probScore, setProbScore ] = useState(0);
  const [ probFile, setProbFile ] = useState("");
  const [ probQnaAnswer, setProbQnaAnswer ] = useState("");
  const [ successful, setSuccessful ] = useState(false);
  const [ fail, setFail ] = useState(false);
  


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

  const submitQnA = (event) => {
    event.preventDefault();
    console.log("To check input");
    const md = new Remarkable();
    let file = "function generateInput(){return \"\";}function generateOutput(input){return \"" + probQnaAnswer.trim().toUpperCase() + "\";}const input=generateInput();setGeneratedInOut({\"input\":input,\"output\":generateOutput(input)});";
    probService.SaveProb(
      probTitle,
      md.render(probDesc),
      probScore,
      file,
      "Qna").then(
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
    setProbScore(0);
    setProbFile("");
    setProbQnaAnswer("");


    console.log("done");



  }


  const submitButton = () => {
    return (
      <div>
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
    )

  }

  const numberGenInput = () => {
    return (
      <div>
        <div>
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
            </div>
          }
        </div>
      </div>
    )
  }

  const QnAInput = () => {
    return (
      <div>
        <div>
          {
            <div>
              <div className="form-group">
                <label htmlFor="File">Answer</label>
                <textarea
                  type="text"
                  className="form-control"
                  name="File"
                  id="File"
                  value={probQnaAnswer}
                  onChange={(e) => setProbQnaAnswer(e.target.value)}
                  required
                />
              </div>
            </div>
          }
        </div>
      </div>

    )
  }

  const CommonInput = () => {
    return (
      <div>
        </div>
    )
  }

  const SelectInput = () => {

    return (
      <div className="d-flex justify-content-center" >

        <label class={"btn btn"+(selectValue=="Number gen"?"":"-outline")+"-success"} for="NumberGen">
          <input type="radio"
            class="btn-check"
            name="options"
            id="NumberGen"
            value="Number gen"
            
            checked={selectValue == "NumberGen"}
            onChange={(e) => setSelectValue(e.target.value)}
            autocomplete="off"
            style={{display:"none"}} /> 
          Number generator</label>

        <label class={"btn btn"+(selectValue=="QnA"?"":"-outline")+"-success"} for="QnA">
          <input type="radio" 
          class="btn-check"
          name="options" 
          id="QnA" 
          value="QnA" 
          checked={selectValue == "QnA"}
           onChange={(e) => setSelectValue(e.target.value)}
           style={{display:"none"}}
            autocomplete="off" />
          QnA</label>

          <label class={"btn btn"+(selectValue=="Compiler"?"":"-outline")+"-success"} for="Compiler">
          <input type="radio" 
          class="btn-check"
          name="options" 
          id="Compiler" 
          value="Compiler" 
          checked={selectValue == "Compiler"}
           onChange={(e) => setSelectValue(e.target.value)}
           style={{display:"none"}}
            autocomplete="off" />
          Compiler (under Construction)</label>

          <label class={"btn btn"+(selectValue=="FileGen"?"":"-outline")+"-success"} for="FileGen">
          <input type="radio" 
          class="btn-check"
          name="options" 
          id="FileGen" 
          value="File Generator" 
          checked={selectValue == "FileGen"}
           onChange={(e) => setSelectValue(e.target.value)}
           style={{display:"none"}}
            autocomplete="off" />
          File Generator (under Construction)</label>


      </div>
    )

  }


  return (

    <div>
      <h1>Create Problem</h1>
      <h2>Select the problem style :</h2>

      <SelectInput />

      <h3>{selectValue}</h3>

      <form onSubmit={
        (event) => {
          switch (selectValue) {
            case "Number gen":
              submitNumberGen(event);
              break;
            case "QnA":
              submitQnA(event);
              break;
          }
        }}>

        
        
<div>
        <div className="form-group">
          <label htmlFor="Title">Title</label>
          <input
            type="text"
            className="form-control"
            id="Title"
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
          <label htmlFor="Score">Score = {probScore}</label>
          <input
            type="range"
            className="form-control"
            name="Score"
            id="Score"
            min="0" max="1000"
            step="50"
            value={probScore}
            onChange={(e) => setProbScore(e.target.value)}
            required
          />
        </div>
      </div>


        {selectValue === "Number gen" && numberGenInput()}
        {selectValue === "QnA" && QnAInput()}
        {(selectValue != "N/A") && submitButton()}
      </form>



    </div>


  );
}

export default CreateProblem;