import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ArrowDown1 } from "../../svg";
import Header from "../../components/header";
import { HashLoader } from "react-spinners";
import Picker from "emoji-picker-react";
import { uploadImages } from "../../functions/uploadImages";
import DeatilMess from "../../svg/deatilMess";
import { Search } from "../../svg";
import Circle from "../../svg/circle";
import Media from "../../svg/media";
import SearchMessMenu from "./SearchMessMenu";
import { ClipLoader } from "react-spinners";
import Room_Mess_screen_Large from "./Room_Mess_screen_Large";
import Chat_screen_Large from "./Chat_screen_Large";
import CustomColor from "./CustomColor";
import "./style.css";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import CustomEmoji from "./CustomEmoji";
import { deleteRoomMess } from "../../functions/roommess";
export default function Messages({
  getAllPosts,
  socket,
  notifications,
  setNotifi,
  listMess,
  loadingListMess,
  onlineUsers,
  getListMess,
  setOpenChatWindowMess,
  openChatWindowMess,
  getRoomMess,
  setVisiblePhotoDetail,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [picker, setPicker] = useState(false);
  const [detail, setDetail] = useState(false);
  const imgInput = useRef(null);
  const [text, setText] = useState("");
  const textRef = useRef(null);
  const [error, setError] = useState("");
  const [messageImage, setMessageImage] = useState("");
  const { roomid } = useParams();
  const [loading, setLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const [messages, setMessages] = useState([]);
  const [unseen, setUnseen] = useState(false);
  const [showMessMenu, setShowMessMenu] = useState(false);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [loadingMess, setLoadingMess] = useState(false);
  const chatContainerRef = useRef(null);
  const [chatInfo, setChatInfo] = useState(false);
  const [media, setMedia] = useState(false);
  const [custom, setCustom] = useState(false);
  const [mediaDetail, setMediaDetail] = useState(null);
  const [themes, setThemes] = useState(false);
  useEffect(() => {
    setMediaDetail(null);
  }, [openChatWindowMess]);
  const functiondeleteRoomMess = async () => {
    await deleteRoomMess(openChatWindowMess._id, user.token);
    getListMess();
    window.location.replace("/messages");
  };
  let admin = false;
  admin = openChatWindowMess?.groupRef?.members.some(
    (member) => member.user.toString() === user.id && member.type === "admin"
  );
  return (
    <>
      <Header
        page="messages"
        getAllPosts={getAllPosts}
        socket={socket}
        notifications={notifications}
        setNotifi={setNotifi}
        setShowChat={setOpenChatWindowMess}
        listMess={listMess}
        loadingListMess={loadingListMess}
        onlineUsers={onlineUsers}
        getListMess={getListMess}
      />
      <div className="friends">
        <div
          className="friends_left"
          style={{ borderRight: "1px solid rgb(204, 204, 204)" }}
        >
          <div className="friends_left_header">
            <h2>Chats</h2>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
          </div>
          <div className="friends_left_wrap">
            <div style={{ display: "flex" }}>
              <div className="header_left">
                <div
                  className="search search1"
                  style={{ width: "316px" }}
                  onClick={() => {
                    setShowSearchMenu(true);
                  }}
                >
                  <Search color="#65676b" />
                  <input
                    type="text"
                    placeholder="Search Facebook"
                    className="hide_input"
                  />
                </div>
              </div>
              {showSearchMenu && (
                <SearchMessMenu
                  color="#65676b"
                  setShowSearchMenu={setShowSearchMenu}
                  token={user.token}
                  listMess={listMess}
                  setOpenChatWindowMess={setOpenChatWindowMess}
                  onlineUsers={onlineUsers}
                />
              )}
            </div>

            {listMess?.rooms ? (
              listMess?.rooms?.map((mess, i) => (
                <>
                  {mess?.group ? (
                    <>
                      <Link
                        onClick={() => {
                          setOpenChatWindowMess({
                            _id: mess?.roomId,
                            room_name: mess?.room_name,
                            group_name: mess?.fndInfo?.group_name,
                            groupRef: mess?.fndInfo,
                            icon: mess?.icon,
                            color: mess?.color,
                            media: mess?.media,
                            roomId: mess?.roomId,
                          });
                        }}
                        to={`/messages/${mess?.roomId}`}
                        className="mmenu_item hover3"
                        style={
                          mess?.roomId === openChatWindowMess?._id
                            ? { background: "#e7f3ff" }
                            : { cursor: "pointer" }
                        }
                        key={i}
                      >
                        <div className="profile_link">
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              display: "flex",
                              flexDirection: "row-reverse",
                              left: "0",
                            }}
                          >
                            <img
                              style={{
                                position: "absolute",
                                borderRadius: "10%",
                                objectFit: "cover",
                                width: "37px",
                                height: "37px",
                                left: "28px",
                              }}
                              src={mess?.fndInfo?.cover}
                              alt=""
                            />
                            <div
                              className="circle_icon_notification"
                              style={{
                                position: "absolute",
                                bottom: "6px",
                                left: "0px",
                              }}
                            >
                              <img
                                style={{
                                  width: "37px",
                                  height: "37px",
                                  backgroundColor: "#C8C9D4",
                                  border: "2.5px solid #fff",
                                }}
                                src="../../../../images/chat.png"
                                alt=""
                              />
                            </div>
                          </div>

                          <div>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#65676B",
                                fontWeight: "400",
                              }}
                            >
                              {mess?.fndInfo?.group_name}
                            </p>
                            <div
                              className="user_name"
                              style={{
                                marginLeft: "0px",
                                fontSize: "15px",
                              }}
                            >
                              {mess?.room_name}
                            </div>
                            <p
                              style={
                                !mess?.msgInfo?.seen.includes(user.id) &&
                                mess?.msgInfo?.senderId !== user.id
                                  ? {
                                      fontSize: "13px",
                                      color: "#050505",
                                      fontWeight: "600",
                                    }
                                  : {
                                      fontSize: "13px",
                                      color: "#65676B",
                                      fontWeight: "400",
                                    }
                              }
                            >
                              {mess?.msgInfo?.senderId === user.id && "You: "}
                              {!mess?.msgInfo?.image
                                ? mess?.msgInfo?.message
                                : mess?.msgInfo?.senderId === user.id
                                ? "You sent a photo"
                                : "Someone sent a photo"}
                            </p>
                          </div>

                          {!mess?.msgInfo?.seen.includes(user.id) &&
                            mess?.msgInfo?.senderId !== user.id && (
                              <div
                                className="notification_icon_active "
                                style={{
                                  width: "10px",
                                  right: "2px",
                                  position: "absolute",
                                }}
                              />
                            )}
                        </div>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/messages/${mess?.fndInfo?._id}`}
                        className="mmenu_item hover3"
                        onClick={() => {
                          setOpenChatWindowMess({
                            _id: mess?.fndInfo?._id,
                            picture: mess?.fndInfo?.picture,
                            first_name: mess?.fndInfo?.first_name,
                            last_name: mess?.fndInfo?.last_name,
                            icon: mess?.icon,
                            color: mess?.color,
                            media: mess?.media,
                            roomId: mess?.roomId,
                          });
                        }}
                        style={
                          mess?.fndInfo?._id === openChatWindowMess?._id
                            ? { background: "#e7f3ff" }
                            : { cursor: "pointer" }
                        }
                        key={i}
                      >
                        <div className="profile_link">
                          <div className="circle_icon_notification">
                            <img
                              src={mess?.fndInfo?.picture}
                              alt=""
                              style={{ width: "56px", height: "56px" }}
                            />
                            <div className="right_bottom_notification">
                              {onlineUsers.some(
                                (user) => user.userId === mess?.fndInfo?._id
                              ) && (
                                <div
                                  className="state_active_user_mess"
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    left: "-18px",
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          <div>
                            <div
                              className="user_name"
                              style={{
                                marginLeft: "0px",
                                fontSize: "15px",
                              }}
                            >
                              {mess?.fndInfo?.first_name}{" "}
                              {mess?.fndInfo?.last_name}
                            </div>
                            <p
                              style={
                                mess?.msgInfo?.status === "unseen" &&
                                mess?.msgInfo?.senderId !== user.id
                                  ? {
                                      fontSize: "13px",
                                      color: "#050505",
                                      fontWeight: "600",
                                    }
                                  : {
                                      fontSize: "13px",
                                      color: "#65676B",
                                      fontWeight: "400",
                                    }
                              }
                            >
                              {mess?.msgInfo?.senderId === user.id && "You: "}
                              {!mess?.msgInfo?.image
                                ? mess?.msgInfo?.message
                                : mess?.msgInfo?.senderId === user.id
                                ? "You sent a photo"
                                : `${mess?.fndInfo?.last_name} sent a photo`}
                            </p>
                          </div>
                          {mess?.msgInfo?.status === "unseen" &&
                            mess?.msgInfo?.senderId !== user.id && (
                              <div
                                className="notification_icon_active "
                                style={{
                                  width: "10px",
                                  right: "7px",
                                  position: "absolute",
                                }}
                              />
                            )}
                        </div>
                      </Link>
                    </>
                  )}
                </>
              ))
            ) : (
              <div className="mmenu_item  imgNotification">
                <img src="../../../../images/notification.png" alt="" />
              </div>
            )}
          </div>
        </div>
        <div
          className="friends_right"
          style={{
            background: "var(--bg-primary)",
            height: "500px",
            padding: "0px",
            display: "flex",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {openChatWindowMess ? (
            <>
              {" "}
              {openChatWindowMess?.room_name ? (
                <Room_Mess_screen_Large
                  showChatRoom={openChatWindowMess}
                  socket={socket}
                  onlineUsers={onlineUsers}
                  getListMess={getListMess}
                  detail={detail}
                  setDetail={setDetail}
                  roomid={roomid}
                  idroom={openChatWindowMess?._id}
                  setVisiblePhotoDetail={setVisiblePhotoDetail}
                />
              ) : (
                <Chat_screen_Large
                  showChat={openChatWindowMess}
                  socket={socket}
                  onlineUsers={onlineUsers}
                  getListMess={getListMess}
                  detail={detail}
                  setDetail={setDetail}
                  setVisiblePhotoDetail={setVisiblePhotoDetail}
                />
              )}
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "1400px",
                }}
              >
                <i className="choose_mess"></i>
                <p
                  style={{
                    fontSize: "1.25rem",
                    color: "var(--color-primary)",
                    fontWeight: "700",
                  }}
                >
                  No chats selected
                </p>
              </div>
            </>
          )}
        </div>

        {detail && (
          <div
            className="deatil"
            style={{ borderLeft: "1px solid rgb(204, 204, 204)", right: "0" }}
          >
            {!mediaDetail ? (
              <>
                {" "}
                {!openChatWindowMess?.room_name ? (
                  <>
                    {" "}
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "30px",
                      }}
                    >
                      <div className="contact_chat">
                        {onlineUsers.some(
                          (user) => user.userId === openChatWindowMess?._id
                        ) && (
                          <div
                            className="state_active_user_mess"
                            style={{
                              left: "182px",
                              bottom: "5px",
                              width: "14px",
                              height: "14px",
                            }}
                          />
                        )}

                        <img
                          style={{ width: "80px", height: "80px" }}
                          src={openChatWindowMess?.picture}
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className="user_name"
                      style={{
                        marginLeft: "0px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px",
                        fontSize: "17px",
                      }}
                    >
                      {openChatWindowMess?.first_name}{" "}
                      {openChatWindowMess?.last_name}
                    </div>
                    <div
                      className="mmenu_item "
                      style={{
                        flexDirection: "column",
                        cursor: "auto",
                        cursor: "pointer",
                      }}
                    >
                      <Link
                        className="small_circle hover10 "
                        style={{ marginRight: "0px" }}
                        to={`/profile/${openChatWindowMess?._id}`}
                      >
                        <img
                          src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/8oi-S_aLzRO.png"
                          style={{ width: "18px" }}
                        />
                      </Link>
                      <p>Profile</p>
                    </div>
                    <div
                      className="mmenu_item hover3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setCustom((prev) => !prev)}
                    >
                      <span>Customize chat</span>
                      <div style={{ right: "0", position: "absolute" }}>
                        <ArrowDown1 />
                      </div>
                    </div>
                    {custom && (
                      <>
                        {" "}
                        <div
                          className="mmenu_item hover3"
                          style={{ cursor: "pointer" }}
                          onClick={() => setThemes(true)}
                        >
                          <div style={{ marginRight: "10px" }}>
                            <Circle color={openChatWindowMess.color} />
                          </div>

                          <p style={{ fontSize: "15px", fontWeight: "500" }}>
                            Change theme
                          </p>
                        </div>
                        {themes && (
                          <CustomColor
                            setThemes={setThemes}
                            openChatWindowMess={openChatWindowMess}
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
                          style={{ cursor: "pointer" }}
                        >
                          <div style={{ marginRight: "10px" }}>
                            {openChatWindowMess?.icon}
                          </div>

                          <p style={{ fontSize: "15px", fontWeight: "500" }}>
                            Change emoji
                          </p>
                        </div>
                        {picker && (
                          <CustomEmoji
                            setPicker={setPicker}
                            openChatWindowMess={openChatWindowMess}
                            token={user.token}
                            getListMess={getListMess}
                            getRoomMess={getRoomMess}
                          />
                        )}
                      </>
                    )}
                    <div
                      className="mmenu_item hover3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setMedia((prev) => !prev)}
                    >
                      <span>Media</span>
                      <div style={{ right: "0", position: "absolute" }}>
                        <ArrowDown1 />
                      </div>
                    </div>
                    {media && (
                      <div
                        className="mmenu_item hover3"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setMediaDetail(openChatWindowMess?.media)
                        }
                      >
                        <div style={{ marginRight: "10px" }}>
                          <Media />
                        </div>

                        <p style={{ fontSize: "15px", fontWeight: "500" }}>
                          Media
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {" "}
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "30px",
                      }}
                    >
                      <div className="contact_chat">
                        {onlineUsers.some(
                          (user) => user.userId === openChatWindowMess?._id
                        ) && (
                          <div
                            className="state_active_user_mess"
                            style={{
                              left: "670px",
                              bottom: "5px",
                              width: "14px",
                              height: "14px",
                            }}
                          />
                        )}

                        <img
                          style={{ width: "80px", height: "80px" }}
                          src="../../../../images/chat.png"
                          alt=""
                        />
                      </div>
                    </div>
                    <div
                      className="user_name"
                      style={{
                        marginLeft: "0px",
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "30px",
                        fontSize: "17px",
                      }}
                    >
                      {openChatWindowMess?.room_name}
                    </div>
                    <div
                      className="mmenu_item hover3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setChatInfo((prev) => !prev)}
                    >
                      <span>Chat info</span>
                      <div style={{ right: "0", position: "absolute" }}>
                        <ArrowDown1 />
                      </div>
                    </div>
                    {chatInfo && (
                      <>
                        <Link
                          to={`/group/${openChatWindowMess?.groupRef._id}`}
                          className="mmenu_item hover3"
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="group_mess"
                            style={{ marginRight: "10px" }}
                          ></i>
                          <p style={{ fontSize: "15px", fontWeight: "500" }}>
                            Go to {openChatWindowMess?.groupRef.group_name}
                          </p>
                        </Link>
                        {admin && (
                          <>
                            <div
                              className="mmenu_item hover3"
                              onClick={() => {
                                functiondeleteRoomMess();
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className="trash_icon"
                                style={{ marginRight: "10px" }}
                              ></i>

                              <p
                                style={{ fontSize: "15px", fontWeight: "500" }}
                              >
                                Delete chat
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    <div
                      className="mmenu_item hover3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setCustom((prev) => !prev)}
                    >
                      <span>Customize chat</span>
                      <div style={{ right: "0", position: "absolute" }}>
                        <ArrowDown1 />
                      </div>
                    </div>
                    {custom && (
                      <>
                        {" "}
                        <div
                          className="mmenu_item hover3"
                          style={{ cursor: "pointer" }}
                          onClick={() => setThemes(true)}
                        >
                          <div style={{ marginRight: "10px" }}>
                            <Circle color={openChatWindowMess.color} />
                          </div>

                          <p style={{ fontSize: "15px", fontWeight: "500" }}>
                            Change theme
                          </p>
                        </div>
                        {themes && (
                          <CustomColor
                            page="messages"
                            setThemes={setThemes}
                            openChatWindowMess={openChatWindowMess}
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
                          style={{ cursor: "pointer" }}
                        >
                          <div style={{ marginRight: "10px" }}>
                            {openChatWindowMess?.icon}
                          </div>

                          <p style={{ fontSize: "15px", fontWeight: "500" }}>
                            Change emoji
                          </p>
                        </div>
                        {picker && (
                          <CustomEmoji
                            setPicker={setPicker}
                            openChatWindowMess={openChatWindowMess}
                            token={user.token}
                            getListMess={getListMess}
                            getRoomMess={getRoomMess}
                          />
                        )}
                      </>
                    )}
                    <div
                      className="mmenu_item hover3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setMedia((prev) => !prev)}
                    >
                      <span>Media</span>
                      <div style={{ right: "0", position: "absolute" }}>
                        <ArrowDown1 />
                      </div>
                    </div>
                    {media && (
                      <div
                        className="mmenu_item hover3"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setMediaDetail(openChatWindowMess?.media)
                        }
                      >
                        <div style={{ marginRight: "10px" }}>
                          <Media />
                        </div>

                        <p style={{ fontSize: "15px", fontWeight: "500" }}>
                          Media
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="box_header">
                  <div
                    className="small_circle hover1"
                    style={{
                      left: "0",
                      display: "flex",
                      position: "absolute",
                    }}
                    onClick={() => {
                      setMediaDetail(null);
                    }}
                  >
                    <i className="arrow_back_icon"></i>
                  </div>
                </div>
                <div
                  className="scrollbar"
                  style={{
                    overflowX: "hidden",
                    overflowY: "scroll",
                    height: "745px",
                  }}
                >
                  <div
                    className="profile_card_grid "
                    style={{
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    {mediaDetail.length > 0 ? (
                      mediaDetail.map((img, index) => (
                        <div
                          className="profile_photo_card"
                          key={index}
                          onClick={() => setVisiblePhotoDetail(img)}
                        >
                          <img
                            style={{ width: "150px", height: "150px" }}
                            src={img}
                            alt=""
                          />
                        </div>
                      ))
                    ) : (
                      <>
                        <div
                          style={{
                            width: "346px",
                            height: "640px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "17px",
                              fontWeight: "400",
                              color: "#65676B",
                            }}
                          >
                            No media{" "}
                          </p>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "400",
                              color: "#65676B",
                            }}
                          >
                            {" "}
                            Photos that you exchange will appear here.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
