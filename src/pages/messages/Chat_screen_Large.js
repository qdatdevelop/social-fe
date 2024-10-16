import { useEffect, useRef, useState, useReducer } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import DeatilMess from "../../svg/deatilMess";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { HashLoader } from "react-spinners";
import { ClipLoader } from "react-spinners";
import {
  getMessages,
  sendMessage,
  updateSeenMess,
} from "../../functions/messenger";
import { uploadImages } from "../../functions/uploadImages";
import useClickOutside from "../../helpers/clickOutside";
import Mess_Screen from "./Mess";
export default function Chat_screen_Large({
  setShowChat,
  showChat,
  socket,
  onlineUsers,
  getListMess,
  stt,
  closeChatWindow,
  detail,
  setDetail,
  setVisiblePhotoDetail,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [picker, setPicker] = useState(false);
  const menu1 = useRef(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const [messageImage, setMessageImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatMenu, setChatMenu] = useState(false);
  const [unseen, setUnseen] = useState(false);
  const [loadingMess, setLoadingMess] = useState(false);
  let chatWindowStyle;
  useClickOutside(menu1, () => setChatMenu(false));
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setMessageImage(event.target.result);
    };
  };
  useEffect(() => {
    getAllMessagesLoading(showChat._id);
    functionupdateSeenMess();
    getListMess();
  }, [showChat]);
  useEffect(() => {
    socket.on("getMessage", (data) => {
      getListMess();
      getAllMessages(data.senderId);
    });
  }, [socket]);
  const getAllMessagesLoading = async (senderId) => {
    setLoadingMess(true);
    const res = await getMessages(senderId, user.token);
    setMessages(res.mess);
    setLoadingMess(false);
    setUnseen(res.unseen);
    scrollToBottom();
  };
  const getAllMessages = async (senderId) => {
    const res = await getMessages(senderId, user.token);
    setMessages(res.mess);

    setUnseen(res.unseen);
    scrollToBottom();
  };
  const functionupdateSeenMess = async () => {
    await updateSeenMess(showChat._id, user.token);
  };

  const handleMessage = async (e) => {
    if (e.key === "Enter") {
      if (messageImage != "") {
        setLoading(true);
        const img = dataURItoBlob(messageImage);
        const path = `${user.id}/messages/${showChat._id}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        const imgComment = await uploadImages(formData, path, user.token);

        const messages = await sendMessage(
          showChat._id,
          text,
          imgComment[0].url,
          user.token
        );

        setMessages(messages.newMessages);
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId: showChat._id,
        });
        setLoading(false);
        setText("");
        setMessageImage("");
      } else {
        setLoading(true);
        const messages = await sendMessage(showChat._id, text, "", user.token);
        setMessages(messages.newMessages);
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId: showChat._id,
        });
        setLoading(false);
        setText("");
        setMessageImage("");
      }
      getListMess();
      scrollToBottom();
    }
  };
  const handleIcon = async (e) => {
    const messages = await sendMessage(
      showChat?._id,
      showChat?.icon,
      "",
      user.token
    );
    setMessages(messages.newMessages);
    socket.emit("sendMessage", {
      senderId: user.id,
      receiverId: showChat._id,
    });

    setText("");
    setMessageImage("");

    getListMess();
    scrollToBottom();
  };
  const chatContainerRef = useRef(null);
  const textRef = useRef(null);
  const imgInput = useRef(null);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <>
      <div
        className="chat-window_screen"
        style={chatWindowStyle}
        onClick={() => {
          functionupdateSeenMess();
          getListMess();
          setUnseen(false);
        }}
      >
        <div
          className="box_header_user_mess"
          style={{
            height: "52px",
            borderBottom: "1px solid rgb(204, 204, 204)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              className="contact_img"
              style={{ paddingLeft: "5px", display: "flex" }}
            >
              {onlineUsers.some((user) => user.userId === showChat?._id) && (
                <div
                  className="state_active_user_mess"
                  style={{ left: "35px" }}
                />
              )}

              <img src={showChat?.picture} alt="" />
            </div>

            <div
              className="user_name"
              style={
                unseen
                  ? {
                      color: "#fff",
                      paddingRight: "5px",
                      display: "flex",
                      fontSize: "17px",
                    }
                  : {
                      color: "var(--color-primary)",
                      paddingRight: "5px",
                      display: "flex",
                      fontSize: "17px",
                    }
              }
            >
              {showChat?.first_name} {showChat?.last_name}
            </div>
          </div>
          <div
            className="small_circle_mess"
            onClick={() => {
              setDetail((prev) => !prev);
            }}
          >
            {detail ? (
              <div style={{}}>
                <DeatilMess color={showChat?.color} />
              </div>
            ) : (
              <DeatilMess color={showChat?.color} />
            )}
          </div>
        </div>
        <div
          className="messages_screen scrollbar"
          style={detail ? { width: "963px" } : { width: "1324px" }}
          ref={chatContainerRef}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <div className="contact_chat">
              {onlineUsers.some((user) => user.userId === showChat?._id) && (
                <div
                  className="state_active_user_mess"
                  style={
                    detail
                      ? {
                          left: "490px",
                          bottom: "5px",
                          width: "14px",
                          height: "14px",
                        }
                      : {
                          left: "670px",
                          bottom: "5px",
                          width: "14px",
                          height: "14px",
                        }
                  }
                />
              )}

              <img src={showChat?.picture} alt="" />
            </div>
          </div>
          <div
            className="user_name"
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
              fontSize: "17px",
            }}
          >
            {showChat?.first_name} {showChat?.last_name}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
              fontSize: "13px",
              fontWeight: "400",
              color: "#65676B",
            }}
          >
            <p>Facebook </p>
            <p>You're friends on Facebook</p>
          </div>

          {!loadingMess ? (
            <>
              {messages &&
                messages
                  .sort((a, b) => {
                    return new Date(a.messageAt) - new Date(b.messageAt);
                  })
                  .map((message, i) => (
                    <Mess_Screen
                      message={message}
                      user={user}
                      key={i}
                      showChat={showChat}
                      socket={socket}
                      setVisiblePhotoDetail={setVisiblePhotoDetail}
                    />
                  ))}
            </>
          ) : (
            <>
              <div className="sekelton_loader">
                <HashLoader color="#1876f2" />
              </div>
            </>
          )}
        </div>

        <div className="write_chat">
          <div className="create_comment_wrap" style={{ marginTop: "10px" }}>
            <div className="create_comment">
              <div className="comment_input_wrap">
                {picker && (
                  <div className="comment_emoji_picker">
                    <Picker onEmojiClick={handleEmoji} />
                  </div>
                )}
                <input
                  type="file"
                  hidden
                  ref={imgInput}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImage}
                />
                {error && (
                  <div className="postError comment_error">
                    <div className="postError_error">{error}</div>
                    <button className="blue_btn" onClick={() => setError("")}>
                      Try again
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  ref={textRef}
                  value={text}
                  placeholder="Aa"
                  onChange={(e) => setText(e.target.value)}
                  onKeyUp={handleMessage}
                />
                <div className="comment_circle" style={{ marginTop: "5px" }}>
                  <ClipLoader size={20} color="#1876f2" loading={loading} />
                </div>
                <div
                  className="comment_circle_icon hover2"
                  onClick={() => {
                    setPicker((prev) => !prev);
                  }}
                >
                  <i className="emoji_icon"></i>
                </div>
                <div
                  className="comment_circle_icon hover2"
                  onClick={() => imgInput.current.click()}
                >
                  <i className="camera_icon"></i>
                </div>
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleIcon();
                }}
              >
                {showChat?.icon}
              </div>
            </div>
            {messageImage && (
              <div className="comment_img_preview">
                <img src={messageImage} alt="" />
                <div
                  className="small_white_circle"
                  onClick={() => setMessageImage("")}
                >
                  <i className="exit_icon"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
