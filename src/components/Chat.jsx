import React, { useContext } from "react";
import Add from '../img/add.png';
import More from '../img/more.png';
import Video from '../img/video.png';
import Messages from './Messages'
import Input from '../components/Input'
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const {data}=useContext(ChatContext)

  return <div className="chat">
    <div className="chatinfo">
      <span>{data?.user?.displayName}</span>
      <div className="chaticons">
        <img src={Video} alt="" />
        <img src={Add} alt="" />
        <img src={More} alt="" />
      </div>
    </div>
      <Messages/>
      <Input/>
  </div>;
};

export default Chat;
