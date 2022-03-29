import React, { useState } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

const CreateProblem = () => {


  const [selectValue, setSelectValue] = useState("");

  //const [probTitle,setProbTitle]=useState("");
  //const [probDesc,setProbDesc]=useState("");
  //const [probScore,setProbScore]=useState("");
  //test neji
  const [probFile, setProbFile] = useState("");
  const [probInput, setProbInput] = useState([]);
  const [probOutput, setProbOutput] = useState(0);



  const handleChange = (e) => {
    console.log("done");
  }
  const submitNumberGen = () => {
    console.log("done");
    eval(probFile);
    console.log(probInput);
    console.log(probOutput);
  }

  const checkSubmit = () => {
    console.log("checking");
    console.log(probInput);
    console.log(probOutput);
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

      {selectValue === "Number gen" && <div>

        {
          <div>

            <div className="form-group">
              <label htmlFor="File">File</label>
              <textarea
                type="text"
                className="form-control"
                name="File"
                value={probFile}
                onChange={(e) => setProbFile(e.target.value)}
              />
            </div>



            <div className="form-group">
              <button className="btn btn-primary btn-block" onClick={submitNumberGen}>Submit</button>
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-block" onClick={checkSubmit}>check</button>
            </div>
          </div>
        }


      </div>}



    </div>


  );
}

export default CreateProblem;