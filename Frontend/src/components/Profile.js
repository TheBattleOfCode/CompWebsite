import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import countryService from "../services/country.service";
import userService from "../services/user.service";
import "./Profile.css";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [ countries, setCountries ] = useState([]);
  const [ editMsg, setEditMsg ] = useState(false);
  const [ firstName, setFirstName ] = useState(currentUser.firstName);
  const [ lastName, setLastName ] = useState(currentUser.lastName);
  const [ phone, setPhone ] = useState(currentUser.phone);
  const [ city, setCity ] = useState(currentUser.city);
  const [ country, setCountry ] = useState(currentUser.country);
  const [ profilePicture, setProfilePicture ] = useState(currentUser.profilePicture);
  const [ successful, setSuccessful ] = useState(false);
  const [ message, setMessage ] = useState("");
  const [ cancelMsg, setCancelMsg ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ editImage, setEditImage ] = useState(false);
  const [ uploadName, setUploadName ] = useState("");


  //edit profile first on click of edit button
  const editProfile = () => {
    setEditMsg(!editMsg);
    setSuccessful(false);
    setCancelMsg(false);
    console.log(editMsg);
  };

  //Cancel edit profile
  const cancelEdit = () => {
    setEditMsg(!editMsg);
    setCancelMsg(!cancelMsg);
    console.log(editMsg);
    setMessage(false);
  };


  //save profile after editing
  const saveProfile = () => {
    setLoading(true);
    userService.UpdateUser(currentUser.id, { firstName: firstName, lastName: lastName, phone: phone, city: city, country: country }).then(
      (response) => {
        console.log(response);
        if (editMsg) { setEditMsg(!editMsg); }
        setLoading(false);
        setSuccessful(true);
      }

    );

    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.phone = phone;
    currentUser.city = city;
    currentUser.country = country;
    currentUser.profilePicture = profilePicture;




    localStorage.setItem("user", JSON.stringify(currentUser));

  };


  // save profile picture
  const saveProfilePicture = () => {
    setLoading(true);
    userService.UpdateUser(currentUser.id, { profilePicture: profilePicture }).then(
      (response) => {
        console.log(response);
        if (editImage) { setEditImage(!editImage); }
        setLoading(false);
      });
    currentUser.profilePicture = profilePicture;
    localStorage.setItem("user", JSON.stringify(currentUser));
    setUploadName("");
  }



  //get countries from api
  const getCountries = async () => {
    if (localStorage.getItem("countries") === null) {
      const countriesLocal = await countryService.GetAllCounties();
      setCountries(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common)));
      console.log(countriesLocal.data[ 0 ]);
      localStorage.setItem("countries", JSON.stringify(countriesLocal.data.sort((c1, c2) => c1.name.common.localeCompare(c2.name.common))));
    }
    else {
      const countries = JSON.parse(localStorage.getItem("countries"));
      setCountries(countries);
    }
  }


  function encodeImageFileAsURL(element) {
    var file = element.files[ 0 ];
    var reader = new FileReader();
    reader.onloadend = function () {
      if (reader.result.length > 100000) {
        alert("Image size is too big\nMax size is 100kb\nYour image size is " + reader.result.length / 1000 + "kb");
      }
      else {
        if (reader.result == currentUser.profilePicture) {
          setUploadName("You chose your old profile picture");
        }
        else {
          setUploadName(file.name);
        }
        console.log('RESULT', reader.result);
        setProfilePicture(reader.result);
        console.log(reader.result.length);

      }
    }
    reader.readAsDataURL(file);

  }

  useEffect(() => {
    setLoading(true);
    getCountries().then(() => {
      setLoading(false);
    });
  }, []);




  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const onChangeLastName = (e) => {
    setLastName(e.target.value);
  };

  const onChangePhone = (e) => {
    setPhone(e.target.value);
  };

  const onChangeCity = (e) => {
    setCity(e.target.value);
  };

  const onChangeCountry = (e) => {
    setCountry(e.target.value);
  };




  return (
    <div className="container">
      <div className="main-body">
        <div className="row">
          <nav aria-label="breadcrumb" className="main-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/home">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">User Profile</li>
            </ol>
          </nav>
        </div>
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">

                  <div className="image_container">

                    <img src={profilePicture} alt="Admin" className="rounded-circle profile_image" />

                    {!editImage ?
                      <div className="change_pp_button">
                        <button className="btn btn-secondary" onClick={() => setEditImage(!editImage)}>Change</button>
                      </div> : null}

                  </div>


                  {editImage ? <div className="form-group">
                    <div className="mt-3">

                      <div class="upload-btn-wrapper">
                        <button class="upload_btn">Choose a file</button>
                        <input type="file" onChange={(e) => encodeImageFileAsURL(e.target)} name="myFile" />
                      </div><br />

                      <span className={profilePicture == currentUser.profilePicture ? "text-danger" : "text-success"} ><strong><em>{uploadName ? uploadName : "No file chosen"} </em></strong></span><br />

                      <button className="btn btn-primary mt-3" onClick={() => saveProfilePicture()} disabled={profilePicture == currentUser.profilePicture}>
                        {loading && (
                          <span className="spinner-border spinner-border-sm"></span>
                        )} Save</button>
                      <button className="btn btn-danger mt-3" onClick={() => { setProfilePicture(currentUser.profilePicture); setEditImage(false); }}>Cancel</button>
                    </div>
                  </div> : null}


                  <div className="mt-3">
                    <h4>{currentUser.username}</h4>
                    <p className="text-secondary mb-1">{currentUser.indivScore}</p>
                    <p className="text-muted font-size-sm">{currentUser.city === null ? "--" : currentUser.city} , {currentUser.country === null ? "--" : currentUser.country}</p>
                    <button className="btn btn-primary">Follow</button>
                    <button className="btn btn-outline-primary">Message</button>
                  </div>

                </div>
              </div>
            </div>
            <div className="card mt-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe mr-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>Website</h6>
                  <span className="text-secondary">https://BoC.com</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github mr-2 icon-inline"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>Github</h6>
                  <span className="text-secondary">BoC</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter mr-2 icon-inline text-info"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>Twitter</h6>
                  <span className="text-secondary">@BoC</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram mr-2 icon-inline text-danger"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>Instagram</h6>
                  <span className="text-secondary">BoC</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook mr-2 icon-inline text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</h6>
                  <span className="text-secondary">BoC</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>

                  {editMsg ? <div className="row"><div className="col">
                    <input
                      type="text"
                      className="form-control"
                      value={firstName ? firstName : ''}
                      name="firstName"
                      placeholder="First Name"
                      onChange={onChangeFirstName} />
                  </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        value={lastName ? lastName : ''}
                        placeholder="Last Name"
                        name="lastName"
                        onChange={onChangeLastName} />
                    </div></div> : <div className="col-sm-9 text-secondary">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>}
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {currentUser.email}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  {editMsg ? <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      value={phone ? phone : ''}
                      name="phone"
                      placeholder="phone"
                      onChange={onChangePhone} />
                  </div> : <div className="col-sm-9 text-secondary">
                    {currentUser.phone === null ? "--" : currentUser.phone}
                  </div>}
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Team Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    --
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Address</h6>
                  </div>{editMsg ?
                    <div className="row">
                      <div className="col">


                        <select id="dropdown" onChange={(e) => setCountry(e.target.value)}>
                          {currentUser.country ? <option value={currentUser.country}>{currentUser.country}</option> : <option value="N/A">Select Country</option>}

                          {countries.map((country, index) => {
                            return <option key={index} value={country.name.common}>{country.name.common}</option>
                          })}
                        </select>



                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          value={city ? city : ''}
                          name="city"
                          placeholder="city"
                          onChange={onChangeCity} />
                      </div></div> : <div className="col-sm-9 text-secondary">
                      {currentUser.city === null ? "--" : currentUser.city} , {currentUser.country === null ? "--" : currentUser.country}
                    </div>}
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-12">
                    {!editMsg ? <button
                      className="btn btn-primary"
                      onClick={editProfile} disabled={loading}>
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Edit</span>
                    </button> :
                      <button
                        className="btn btn-outline-primary"
                        onClick={cancelEdit} disabled={loading}>
                        {loading && (
                          <span className="spinner-border spinner-border-sm"></span>)}

                        Cancel</button>}
                    {cancelMsg && <div className="alert alert-danger">
                      Profile update canceled
                    </div>}
                    {editMsg && <button
                      className="btn btn-success"
                      onClick={saveProfile} disabled={loading}>
                      {loading && (<span className="spinner-border spinner-border-sm"></span>)}
                      Save</button>}
                    {successful && <div className="alert alert-success">
                      Profile updated successfully
                    </div>}
                  </div>
                </div>



                <div className="row gutters-sm">
                  <div className="col-sm-6 mb-3">
                    <div className="card h-60">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">assignment</i>Project Status</h6>
                        <small>Web Design</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>Website Markup</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>One Page</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>Mobile Template</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '55%' }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>Backend API</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '66%' }} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <div className="card h-60">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center mb-3"><i className="material-icons text-info mr-2">assignment</i>Project Status</h6>
                        <small>Web Design</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>Website Markup</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '72%' }} aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>One Page</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '89%' }} aria-valuenow="89" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>Mobile Template</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '55%' }} aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <small>Backend API</small>
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div className="progress-bar bg-primary" role="progressbar" style={{ width: '66%' }} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
