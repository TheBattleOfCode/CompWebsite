import React from "react";
import { useState, useEffect } from "react";
import UserService from "../services/user.service";

function ProbTemp() {
    return (
        <div>

            <div class="container"></div>

            <div class="row">

                <div class="col-9 align-self-start">
                    <h1 class="h1 text-center">ProblemName</h1>

                    <p class="fs-4 p-sm-3 text-sm-start">Problem Description</p>

                </div>

                <div class="col-3 align-self-center ">
                    <h2 class="h2">Time left = <span> 20:00 </span></h2>
                    <h2 class="h2">Competition name</h2>
                    <a href="comp_temp.html" onclick="return false;"><p class="card-text fs-4 link-secondary">1- Problem name</p></a>
                    <a href="#"><p class="card-text fs-4 link-success">2- Problem name Solved</p></a>
                    <a href="#"><p class="card-text fs-4 link-primary">3- Problem name</p></a>
                    <a href="#"><p class="card-text fs-4 link-primary">4- Problem name</p></a>
                    <a href="#"><p class="card-text fs-4 link-primary">5- Problem name</p></a>

                    <h3> Stats:</h3>
                    <h4>Completed by <span>x</span> players</h4>
                </div>

            </div>

            <div class="row justify-content-center" >
                <div class="col-9 align-self-center">
                    <h2>Input example:</h2>
                    <div class="badge bg-secondary text-start">
                        <p class="fs-4 ">Prob example</p>
                    </div>
                </div>
            </div>

            <div class="row justify-content-start" >
                <div class="col-9">
                    <p class="fs-4 p-sm-3 text-sm-start ">problem note</p>
                </div>
            </div>
            <div class="row justify-content-start" id="aa">
                <div class="col-9">


                    <textarea type="text" cols="1" rows="1" id="myInput">.$input.</textarea>
                    <a onclick="myFunction()" class="fs-4 p-sm-3 text-sm-start link-info">Get you input here</a>


                    <form action="includes/try_inc.php?probId='.$probId.'" method="POST">
                        <input type="text"  name="submission" method="POST" placeholder="Your answer" />
                        <button type="submit" name="submit">submit</button>
                    </form>
                    <p>To get an Input and get solving, <a href="login.php">login</a> or <a href="signup.php">signup</a>.</p>




                </div>

            </div>
            <footer class="card-footer">
                <p>Author: Foulen ben foulen</p>

            </footer>

        </div>
    );
}

export default ProbTemp;