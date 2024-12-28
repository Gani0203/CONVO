import React, { useState } from "react";
import Attach from "../img/attach.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth,storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [err,setErr]= useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
  
    if (!file) {
      setErr(true);
      console.error("No file selected");
      return;
    }
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, `profilePictures/${res.user.uid}`);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          setErr(true);
          console.error("Upload error:", error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
  
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
  
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userchats", res.user.uid), {
            
          });
          navigate("/"); 
        }
      );
    } catch (err) {
      setErr(true);
      console.error("Error:", err.message);
    }
  };
  

    
  return (
    <div className="fc">
      <div className="fw">
        <span className="logo">CONVO</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Attach} alt="logo" />
            <span>Add profile photo</span>
          </label>
          <button>Sign up</button>
        </form>
        {err && <span>Something went wrong..</span>}
        <p>Already have account?<Link to="/login"> Login </Link></p>
      </div>
    </div>
  );
};

export default Register;
