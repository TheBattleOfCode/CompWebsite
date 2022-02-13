import React from "react";

const Contest = () => {
    return(
        <table class="table table-striped table-hover">
            <thead>
            <tr>
                <th scope="col">Competition</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Number of poblems</th>
                <th scope="col">Passcode</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">First Competition</th>
                <td>15/02/2021  15:45</td>
                <td>15/02/2021  18:45</td>
                <td>5</td>
                
                <td>
                <input type="text" value="code"/>
                </td>
                <td>
                <input type="button" value="Enter"/>
                </td>
                
            </tr>
            
            <tr>
                <th scope="row">second Competition no passcode</th>
                <td>15/02/2021  15:45</td>
                <td>15/02/2021  18:45</td>
                <td>7</td>
                
                <td>
                <input type="text"/>
                </td>
                <td>
                <input type="button" value="Enter"/>
                </td>
                
            </tr>

            <tr>
                <th scope="row">third Competition</th>
                <td>15/02/2021  15:45</td>
                <td>15/02/2021  18:45</td>
                <td>5</td>
                
                <td>
                <input type="text"/>
                </td>
                <td>
                <input type="button" value="Enter"/>
                </td>
                
            </tr>


            <tr>
                <th scope="row">fourth Competition</th>
                <td>15/02/2021  15:45</td>
                <td>15/02/2021  18:45</td>
                <td>5</td>
                
                <td>
                <input type="text"/>
                </td>
                <td>
                <input type="button" value="Enter"/>
                </td>
                
            </tr>


            
            </tbody>
        </table>
)}
export default Contest;