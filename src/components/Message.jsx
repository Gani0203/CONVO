import React, { useContext, useEffect, useRef } from "react";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({message}) => {
  const {currentUser}=useContext(AuthContext)
  const {data} = useContext(ChatContext)
  const ref = useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message]);
  const parseTimestamp = (timestampString) => {
    const parsedDate = new Date(timestampString); // Try parsing the string
    if (!isNaN(parsedDate)) {
      return parsedDate.getTime(); // Convert to timestamp in milliseconds
    } else {
      return null; // Invalid date
    }
  };
  const formatTimestamp = (timestamp) => {
    if (timestamp && !isNaN(timestamp)) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } 
  };




  return <div ref={ref} className={`msg ${message.senderId === currentUser.uid && "owner"}` }>
    <div className="msginfo">
      <img src={message.senderId === currentUser.uid? currentUser.photoURL: data.user.photoURL}alt="" />
      <span>{formatTimestamp(message.timestamp)}</span>
    </div>
    <div className="msgcontent">
      <p>{message.text}</p>
      {message.image && <img src={message.image} alt="" />}
    </div>
  </div>;
};

export default Message;
