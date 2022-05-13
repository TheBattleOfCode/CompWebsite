import React, { useEffect, useState } from "react";
import userService from "../services/user.service";
  
  const Standings = () =>{
    const  [users, setUsers] = useState([]);
    const getUser = async() => {
      const data = await userService.getUsers();     
      setUsers( data.data.sort( (a, b) => b.indivScore - a.indivScore ) );     
      users.sort( (a, b) => b.indivScore - a.indivScore );        
    }      
    
    useEffect(() => {     
      getUser();    
    } , []);     
    
    return(         
    <table class="table">     
      <thead class="thead-dark">      
       <tr>        
        <th scope="col">#</th>        
        <th scope="col">TEAM_Name</th>         
        <th scope="col">MP</th>         
        <th scope="col">MW</th>         
        <th scope="col">ML</th>         
        <th scope="col">Score</th>         
        <th scope="col">Bonus</th>         
        <th scope="col">Last 5 Rounds</th>       
      </tr>     </thead>     
      <tbody>          
          {users.map( (user, index) => {        
              return(         
                  <tr key={index}>             
                    <td >{user.teamName}</td>               
                    <td >{user.lastName}</td> 
                    <td >{user.firstName}</td>
                    <td >{user.firstName}</td>             
                    <td >{user.phone}</td> 
                    <td>{user.teamScore}</td>
                    <td>{user.indivScore}</td>
                    <td>0.0</td>          
                  </tr>         
                )}        
              )}     
              </tbody> 
            </table>        
          ) } 
export default Standings;