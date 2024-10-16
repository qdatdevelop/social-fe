import { useEffect, useRef, useState, useReducer } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { ClipLoader } from "react-spinners";
import DeatilMess from "../../svg/deatilMess";
import { HashLoader } from "react-spinners";
import {
  getMessagesRoom,
  sendMessageRoom,
  updateSeenMessInGroup,
} from "../../functions/messenger";
import { uploadImages } from "../../functions/uploadImages";
import MessRoom from "../../components/chat/MessRoom";
import SendImg from "../../svg/sendImg";
import useClickOutside from "../../helpers/clickOutside";
import MessRoom_Screen from "./MessRoom";
export default function Room_Mess_screen_Large({
  showChatRoom,
  socket,
  setShowChatRoom,
  onlineUsers,
  getListMess,
  stt,
  closeChatWindow,
  detail,
  setDetail,
  roomid,
  idroom,
  setVisiblePhotoDetail,
}) {
  let chatWindowStyle;
  const { user } = useSelector((state) => ({ ...state }));
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [messageImage, setMessageImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMess, setLoadingMess] = useState(false);
  const [unseen, setUnseen] = useState(false);
  const [chatMenu, setChatMenu] = useState(false);
  let number = 0;
  const menu1 = useRef(null);

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
  useClickOutside(menu1, () => setChatMenu(false));
  useEffect(() => {
    getAllMessagesLoading();
    functionupdateSeenMess();
  }, [showChatRoom._id]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      getListMess();
      getAllMessages(data.roomId);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket]);
  const getAllMessagesLoading = async () => {
    setLoadingMess(true);
    const res = await getMessagesRoom(showChatRoom._id, user.token);
    setLoadingMess(false);
    setMessages(res.mess);
    setUnseen(res.unseen);
    scrollToBottom();
    console.log("loading");
  };
  const getAllMessages = async (Room_id) => {
    const res = await getMessagesRoom(Room_id, user.token);
    setMessages(res.mess);
    setUnseen(res.unseen);
    scrollToBottom();
  };

  const functionupdateSeenMess = async () => {
    await updateSeenMessInGroup(showChatRoom._id, user.token);
  };

  const notification = async (iduser) => {
    socket.emit("sendMessage", {
      senderId: user.id,
      receiverId: iduser,
      roomId: showChatRoom._id,
    });
  };

  const handleMessage = async (e) => {
    if (e.key === "Enter") {
      if (messageImage != "") {
        setLoading(true);
        const img = dataURItoBlob(messageImage);
        const path = `${showChatRoom._id}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        const imgComment = await uploadImages(formData, path, user.token);

        const messages = await sendMessageRoom(
          showChatRoom._id,
          text,
          imgComment[0].url,
          user.token
        );
        setMessages(messages.newMessages);
        for (const receiverId of showChatRoom?.groupRef.members) {
          notification(receiverId.user);
        }

        setLoading(false);
        setText("");
        setMessageImage("");
      } else {
        setLoading(true);
        const messages = await sendMessageRoom(
          showChatRoom._id,
          text,
          "",
          user.token
        );
        setMessages(messages.newMessages);
        for (const receiverId of showChatRoom?.groupRef.members) {
          notification(receiverId.user);
        }
        setLoading(false);
        setText("");
        setMessageImage("");
      }
      scrollToBottom();
    }
  };
  const handleIcon = async (e) => {
    const messages = await sendMessageRoom(
      showChatRoom?._id,
      showChatRoom?.icon,
      "",
      user.token
    );
    setMessages(messages.newMessages);
    for (const receiverId of showChatRoom?.groupRef.members) {
      notification(receiverId.user);
    }

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
            onClick={() => setChatMenu(true)}
          >
            <div className="contact_img">
              {showChatRoom?.groupRef?.members?.map((member) => {
                const isUserOnline = onlineUsers.some(
                  (userOnline) =>
                    userOnline.userId === member?.user &&
                    userOnline.userId !== user.id &&
                    member?.user !== user.id
                );

                return isUserOnline ? (
                  <div key={member.user} className="state_active_user_mess" />
                ) : null;
              })}
              <img
                src="../../../../images/chat.png"
                alt=""
              />
            </div>

            <div
              className="contact"
              style={{ display: "flow", flexDirection: "column" }}
            >
              <span style={{ fontSize: "17px" }}>
                {showChatRoom?.room_name}
              </span>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-primary)",
                  fontWeight: "400",
                }}
              >
                {showChatRoom?.group_name}
              </p>
            </div>
            <div
              className="small_circle_mess"
              onClick={() => {
                setDetail((prev) => !prev);
              }}
            >
              {detail ? (
                <div style={{}}>
                  <DeatilMess color={showChatRoom?.color} />
                </div>
              ) : (
                <DeatilMess color={showChatRoom?.color} />
              )}
            </div>
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
              {showChatRoom?.groupRef?.members?.map((member) => {
                const isUserOnline = onlineUsers.some(
                  (userOnline) =>
                    userOnline.userId === member?.user &&
                    userOnline.userId !== user.id &&
                    member?.user !== user.id
                );

                return isUserOnline ? (
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
                ) : null;
              })}

              <img src="../../../../images/chat.png" alt="" />
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
              fontSize: "17px",
              fontWeight: "500",
            }}
          >
            {showChatRoom?.room_name}
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
            <p>Your group chat on Facebook</p>
          </div>
          {!loadingMess ? (
            <>
              {" "}
              {messages &&
                messages
                  .sort((a, b) => {
                    return new Date(a.messageAt) - new Date(b.messageAt);
                  })
                  .map((message, i) => (
                    <MessRoom_Screen
                      message={message}
                      user={user}
                      key={i}
                      showChatRoom={showChatRoom}
                      socket={socket}
                      setVisiblePhotoDetail={setVisiblePhotoDetail}
                    />
                  ))}
            </>
          ) : (
            <>
              {" "}
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
                {showChatRoom?.icon}
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
