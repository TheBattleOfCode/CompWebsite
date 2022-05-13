import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import countryService from "../services/country.service";
import userService from "../services/user.service";
import "./Standings.css";

const Standings = () => {
  const currentUser = authService.getCurrentUser();
  const [ users, setUsers ] = useState([]);
  const [ filtredUsers, setFiltredUsers ] = useState([]);
  const [ countries, setCountries ] = React.useState([]);
  const [ countryFilter, setCountryFilter ] = React.useState("");
  const [ loading, setLoading ] = useState(false);



  //get countries from api
  const getCountries = async () => {
    const countriesLocal = await countryService.GetAllCounties()
    setCountries(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common)));
    localStorage.setItem("countries", JSON.stringify(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common))));
  }

  const getCountryImage = (name) => {
    let country = countries.filter(country => country.name.common === name);
    console.log(country)
    return country.length ? country[ 0 ].flags.png : "https://flagcdn.com/w320/uy.png";
  }

  const getUser = async () => {
    const Userdata = await userService.getUsers();
    const usersLocal = Userdata.data
    .filter(user => (!user.roles.includes("619a62a8e8934539f45022c9") || currentUser.roles.includes("ROLE_ADMIN")))
    .sort((a, b) => b.indivScore - a.indivScore);
    setUsers(usersLocal);
    setFiltredUsers(usersLocal);
    users.sort((a, b) => b.indivScore - a.indivScore);
  }



  useEffect(() => {
    getUser();

  }, []);

  useEffect(() => {
    setLoading(true);
    if (localStorage.getItem("countries") !== null) {
      setCountries(JSON.parse(localStorage.getItem("countries")));
      setLoading(false);
    }
    else {
      getCountries().then(() => {
        setLoading(false);
      });
    }

  }, []);

  useEffect(() => {
    if (countryFilter == "N/A") {
      setFiltredUsers(users);
    }
    else {
      setFiltredUsers(users.filter(ers => ers.country == countryFilter))
    }
  }, [ countryFilter ])

  return (
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">
            <select id="dropdown" onChange={(e) => setCountryFilter(e.target.value)}>
              <option value="N/A">Country (All)</option>
              <option value={currentUser.country ? currentUser.country : "Uruguay"}>Same as me</option>
              {countries.sort((cc, cb) => cc.name.common < cb.name.common).map((country, index) => {
                return <option key={index} value={country.name.common}>{country.name.common}</option>
              })}

            </select>
          </th>
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
        {filtredUsers.map((user, index) => {
          return (
            <tr key={index} className={currentUser.id == user._id ? "table-active" : ""}>

              <td >{index + 1}</td>
              <td >{loading ? <span className="spinner-border spinner-border-sm"></span>:<img className="flag" src={getCountryImage(user.country)} />} {user.country ? user.country : "ffdv"}</td>
              <td >{ user.roles.includes("619a62a8e8934539f45022c9")  ? <span class="badge badge-danger">Admin</span>:user.organization}</td>
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