import { useEffect, useRef, useState, useReducer } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import { Link, useNavigate } from "react-router-dom";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { ClipLoader } from "react-spinners";
import Exit from "../../svg/exit";
import { getMessagesRoom, sendMessageRoom, updateSeenMessInGroup } from "../../functions/messenger";
import { HashLoader } from "react-spinners";
import { deleteRoomMess } from "../../functions/roommess";
import { uploadImages } from "../../functions/uploadImages";
import MessRoom from "./MessRoom";
import Circle from "../../svg/circle";
import SendImg from "../../svg/sendImg";
import useClickOutside from "../../helpers/clickOutside";
import CustomColor from "../../pages/messages/CustomColor";
import CustomEmoji from "../../pages/messages/CustomEmoji";

export default function Room_Mess_screen({ showChatRoom, socket, setShowChatRoom, onlineUsers, getListMess, stt, closeChatWindow, setOpenChatWindowMess, getRoomMess }) {
    let chatWindowStyle;
    let chatWindowStyleMenu;
    let admin = false;
    const { user } = useSelector((state) => ({ ...state }));
    const [picker, setPicker] = useState(false);
    const [custom, setCustom] = useState();
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [messageImage, setMessageImage] = useState("");
    const [cursorPosition, setCursorPosition] = useState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMess, setLoadingMess] = useState(false);
    const [unseen, setUnseen] = useState(false);
    const [chatMenu, setChatMenu] = useState(false);
    const [themes, setThemes] = useState(false);
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
    console.log(showChatRoom);
    const handleImage = (e) => {
        let file = e.target.files[0];
        if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/webp" && file.type !== "image/gif") {
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
        getAllMessagesLoading(showChatRoom._id);
        functionupdateSeenMess();
        getListMess();
    }, [showChatRoom]);
    useEffect(() => {
        socket.on("getMessage", () => {
            getAllMessages();
            getListMess();
        });
    }, [socket]);
    const getAllMessagesLoading = async () => {
        setLoadingMess(true);
        const res = await getMessagesRoom(showChatRoom._id, user.token);
        setLoadingMess(false);
        setMessages(res.mess);
        setUnseen(res.unseen);
        scrollToBottom();
    };
    const getAllMessages = async () => {
        const res = await getMessagesRoom(showChatRoom._id, user.token);
        setMessages(res.mess);
        setUnseen(res.unseen);
        scrollToBottom();
    };

    const functionupdateSeenMess = async () => {
        await updateSeenMessInGroup(showChatRoom._id, user.token);
    };

    const functiondeleteRoomMess = async () => {
        await deleteRoomMess(showChatRoom._id, user.token);
        closeChatWindow(stt);
        getRoomMess();
    };
    const notification = async (id) => {
        socket.emit("sendMessage", {
            senderId: user.id,
            receiverId: id,
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

                const messages = await sendMessageRoom(showChatRoom._id, text, imgComment[0].url, user.token);
                setMessages(messages.newMessages);
                for (const receiverId of showChatRoom?.groupRef.members) {
                    notification(receiverId.user);
                }

                setLoading(false);
                setText("");
                setMessageImage("");
            } else {
                setLoading(true);
                const messages = await sendMessageRoom(showChatRoom._id, text, "", user.token);
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
        const messages = await sendMessageRoom(showChatRoom._id, showChatRoom?.icon, "", user.token);
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
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    admin = showChatRoom?.groupRef?.members.some((member) => member.user.toString() === user.id && member.type === "admin");

    if (stt === 1) {
        chatWindowStyle = { right: "425px" };
    } else if (stt === 2) {
        chatWindowStyle = { right: "770px" };
    }
    if (stt === 0) {
        chatWindowStyleMenu = {
            bottom: admin ? "220px" : "266px",
            right: "421px",
            zIndex: "9999999",
            border: "1px solid #ccc",
            position: "fixed",
        };
    } else if (stt === 1) {
        chatWindowStyleMenu = {
            bottom: admin ? "220px" : "266px",
            right: "766px",
            zIndex: "9999999",
            border: "1px solid #ccc",
            position: "fixed",
        };
    } else if (stt === 2) {
        chatWindowStyleMenu = {
            bottom: admin ? "220px" : "266px",
            right: "1111px",
            zIndex: "9999999",
            border: "1px solid #ccc",
            position: "fixed",
        };
    }
    return (
        <>
            {chatMenu && (
                <div className="open_cover_menu" ref={menu1} style={chatWindowStyleMenu}>
                    <Link className="open_cover_menu_item hover1" to={`/group/${showChatRoom?.groupRef?._id}`} onClick={() => setChatMenu(false)}>
                        <i className="group_mess"></i>

                        <p>View group</p>
                    </Link>
                    <Link
                        className="open_cover_menu_item hover1"
                        to={`/messages/${showChatRoom?._id}`}
                        onClick={() => {
                            setOpenChatWindowMess({
                                _id: showChatRoom?._id,
                                room_name: showChatRoom?.room_name,
                                group_name: showChatRoom?.groupRef?.group_name,
                                groupRef: showChatRoom?.groupRef,
                                color: showChatRoom?.color,
                                icon: showChatRoom?.icon,
                                roomId: showChatRoom?._id,
                                media: showChatRoom?.media,
                            });
                            closeChatWindow(stt);
                        }}>
                        <i className="mess_icon"></i>
                        <p>Open in Messenger</p>
                    </Link>
                    <div className="mmenu_splitter"></div>

                    <div className="mmenu_item hover3" style={{ cursor: "pointer" }} onClick={() => setThemes(true)}>
                        <div style={{ marginRight: "10px" }}>
                            <Circle color={showChatRoom?.color} />
                        </div>

                        <p style={{ fontSize: "15px", fontWeight: "500" }}>Change theme</p>
                    </div>
                    {themes && (
                        <CustomColor
                            setThemes={setThemes}
                            openChatWindowMess={{
                                color: showChatRoom?.color,
                                icon: showChatRoom?.icon,
                                roomId: showChatRoom?._id,
                                media: showChatRoom?.media,
                            }}
                            token={user.token}
                            getListMess={getListMess}
                            getRoomMess={getRoomMess}
                        />
                    )}
                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            setPicker((prev) => !prev);
                        }}
                        style={{ cursor: "pointer" }}>
                        <div style={{ marginRight: "10px" }}>{showChatRoom?.icon}</div>

                        <p style={{ fontSize: "15px", fontWeight: "500" }}>Change emoji</p>
                    </div>
                    {picker && (
                        <CustomEmoji
                            setPicker={setPicker}
                            openChatWindowMess={{
                                color: showChatRoom?.color,
                                icon: showChatRoom?.icon,
                                roomId: showChatRoom?._id,
                                media: showChatRoom?.media,
                            }}
                            token={user.token}
                            getListMess={getListMess}
                            getRoomMess={getRoomMess}
                        />
                    )}
                    {admin && (
                        <>
                            {" "}
                            <div className="mmenu_splitter"></div>
                            <div
                                className="mmenu_item hover3"
                                onClick={() => {
                                    functiondeleteRoomMess();
                                }}
                                style={{ cursor: "pointer" }}>
                                <i className="trash_icon" style={{ marginRight: "10px" }}></i>

                                <p style={{ fontSize: "15px", fontWeight: "500" }}>Delete chat</p>
                            </div>
                        </>
                    )}
                </div>
            )}
            <div
                className="chat-window"
                style={chatWindowStyle}
                onClick={() => {
                    functionupdateSeenMess();
                    getListMess();
                    setUnseen(false);
                }}>
                <div className="box_header_user_mess" style={unseen ? { background: showChatRoom.color } : {}}>
                    <div
                        className={unseen ? "hover7" : "hover9"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => setChatMenu(true)}>
                        <div className="contact_img">
                            {showChatRoom?.groupRef?.members?.map((member) => {
                                const isUserOnline = onlineUsers.some((userOnline) => userOnline.userId === member?.user && userOnline.userId !== user.id && member?.user !== user.id);

                                return isUserOnline ? <div key={member.user} className="state_active_user_mess" /> : null;
                            })}
                            <img src="../../../../images/chat.png" alt="" />
                        </div>

                        <div className="contact" style={{ display: "flow", flexDirection: "column" }}>
                            <span style={unseen ? { color: "#fff" } : { color: "var(--color-primary)" }}>{showChatRoom?.room_name}</span>
                            <p
                                style={
                                    unseen
                                        ? {
                                              color: "#fff",
                                              fontSize: "13px",

                                              fontWeight: "400",
                                          }
                                        : {
                                              fontSize: "13px",
                                              color: "#65676B",
                                              fontWeight: "400",
                                          }
                                }>
                                {showChatRoom?.groupRef?.group_name}
                            </p>
                        </div>
                    </div>
                    <div
                        className="small_circle_mess"
                        onClick={() => {
                            closeChatWindow(stt);
                        }}>
                        {unseen ? <Exit color="#FFF" /> : <Exit color={showChatRoom.color} />}
                    </div>
                </div>

                <div className="messages scrollbar" ref={chatContainerRef}>
                    <div
                        style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "30px",
                        }}>
                        <div className="contact_chat">
                            {showChatRoom?.groupRef?.members?.map((member) => {
                                const isUserOnline = onlineUsers.some((userOnline) => userOnline.userId === member?.user && userOnline.userId !== user.id && member?.user !== user.id);

                                return isUserOnline ? (
                                    <div
                                        className="state_active_user_mess"
                                        style={{
                                            left: "178px",
                                            bottom: "5px",
                                            width: "14px",
                                            height: "14px",
                                        }}
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
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "var(--color-primary)",
                        }}>
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
                        }}>
                        <p>Zuino </p>
                        <p>Your group chat on Zuino</p>
                    </div>
                    {!loadingMess ? (
                        <>
                            {" "}
                            {messages &&
                                messages
                                    .sort((a, b) => {
                                        return new Date(a.messageAt) - new Date(b.messageAt);
                                    })
                                    .map((message, i) => <MessRoom message={message} user={user} key={i} showChatRoom={showChatRoom} socket={socket} />)}
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
                                <input type="file" hidden ref={imgInput} accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImage} />
                                {error && (
                                    <div className="postError comment_error">
                                        <div className="postError_error">{error}</div>
                                        <button className="blue_btn" onClick={() => setError("")}>
                                            Try again
                                        </button>
                                    </div>
                                )}
                                <input type="text" ref={textRef} value={text} placeholder="Aa" onChange={(e) => setText(e.target.value)} onKeyUp={handleMessage} />
                                <div className="comment_circle" style={{ marginTop: "5px" }}>
                                    <ClipLoader size={20} color="#1876f2" loading={loading} />
                                </div>
                                <div
                                    className="comment_circle_icon hover2"
                                    onClick={() => {
                                        setPicker((prev) => !prev);
                                    }}>
                                    <i className="emoji_icon"></i>
                                </div>
                                <div className="comment_circle_icon hover2" onClick={() => imgInput.current.click()}>
                                    <i className="camera_icon"></i>
                                </div>
                            </div>
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    handleIcon();
                                }}>
                                {showChatRoom?.icon}
                            </div>
                        </div>
                        {messageImage && (
                            <div className="comment_img_preview">
                                <img src={messageImage} alt="" />
                                <div className="small_white_circle" onClick={() => setMessageImage("")}>
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
