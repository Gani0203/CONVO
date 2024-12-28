import { signOut } from "firebase/auth";
import React, { useContext, useState } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext); // Access both currentUser and setCurrentUser from context
  const [showLogout, setShowLogout] = useState(false);

  const handleClick = () => {
    setShowLogout(true); // Show the logout button when clicked

    // Hide the logout button after 5 seconds
    setTimeout(() => {
      setShowLogout(false);
    }, 5000); // 5000ms = 5 seconds
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setCurrentUser(null); // Set currentUser to null in context
    } catch (error) {
      console.error("Error during sign out:", error);
    }

    setShowLogout(false); // Optionally hide the logout button after signing out
  };

  return (
    <div className="navbar">
      <span className="logo">CONVO</span>
      <div className="user" onClick={handleClick}>
        <span>{currentUser?.displayName}</span>
        <img src={currentUser?.photoURL} alt="" />
        {showLogout && (
          <button onClick={handleLogout}>Logout</button> // Display the logout button when clicked
        )}
      </div>
    </div>
  );
};

export default Navbar;
