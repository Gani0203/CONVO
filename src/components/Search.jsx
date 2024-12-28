import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Find from "../img/search.png"; // Make sure you are importing your image correctly

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  // Function to search for the user
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No user found
        setUser(null);
        setErr(true);

        // Hide the error message after 3 seconds
        setTimeout(() => {
          setErr(false);
        }, 3000);
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
        setErr(false); // Clear any previous error state
      }
    } catch (err) {
      setErr(true);
    }

    setUsername(""); // Clear the input field after search
  };

  // Trigger search on Enter key press
  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  // Handle user selection to start a chat
  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userchats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userchats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      // Reset states after user selection
      setUser(null);
      setUsername("");
    } catch (err) {
      setUser(null);
      setUsername("");
    }
  };

  return (
    <div className="search">
      <div className="searchform">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {/* When clicked, trigger the search */}
        <img
          src={Find}
          alt="Find User"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Error message */}
      {err && <span>No user found!</span>}

      {/* Display the user result */}
      {user && (
        <div className="userchat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userchatinfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
