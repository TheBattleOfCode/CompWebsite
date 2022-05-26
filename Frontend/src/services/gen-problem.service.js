import axios from "axios";

const API_URL = "http://localhost:8080/api/generatedInOut/";

const SaveGenProb = (genInput, genOutput, userId, problemId) => {
  return axios.post(API_URL+"add", { 
    genInput,
    genOutput,
    userId,
    problemId
  });
}
 
const GetGenProb = (idUser, idGenProb) => {
    console.log(idUser, idGenProb);
    return axios.get(API_URL+"getOne/"+idUser+'/'+idGenProb);
}

const GetAllGenProbByProb = (idGenProb) => {
    return axios.get(API_URL+"getAllByProb/"+idGenProb);
}

const UpdateGenProb = (idUser, idGenProb, answer) => {
    return axios.post(API_URL+"UpdateOne/"+idUser+'/'+idGenProb+'/'+answer);
}

export default {
    SaveGenProb, 
    GetGenProb,
    UpdateGenProb,
    GetAllGenProbByProb
};