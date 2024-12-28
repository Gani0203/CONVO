import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const { data } = useContext(ChatContext); // Access data from ChatContext
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data?.chatId) {
      // Only listen to changes if chatId exists
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages ); // Safely access messages
        }
      });

      // Clean up listener on unmount
      return () => {
        unsub();
      };
    }
  }, [data?.chatId]);

  return (
    <div className="msgs">
      {
        messages.map((m) => (
          <Message message={m} key={m.id} /> // Ensure unique key
        ))}
    </div>
  );
};

export default Messages;
