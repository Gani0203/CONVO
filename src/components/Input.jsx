import React, { useContext, useState } from "react";
import Attach from '../img/attach.png';
import File from '../img/file.png';

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (!text && !image) {
      console.error("Cannot send an empty message.");
      return;
    }

    if (!data.chatId) {
      console.error("No chatId available.");
      return;
    }

    try {
      const chatDocRef = doc(db, "chats", data.chatId);

      if (image) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          null, // Optionally handle progress updates here
          (error) => {
            console.error("Upload error:", error.message);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(chatDocRef, {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            });
            setText(""); // Reset the text input
            setImage(null); // Reset the image
          }
        );
      } else {
        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
        setText(""); // Reset the text input
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
    await updateDoc(doc(db,"userchats",currentUser.uid),{
      [data.chatId+".lastMessage"]:{
        text
    },
    [data.chatId+".date"]:serverTimestamp()
    })
    await updateDoc(doc(db,"userchats",data.user.uid),{
      [data.chatId+".lastMessage"]:{
        text
    },
    [data.chatId+".date"]:serverTimestamp()
    })
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {  // Only send on Enter without Shift
      e.preventDefault();  // Prevent new line if Enter is pressed
      handleSend();  // Call the send function
    }
  };


  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something.........."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        
      />
      <div className="send">
        <img src={Attach} alt="Attach" />
        <input
          type="file"
          id="attach"
          style={{ display: "none" }}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="attach">
          <img src={File} alt="File" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
