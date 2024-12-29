import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1/';

const GetAllCounties = () => {
	return axios.get(API_URL + 'independent?status=true');
};

export default {
	GetAllCounties,
};
