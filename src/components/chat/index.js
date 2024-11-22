import { useEffect, useRef, useState, useReducer } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { ClipLoader } from "react-spinners";
import Circle from "../../svg/circle";
import CustomColor from "../../pages/messages/CustomColor";
import CustomEmoji from "../../pages/messages/CustomEmoji";
import { HashLoader } from "react-spinners";
import { getMessages, sendMessage, updateSeenMess } from "../../functions/messenger";
import { customRoom } from "../../functions/roommess";
import { uploadImages } from "../../functions/uploadImages";
import Mess from "./Mess";
import ViewProfile from "../../svg/viewProfile";
import useClickOutside from "../../helpers/clickOutside";
import Exit from "../../svg/exit";
import Call from "../../svg/call";
export default function Chat_screen({ setShowChat, showChat, socket, onlineUsers, getListMess, stt, closeChatWindow, setOpenChatWindowMess, openChatWindowMess }) {
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
    const [custom, setCustom] = useState();
    const [loadingMess, setLoadingMess] = useState(false);
    const [mediaDetail, setMediaDetail] = useState(null);
    const [themes, setThemes] = useState(false);
    let chatWindowStyle;
    let chatWindowStyleMenu;
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
    useEffect(() => {
        getAllMessagesLoading(showChat._id);
        functionupdateSeenMess();
        getListMess();
        getcustomRoom();
    }, [showChat]);
    useEffect(() => {
        socket.on("getMessage", (data) => {
            if (data.senderId === showChat._id) {
                getAllMessages(showChat._id);
                getListMess();
            }
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

    const getcustomRoom = async () => {
        const res = await customRoom(showChat._id, user.token);
        setCustom(res);
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

                const messages = await sendMessage(showChat._id, text, imgComment[0].url, user.token);

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
        const messages = await sendMessage(showChat?._id, custom?.icon, "", user.token);
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
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    if (stt === 1) {
        chatWindowStyle = { right: "425px" };
    } else if (stt === 2) {
        chatWindowStyle = { right: "770px" };
    }

    if (stt === 0) {
        chatWindowStyleMenu = {
            bottom: "266px",
            right: "421px",
            zIndex: "9999999",
            border: "1px solid #ccc",
            position: "fixed",
        };
    } else if (stt === 1) {
        chatWindowStyleMenu = {
            bottom: "266px",
            right: "766px",
            zIndex: "9999999",
            border: "1px solid #ccc",
            position: "fixed",
        };
    } else if (stt === 2) {
        chatWindowStyleMenu = {
            bottom: "266px",
            right: "1111px",
            zIndex: "9999999",
            border: "1px solid #ccc",
            position: "fixed",
        };
    }

    const handleOpenCallUser = () => {
        socket.emit("call", { caller: user.id, receiver: showChat._id });
        window.open(`http://localhost:3000/groupcall?callee=${showChat._id}`, "popupWindow", "width=1200,height=700");
    };
    return (
        <>
            {chatMenu && (
                <div className="open_cover_menu" ref={menu1} style={chatWindowStyleMenu}>
                    <Link className="open_cover_menu_item hover1" to={`/profile/${showChat?._id}`} onClick={() => setChatMenu(false)}>
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/8oi-S_aLzRO.png" style={{ width: "18px", marginRight: "3px" }} />

                        <p>View profile</p>
                    </Link>
                    <Link
                        className="open_cover_menu_item hover1"
                        to={`/messages/${showChat?._id}`}
                        onClick={() => {
                            setOpenChatWindowMess({
                                _id: showChat?._id,
                                picture: showChat?.picture,
                                first_name: showChat?.first_name,
                                last_name: showChat?.last_name,
                                icon: custom?.icon,
                                color: custom?.color,
                                media: custom?.media,
                                roomId: custom?.roomId,
                            });
                            closeChatWindow(stt);
                        }}>
                        <i className="mess_icon"></i>
                        <p>Open in Messenger</p>
                    </Link>
                    <div className="mmenu_splitter"></div>

                    <div className="mmenu_item hover3" style={{ cursor: "pointer" }} onClick={() => setThemes(true)}>
                        <div style={{ marginRight: "10px" }}>
                            <Circle color={custom?.color} />
                        </div>

                        <p style={{ fontSize: "15px", fontWeight: "500" }}>Change theme</p>
                    </div>
                    {themes && (
                        <CustomColor
                            setThemes={setThemes}
                            openChatWindowMess={{
                                icon: custom?.icon,
                                color: custom?.color,
                                media: custom?.media,
                                roomId: custom?.roomId,
                            }}
                            token={user.token}
                            getListMess={getListMess}
                        />
                    )}
                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            setPicker((prev) => !prev);
                        }}
                        style={{ cursor: "pointer" }}>
                        <div style={{ marginRight: "10px" }}>{custom?.icon}</div>

                        <p style={{ fontSize: "15px", fontWeight: "500" }}>Change emoji</p>
                    </div>
                    {picker && (
                        <CustomEmoji
                            setPicker={setPicker}
                            openChatWindowMess={{
                                icon: custom?.icon,
                                color: custom?.color,
                                media: custom?.media,
                                roomId: custom?.roomId,
                            }}
                            token={user.token}
                            getListMess={getListMess}
                        />
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
                <div className="box_header_user_mess" style={unseen ? { background: custom?.color } : {}}>
                    <div
                        className={unseen ? "hover7" : "hover9"}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => setChatMenu(true)}>
                        <div className="contact_img" style={{ paddingLeft: "5px", display: "flex" }}>
                            {onlineUsers.some((user) => user.userId === showChat?._id) && <div className="state_active_user_mess" style={{ left: "35px" }} />}

                            <img src={showChat?.picture} alt="" />
                        </div>

                        <div className="user_name" style={unseen ? { color: "#fff", paddingRight: "5px", display: "flex" } : { color: "var(--color-primary)", paddingRight: "5px", display: "flex" }}>
                            {showChat?.first_name} {showChat?.last_name}
                        </div>
                    </div>
                    <div className="box_chat_header">
                        <div className="" onClick={() => handleOpenCallUser()}>
                            <Call color={custom?.color} />
                        </div>
                        <div
                            className="small_circle_mess"
                            onClick={() => {
                                closeChatWindow(stt);
                            }}>
                            {unseen ? <Exit color="#FFF" /> : <Exit color={custom?.color} />}
                        </div>
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
                            {onlineUsers.some((user) => user.userId === showChat?._id) && (
                                <div
                                    className="state_active_user_mess"
                                    style={{
                                        left: "178px",
                                        bottom: "5px",
                                        width: "14px",
                                        height: "14px",
                                    }}
                                />
                            )}

                            <img src={showChat?.picture} alt="" />
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
                        }}>
                        <p>Facebook </p>
                        <p>You're friends on Facebook</p>
                    </div>

                    {!loadingMess && custom ? (
                        <>
                            {messages &&
                                messages
                                    .sort((a, b) => {
                                        return new Date(a.messageAt) - new Date(b.messageAt);
                                    })
                                    .map((message, i) => <Mess message={message} user={user} key={i} showChat={showChat} socket={socket} custom={custom} />)}
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
                                {custom?.icon}
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
