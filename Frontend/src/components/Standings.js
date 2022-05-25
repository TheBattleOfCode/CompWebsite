import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import countryService from "../services/country.service";
import userService from "../services/user.service";
import "./Standings.css";
import { FaSort } from 'react-icons/fa';


const Standings = () => {
  const currentUser = authService.getCurrentUser();
  const [ users, setUsers ] = useState([]);
  const [ filtredUsers, setFiltredUsers ] = useState([]);
  const [ countries, setCountries ] = React.useState([]);
  const [ countryFilter, setCountryFilter ] = React.useState("");
  const [ loading, setLoading ] = useState(false);
  const [ sortBy, setSortBy ] = useState([ "score", true ]);
  const idAdmin = "619a62a8e8934539f45022c9";


  //get countries from api
  const getCountries = async () => {
    const countriesLocal = await countryService.GetAllCounties()
    setCountries(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common)));
    localStorage.setItem("countries", JSON.stringify(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common))));
  }

  const getCountryImage = (name) => {
    let country = countries.filter(country => country.name.common === name);

    return country.length ? country[ 0 ].flags.png : "https://flagcdn.com/w320/uy.png";
  }

  const getUser = async () => {
    const Userdata = await userService.getUsers();
    const usersLocal = Userdata.data
      .filter(user => (!user.roles.includes(idAdmin) || currentUser.roles.includes("ROLE_ADMIN")))
      .sort((a, b) => b.indivScore - a.indivScore);
    setUsers(usersLocal);
    setFiltredUsers(usersLocal);
    users.sort((a, b) => b.indivScore - a.indivScore);
  }

  useEffect(() => {
    console.log(sortBy);
    let filterLocal=filtredUsers;
    switch (sortBy[ 0 ]) {
      /*case "org":
        filterLocal =filtredUsers.sort((a, b) => b.country.localeCompare(a.country)));
        break;*/
      case "username":
        filterLocal = filtredUsers.sort((a, b) => b.username.localeCompare(a.username)).slice();
        break;
      case "bonus":
        filterLocal = filtredUsers.sort((a, b) => b.bonus - a.bonus).slice();
        break;
      case "score":
        filterLocal = filtredUsers.sort((a, b) => b.indivScore - a.indivScore).slice();
        break;
      case "NbSolved":
        filterLocal = filtredUsers.sort((a, b) => b.countSolved - a.countSolved).slice();
        console.log(filtredUsers);
        break;
    }
    if (sortBy[ 1 ]) {
      setFiltredUsers(filterLocal.reverse());
    }
    else {
      setFiltredUsers(filterLocal);
    }
  }, [ sortBy ]);




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
        <tr className="">
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
          <th scope="col">  <FaSort style={{ display: "inline"}} onClick={() => setSortBy([ "org", sortBy[ 0 ] != "org" ? true : !sortBy[ 1 ] ].slice())}/> Organization</th>
          <th scope="col">  <FaSort style={{ display: "inline" }} onClick={() => setSortBy([ "username", sortBy[ 0 ] != "username" ? true : !sortBy[ 1 ] ].slice())}/>   Username</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Team name</th>
          <th scope="col">  <FaSort style={{ display: "inline" }} onClick={() => setSortBy([ "bonus", sortBy[ 0 ] != "bonus" ? true : !sortBy[ 1 ] ].slice())}/>      Bonus</th>
          <th scope="col">  <FaSort style={{ display: "inline" }} onClick={() => setSortBy([ "score", sortBy[ 0 ] != "score" ? true : !sortBy[ 1 ] ].slice())} />     Score</th>
          <th scope="col">  <FaSort style={{ display: "inline" }} onClick={() => setSortBy([ "NbSolved", sortBy[ 0 ] != "NbSolved" ? true : !sortBy[ 1 ] ].slice())} /> Solved problems</th>
        </tr>     </thead>
      <tbody>
        {filtredUsers.map((user, index) => {
          return (
            <tr key={index} className={currentUser.id == user._id ? "table-active" : ""}>
              <td >{index + 1}</td>
              <td >{loading ? <span className="spinner-border spinner-border-sm"></span> : <img className="flag" src={getCountryImage(user.country)} />} {user.country ? user.country : "ffdv"}</td>
              <td >{user.roles.includes(idAdmin) ? <span className="badge badge-danger">Admin</span> : user.organization}</td>
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