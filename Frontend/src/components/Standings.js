import React, { useEffect, useState } from "react";
import userService from "../services/user.service";
  
  const Standings = () =>{

    const  [users, setUsers] = useState([]);

    const getUser = async() => {
      const Userdata = await userService.getUsers();     

      setUsers( Userdata.data.sort( (a, b) => b.indivScore - a.indivScore ) );  
      users.forEach(element => {
        
      });   
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
          {users.map( (user, index) => {        
              return(         
                  <tr key={index}>

                    <td >{index+1}</td>               
                    <td >{user.country}</td>               
                    <td >{user.organization}</td> 
                    <td >{user.username}</td>
                    <td >{user.firstName}</td>             
                    <td >{user.lastName}</td> 
                    <td>{user.teamName}</td>
                    <td>0</td>
                    <td>{user.indivScore}</td>          
                    <td>{user.countSolved}</td>          
                  </tr>         
                )}        
              )}     
              </tbody> 
            </table>        
          ) } 
export default Standings;