
import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthService from "./components/AuthService";
import Login from "./components/Login";
import EventBus from "./components/EventBus";
import Register from "./components/Register";

const Header = () => {

  const [currentUser, setCurrentUser] = useState(undefined);
  const [uname, setCurrentUsername] = useState(undefined);
 

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    const username = AuthService.getUsername();
    setCurrentUsername(username)

    if (user) {
      setCurrentUser(user);
  
    }else {
      setCurrentUser(null);

    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  return (

   
    
    <div>
      
       <nav className="navbar navbar-expand navbar-dark bg-dark">
         <Link to={"/"} className="navbar-brand">
                HOME
            </Link>
            <div className="navbar-nav mr-auto">
            
                {currentUser && (
                    <li className="nav-item">
                    <Link to={"/up"} className="nav-link">
                        {uname}
                    </Link>
                    </li>
                )}
                 </div>

           {currentUser ? (
          <div className="navbar-nav ml-auto">
           
          <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
          </li>
            </div>
          ) : (
         <div className="navbar-nav ml-auto">
            <li className="nav-item">
               <Link to={"/login"} className="nav-link">
                Login
               </Link>
           </li>

             <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
               </Link>
            </li>
           </div>
         )}
 
      </nav>

            {/* {currentUser ? (
          <div className="navbar-nav ml-auto">
           
         <li className="nav-item">
         <a href="https://github.com/Codsssworth" target="_blank">Leave a star on my Gitbub</a>
        </li>
          </div>
         ) : (
         <div className="navbar-nav ml-auto">
            <li className="nav-item">
               < p  className="navbar-nav ml-auto">
                Login to enable username in chat. Emails not required.  
               </p>
           </li> */}
           {/* </div> */}
         

       <div className="container mt-3"> 
         <Routes>
    
           {/* <Route exact path={"/home"} element={<Home />} />  */}
           <Route exact path="/login" element={<Login />} />
           <Route exact path="/register" element={<Register />} />

        </Routes>
      </div> 

      
    </div>
  
);
};

export default Header;