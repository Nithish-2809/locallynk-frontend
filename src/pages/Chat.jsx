import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader"; // ✅ ADD
import "../Styles/Chat.css";

const Chat = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ ADD

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = currentUser?._id || currentUser?.id;

  const fetchChats = async () => {
    try {
      setLoading(true); // ✅ start loader

      const res = await axios.get(
        "https://locallynk.onrender.com/message/my-chats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setChats(res.data.chats || []);

    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      {/* ✅ GLOBAL LOADER */}
      {loading && <Loader text="Loading chats..." />}

      <div className="chatlist-wrapper">
        <h2 className="chatlist-title">Chats</h2>

        {!loading && chats.length === 0 && (
          <p className="no-chats">No conversations yet</p>
        )}

        {chats.map((chat, i) => (
          <div
            key={i}
            className="chatlist-item"
            onClick={() =>
              navigate(`/chat/${chat.user._id}/${chat.product._id}`)
            }
          >
            <img
              src={
                chat.user.profilePic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="user"
              className="chat-avatar"
            />

            <div className="chatlist-info">
              <p className="chatlist-name">{chat.user.userName}</p>
              <p className="chatlist-lastmsg">{chat.lastMessage}</p>
            </div>

            <div className="chatlist-meta">
              <span className="chatlist-product">
                {chat.product.productName}
              </span>

              {chat.unreadCount > 0 && (
                <span className="unread-badge">
                  {chat.unreadCount}
                </span>
              )}

              <span className="chatlist-time">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Chat;
