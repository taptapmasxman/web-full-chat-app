import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleVideoCall = () => {
    if (data.user?.displayName) {
      navigate(`/videocall?channel=${data.user.displayName}`);
    }
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="Video Call" onClick={handleVideoCall} style={{ cursor: "pointer" }} />
          <img src={Add} alt="Add" />
          <img src={More} alt="More" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
