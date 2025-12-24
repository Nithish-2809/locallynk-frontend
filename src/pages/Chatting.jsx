import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import Notification from "../components/Notification";
import Loader from "../components/Loader"; // ✅ REUSED GLOBAL LOADER
import "../Styles/Chatting.css";

const socket = io("https://locallynk.onrender.com", {
  transports: ["websocket"],
});

const Chatting = () => {
  const { userId, productId } = useParams();
  const { state } = useLocation();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = storedUser?._id || storedUser?.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiver, setReceiver] = useState(state?.receiver || null);
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ LOADER STATE

  const bottomRef = useRef(null);

  /* ---------- popup helper ---------- */
  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  /* ---------- prevent self chat ---------- */
  useEffect(() => {
    if (userId === myId) {
      showPopup("error", "You cannot chat with yourself");
    }
  }, [userId, myId]);

  /* ---------- auto scroll ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- socket ---------- */
  useEffect(() => {
    if (!myId) return;

    socket.emit("addUser", myId);

    socket.on("receiveMessage", (msg) => {
      if (msg.senderId === userId && msg.productId === productId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [myId, userId, productId]);

  /* ---------- fetch chat history ---------- */
  const fetchChat = async () => {
    try {
      setLoading(true); // ✅ START LOADER

      const res = await axios.get(
        `https://locallynk.onrender.com/message/history/${userId}?productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessages(res.data.chat || []);

      // derive receiver if not passed via state
      if (res.data.chat?.length && !receiver) {
        const msg = res.data.chat[0];
        setReceiver(
          msg.sender._id === myId ? msg.receiver : msg.sender
        );
      }
    } catch {
      showPopup("error", "Failed to load chat");
    } finally {
      setLoading(false); // ✅ STOP LOADER
    }
  };

  useEffect(() => {
    if (userId && productId) fetchChat();
  }, [userId, productId]);

  /* ---------- mark as read ---------- */
  useEffect(() => {
    if (!userId || !productId) return;

    axios.patch(
      "https://locallynk.onrender.com/message/read",
      { userId, productId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  }, [userId, productId]);

  /* ---------- send message ---------- */
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(
        "https://locallynk.onrender.com/message/store",
        { message: text, receiverId: userId, productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      socket.emit("sendMessage", {
        senderId: myId,
        receiverId: userId,
        message: text,
        productId,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: myId,
          message: text,
          createdAt: new Date().toISOString(),
        },
      ]);

      setText("");
    } catch {
      showPopup("error", "Message not sent");
    }
  };

  /* ---------- helpers ---------- */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  let lastDate = "";

  return (
    <div className="chat-wrapper">
      {popup && <Notification type={popup.type} message={popup.message} />}

      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-header-left">
          <img
            src={
              receiver?.profilePic ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="User"
            className="chat-avatar"
          />
          <h3>{receiver?.userName || "Chat"}</h3>
        </div>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {loading ? (
          <div className="chat-loader">
            <Loader /> {/* ✅ SAME LOADER AS OTHER PAGES */}
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const msgDate = formatDate(msg.createdAt);
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;

              const isOwn =
                msg.sender === myId || msg.sender?._id === myId;

              return (
                <React.Fragment key={i}>
                  {showDate && (
                    <div className="date-separator">{msgDate}</div>
                  )}

                  <div className={`chat-msg ${isOwn ? "own" : ""}`}>
                    {msg.message}

                    <span className="chat-meta">
                      <span className="chat-time">
                        {formatTime(msg.createdAt)}
                      </span>

                      {isOwn && (
                        <span
                          className={`chat-tick ${msg.isRead ? "read" : ""}`}
                        >
                          ✔✔
                        </span>
                      )}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={!text.trim()} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatting;
