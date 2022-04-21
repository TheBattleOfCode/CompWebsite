import axios from "axios";

const API_URL = "http://localhost:8080/api/generatedInOut/";

const SaveGenProb = (genInput, genOutput, answered, userId, problemId) => {
  return axios.post(API_URL+"add", { 
    genInput,
    genOutput,
    answered,
    userId,
    problemId
  });
}

const GetGenProb = (idUser, idGenProb) => {
    return axios.get(API_URL+"getone/"+idUser+'/'+idGenProb);
}

export default {
    SaveGenProb, 
    GetGenProb
};