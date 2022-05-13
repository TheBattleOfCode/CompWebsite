import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import countryService from "../services/country.service";
import userService from "../services/user.service";

const Standings = () => {
  const currentUser = authService.getCurrentUser();
  const [ users, setUsers ] = useState([]);
  const [ countries, setCountries ] = React.useState([]);
  

  //get countries from api
  const getCountries = async () => {
    await setCountries( countryService.GetAllCounties());
    console.log(countries);
  }

  function getCountryImage(name){
    console.log(countries);
    while (!countries){}
    const country = countries.data.filter(country => country.name === name);
    return country[0].flags.png;
  }

  const getUser = async () => {
    const Userdata = await userService.getUsers();

    setUsers(Userdata.data.sort((a, b) => b.indivScore - a.indivScore));

    users.sort((a, b) => b.indivScore - a.indivScore);
  }



  useEffect(() => {
    getUser();
    getCountries();

  }, []);


  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Country</th>
          <th scope="col">Organization</th>
          <th scope="col">Username</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Team name</th>
          <th scope="col">Bonus</th>
          <th scope="col">Score</th>
          <th scope="col">Solved problems</th>
        </tr>     </thead>
      <tbody>
        {users.map((user, index) => {
          return (
            <tr key={index} className={currentUser.id == user._id ? "table-active" : ""}>

              <td >{index + 1}</td>
              <td ><img src={getCountryImage(user.country)} /> {user.country}</td>
              <td >{user.organization}</td>
              <td >{user.username}</td>
              <td >{user.firstName}</td>
              <td >{user.lastName}</td>
              <td>{user.teamName}</td>
              <td>0</td>
              <td>{user.indivScore}</td>
              <td>{user.countSolved}</td>
            </tr>
          )
        }
        )}
      </tbody>
    </table>
  )
}
export default Standings;