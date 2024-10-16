import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import { Link } from "react-router-dom";
import "./style.css";
export default function NotFoundPage({
  socket,
  getAllPosts,
  notifications,
  setVisiblePost,
  setNotifi,
  setShowChat,
  listMess,
  onlineUsers,
  openChatWindow,
  setOpenChatWindows,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const goBack = () => {
    window.history.back();
  };
  useEffect(() => {
    setVisiblePost(false);
  }, []);
  return (
    <div className="home">
      <Header
        getAllPosts={getAllPosts}
        socket={socket}
        notifications={notifications}
        setNotifi={setNotifi}
        setShowChat={setShowChat}
        listMess={listMess}
        onlineUsers={onlineUsers}
        openChatWindow={openChatWindow}
        setOpenChatWindows={setOpenChatWindows}
      />

      <div className="notFoundPage_middle">
        <img src="../../../../images/404.png" alt="" className="" />
        <Link to="/">
          <div className="gotonewsfeed">
            <button>
              <p>Go to News Feed</p>
            </button>
          </div>
        </Link>

        <Link to="#" onClick={goBack} className="goback">
          Go Back
        </Link>
      </div>
    </div>
  );
}
