import axios from "axios";

const API_URL = "http://localhost:8080/api/problem/";

const SaveProb = (title, description, score, inOutContentGen, type) => {
  return axios.post(API_URL+"add", { 
    title,
    description,
    score,
    inOutContentGen,
    type
  });
}

const GetProb = (id) => {
  return axios.get(API_URL+"getone/"+id);
}

const GetProbs = () => {
  return axios.get(API_URL+"getall");
}

const DeleteProb = (id) => {
  return axios.delete(API_URL+"delete/"+id);
}

export default {
    SaveProb,
    GetProb,
    GetProbs,
    DeleteProb
};