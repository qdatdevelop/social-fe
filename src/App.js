import { Link, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import NotFoundPage from "./pages/notFoundPage/NotFoundPage";
import { useSelector } from "react-redux";
import Activate from "./pages/home/activate";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import {
  postsReducer,
  notificationsReducer,
  listMessReducer,
  listPostSavedReducer,
} from "./functions/reducers";
import Friends from "./pages/friends";
import io from "socket.io-client";
import Post from "./components/post";
import { notification } from "antd";
import Search from "./pages/search";
import Post_detail from "./components/post/Post_detail";
import ReactPopup from "./components/reactPopup";
import ReactCommentPopup from "./components/reactPopup/reactCommentPopup";
import Moment from "react-moment";
import { setRead } from "./functions/notification";
import { friendspage } from "./functions/reducers";
import { getFriendsPageInfos } from "./functions/user";
import PageGroup from "./pages/groups/PageGroup";
import Groups from "./pages/groups";
import { getGroupsJoined } from "./functions/user";
import { getdiscoverGroups } from "./functions/user";
import { roommess } from "./functions/reducers";
import Room_Mess_screen from "./components/chat/RoomMess";
import ReportMenu from "./components/reportMenu";
import ReportGroupMenu from "./components/reportMenu/reportGroupMenu";
import Messages from "./pages/messages";
import { getUser } from "./functions/user";
import PhotoDetail from "./components/photoDetail";
import ReportMenu_Profile from "./components/reportMenu/reportProfile";
import Verifi from "./pages/verify";
import {
  friendspageByBirthday,
  groupspage,
  groupdiscoverspage,
  postgroups,
} from "./functions/reducers";
import { getFriendsByBirthday } from "./functions/user";
import PhotoPopup from "./components/photoPopup";
import Chat_screen from "./components/chat";
import Saved from "./pages/saved";
import VerifiRegister from "./pages/verify/VerifiRegister";
function App() {
  const [visible, setVisible] = useState(false);
  const [visiblePost, setVisiblePost] = useState(null);
  const [visiblePhoto, setVisiblePhoto] = useState(null);
  const [visibleReact, setVisibleReact] = useState(null);
  const [visibleReactComment, setVisibleReactComment] = useState(null);
  const { user, darkTheme } = useSelector((state) => ({ ...state }));
  const [api, contextHolder] = notification.useNotification();
  const [notifi, setNotifi] = useState(null);
  const [report, setReport] = useState(null);
  const [reportGroup, setReportGroup] = useState(null);

  const [report_Profile, setReport_Profile] = useState(null);

  const [reportComment, setReportComment] = useState(false);
  const [reportGroupComment, setReportGroupComment] = useState(false);
  const [mess, setMess] = useState(null);
  const [loadingAllPosts, setLoadingAllPosts] = useState(false);

  const [visiblePhotoDetail, setVisiblePhotoDetail] = useState(null);

  useEffect(() => {
    
    if (user?.id !== undefined) {
      socket?.emit("newUser", user?.id);
      getDatafriendsByBirthday();
      getAllPosts();
      getListPostSaved();
      getDataFriend();
      getGroups();
      getDiscoverGroups();
      getPostGroups();
      getRoomMess();
      getNotifications();
      getListMess();
      getUserData();
    }
  }, [user?.id]);
  const [socket, setSocket] = useState(null);
  const [User, setUser] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const getUserData = async () => {
    const res = await getUser(user.token);
    setUser(res);
  };
  const handleLinkClick = (link) => {
    // Reload the current page
    window.location.replace(link);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
   
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const [openChatWindows, setOpenChatWindows] = useState([]);
  const [openChatWindowMess, setOpenChatWindowMess] = useState(null);
  const openChatWindow = (room) => {
    const existingWindowIndex = openChatWindows.findIndex(
      (window) => window._id === room._id
    );

    if (existingWindowIndex !== -1) {
      setOpenChatWindows([
        ...openChatWindows.slice(0, existingWindowIndex),
        ...openChatWindows.slice(existingWindowIndex + 1),
        room,
      ]);
      closeChatWindow(existingWindowIndex);
    } else {
      if (openChatWindows.length === 3) {
        closeChatWindow(0);
        setOpenChatWindows([...openChatWindows.slice(1), room]);
      } else {
        setOpenChatWindows([...openChatWindows, room]);
      }
    }
  };

  const closeChatWindow = (index) => {
    const updatedWindows = [...openChatWindows];
    updatedWindows.splice(index, 1);
    setOpenChatWindows(updatedWindows);
  };

  //add online users

  useEffect(() => {
    if (socket === null) return;
    socket.emit("newUser", user?.id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  const [photoDetail, setPhotoDetail] = useState("");
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });

  const reacts = ["Like", "Love", "Angry", "Haha", "Sad", "Wow"];

  const [
    { loadingNotification, errorNotification, notifications },
    dispatchNotification,
  ] = useReducer(notificationsReducer, {
    loading: false,
    notifications: [],
    error: "",
  });

  const [
    { loading: loadingListMess, errorListMes, listMess },
    dispatchListMes,
  ] = useReducer(listMessReducer, {
    loading: false,
    listMess: [],
    error: "",
  });

  const getNotifications = async () => {
    try {
      dispatchNotification({
        type: "NOTIFICATIONS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllNotification`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatchNotification({
        type: "NOTIFICATIONS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatchNotification({
        type: "NOTIFICATIONS_ERROR",
        payload: errorNotification?.response.data.message,
      });
    }
  };

  const [
    { loading: loadingListPostSaved, errorListPostSaved, listPostSaved },
    dispatchListPostSaved,
  ] = useReducer(listPostSavedReducer, {
    loading: false,
    listPostSaved: [],
    error: "",
  });

  const getListPostSaved = async () => {
    try {
      dispatchListPostSaved({
        type: "POSTSSAVED_REQUEST",
      });
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getSavedPosts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatchListPostSaved({
        type: "POSTSSAVED_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatchListPostSaved({
        type: "POSTSSAVED_ERROR",
        payload: errorListPostSaved?.response.data.message,
      });
    }
  };

  const getListMess = async () => {
    try {
      dispatchListMes({
        type: "LISTMESS_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getListRoomMess`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatchListMes({
        type: "LISTMESS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatchListMes({
        type: "LISTMESS_ERROR",
        payload: errorListMes?.response.data.message,
      });
    }
  };

  const [
    { loading: friendsLoading, error: friendsError, dataFriend },
    dispatchFriends,
  ] = useReducer(friendspage, {
    loading: false,
    dataFriend: [],
    error: "",
  });
  console.log(dataFriend);
  const [
    { loading: groupsLoading, error: groupsError, dataGroups },
    dispatchGroups,
  ] = useReducer(groupspage, {
    loading: false,
    dataGroups: [],
    error: "",
  });

  const [
    {
      loading: discoverGroupsLoading,
      error: discoverGroupsError,
      dataDiscoverGroups,
    },
    dispatchDiscoverGroups,
  ] = useReducer(groupdiscoverspage, {
    loading: false,
    dataDiscoverGroups: [],
    error: "",
  });

  const [
    { loading: postGroupsLoading, error: postGroupsError, dataPostGroups },
    dispatchPostGroups,
  ] = useReducer(postgroups, {
    loading: false,
    dataPostGroups: [],
    error: "",
  });

  const [
    { loading: roomMessLoading, error: roomMessError, dataRoomMess },
    dispatchRoomMess,
  ] = useReducer(roommess, {
    loading: false,
    dataRoomMess: [],
    error: "",
  });

  const getRoomMess = async () => {
    try {
      dispatchRoomMess({ type: "ROOM_MESS_REQUEST" });
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getRoomMess`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatchRoomMess({ type: "ROOM_MESS_SUCCESS", payload: data });
    } catch (error) {
      dispatchRoomMess({
        type: "ROOM_MESS_ERROR",
        payload: roomMessError?.response.data.message,
      });
    }
  };

  const getPostGroups = async () => {
    try {
      dispatchPostGroups({ type: "POST_GROUPS_REQUEST" });
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getpostgroups`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatchPostGroups({ type: "POST_GROUPS_SUCCESS", payload: data });
    } catch (error) {
      dispatchPostGroups({
        type: "POST_GROUPS_ERROR",
        payload: groupsError?.response.data.message,
      });
    }
  };

  const getGroups = async () => {
    dispatchGroups({ type: "GROUPS_REQUEST" });
    const data = await getGroupsJoined(user?.token);
    console.log(data);
    if (data.status === "ok") {
      dispatchGroups({ type: "GROUPS_SUCCESS", payload: data.data });
    } else {
      dispatchGroups({
        type: "GROUPS_ERROR",
        payload: groupsError.response.data.message,
      });
    }
  };

  const getDiscoverGroups = async () => {
    dispatchDiscoverGroups({ type: "DISCOVER_GROUPS_REQUEST" });
    const data = await getdiscoverGroups(user?.token);
    console.log(data);
    if (data.status === "ok") {
      dispatchDiscoverGroups({
        type: "DISCOVER_GROUPS_SUCCESS",
        payload: data.data,
      });
    } else {
      dispatchDiscoverGroups({
        type: "DISCOVER_GROUPS_ERROR",
        payload: groupsError.response.data.message,
      });
    }
  };

  const getDataFriend = async () => {
    dispatchFriends({ type: "FRIENDS_REQUEST" });
    const data = await getFriendsPageInfos(user?.id, user?.token);
    if (data.status === "ok") {
      dispatchFriends({ type: "FRIENDS_SUCCESS", payload: data.data });
    } else {
      dispatchFriends({
        type: "FRIENDS_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  const [
    {
      loading: friendsByBirthdayLoading,
      error: friendsByBirthdayError,
      dataByBirthday,
    },
    dispatchFriendsByBirthday,
  ] = useReducer(friendspageByBirthday, {
    loading: false,
    dataByBirthday: [],
    error: "",
  });

  const getDatafriendsByBirthday = async () => {
    dispatchFriendsByBirthday({ type: "FRIENDS_BY_BIRTHDAY_REQUEST" });
    const data = await getFriendsByBirthday(user?.id, user?.token);
    if (data.status === "ok") {
      dispatchFriendsByBirthday({
        type: "FRIENDS_BY_BIRTHDAY_SUCCESS",
        payload: data.data,
      });
    } else {
      dispatchFriendsByBirthday({
        type: "FRIENDS_BY_BIRTHDAY_ERROR",
        payload: data.data,
      });
    }
  };

  const setReadNotificaion = async (idNotification) => {
    try {
      await setRead(idNotification, user.token).then(setNotifi(idNotification));
    } catch (error) {
      console.error("Error while setting read:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    if (socket === null) return;
    socket.on("getNotification", (data) => {
      getDataFriend();
      if (data) {
        api.open({
          message: "New notification",
          description: (
            <>
              <div
                style={{ color: "#0F0F0F" }}
                // to={data?.link}
                className="mmenu_item hover3 "
                onClick={() => {
                  setReadNotificaion(data?.id);
                  handleLinkClick(data?.link);
                }}
              >
                <div className="profile_link_active">
                  <div className="circle_icon_notification">
                    <img src={data?.sender_picture} alt="" />
                    <div className="right_bottom_notification">
                      {reacts.includes(data?.type) ? (
                        <img
                          src={`../../../../reacts/${data?.type}.svg`}
                          alt=""
                        />
                      ) : (
                        <i className={`${data?.type}_icon`}></i>
                      )}
                    </div>
                  </div>
                  <p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${data?.description}`,
                      }}
                    />

                    <div className="notification_privacy_date_active">
                      <Moment fromNow interval={30}>
                        {data?.createdAt}
                      </Moment>
                    </div>
                  </p>
                </div>
                <div
                  className="notification_icon_active"
                  style={{
                    width: "10px",
                    right: "2px",
                    position: "absolute",
                  }}
                />
              </div>
            </>
          ),
          placement: "bottomLeft",
        });
      }
      getNotifications();
    });

    socket.on("getMessage", (data) => {
      getListMess();
    });

    // return () => {
    //   socket.off("getMessage");
    // };
  }, [socket]);

  const getAllPosts = async () => {
    try {
      setLoadingAllPosts(true);
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getAllposts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      dispatch({
        type: "POSTS_SUCCESS",
        payload: data,
      });
      setLoadingAllPosts(false);
    } catch (error) {
      dispatch({
        type: "POSTS_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  return (
    <div className={darkTheme && "dark"}>
      {visible && (
        <CreatePostPopup
          user={user}
          setVisible={setVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      {visibleReact && (
        <ReactPopup
          user={user}
          setVisibleReact={setVisibleReact}
          visibleReact={visibleReact}
          socket={socket}
        />
      )}
      {visibleReactComment && (
        <ReactCommentPopup
          user={user}
          setVisibleReactComment={setVisibleReactComment}
          visibleReactComment={visibleReactComment}
          socket={socket}
        />
      )}
      {visiblePost && (
        <Post_detail
          post={visiblePost.post}
          user={user}
          socket={socket}
          setVisiblePost={setVisiblePost}
          visiblePost={visiblePost}
          visibleReact={visibleReact}
          setVisibleReact={setVisibleReact}
          setVisibleReactComment={setVisibleReactComment}
          visibleReactComment={visibleReactComment}
          setVisiblePhoto={setVisiblePhoto}
          page={visiblePost.page}
          setReportGroup={setReportGroup}
          setReport={setReport}
        />
      )}
      {visiblePhoto && (
        <PhotoPopup
          setVisiblePost={setVisiblePost}
          setVisibleReact={setVisibleReact}
          setVisibleReactComment={setVisibleReactComment}
          visibleReactComment={visibleReactComment}
          visiblePhoto={visiblePhoto}
          setVisiblePhoto={setVisiblePhoto}
          socket={socket}
        />
      )}
      {visiblePhotoDetail && (
        <PhotoDetail
          visiblePhotoDetail={visiblePhotoDetail}
          setVisiblePhotoDetail={setVisiblePhotoDetail}
        />
      )}
      {openChatWindows && (
        <>
          {openChatWindows.map((room, index) =>
            room.room_name ? (
              <Room_Mess_screen
                stt={index}
                showChatRoom={room}
                socket={socket}
                onlineUsers={onlineUsers}
                getListMess={getListMess}
                closeChatWindow={closeChatWindow}
                setOpenChatWindowMess={setOpenChatWindowMess}
                openChatWindowMess={openChatWindowMess}
                getRoomMess={getRoomMess}
              />
            ) : (
              <Chat_screen
                stt={index}
                showChat={room}
                socket={socket}
                onlineUsers={onlineUsers}
                getListMess={getListMess}
                closeChatWindow={closeChatWindow}
                setOpenChatWindowMess={setOpenChatWindowMess}
                openChatWindowMess={openChatWindowMess}
              />
            )
          )}
        </>
      )}
      {report && <ReportMenu setReport={setReport} report={report} />}
      {reportGroup && (
        <ReportGroupMenu
          setReportGroup={setReportGroup}
          reportGroup={reportGroup}
        />
      )}
      {report_Profile && (
        <ReportMenu_Profile
          setReport_Profile={setReport_Profile}
          report_Profile={report_Profile}
        />
      )}

      {reportComment && <ReportMenu setReport={setReport} />}
      {reportGroupComment && (
        <ReportGroupMenu setReportGroup={setReportGroup} />
      )}
      {contextHolder}
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/messages"
            element={
              <Messages
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                setMess={setMess}
                setOpenChatWindowMess={setOpenChatWindowMess}
                openChatWindowMess={openChatWindowMess}
                setOpenChatWindows={setOpenChatWindows}
                mess={mess}
                getRoomMess={getRoomMess}
                setVisiblePhotoDetail={setVisiblePhotoDetail}
              />
            }
            exact
          />
          <Route
            path="/messages/:roomid"
            element={
              <Messages
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                setMess={setMess}
                setOpenChatWindowMess={setOpenChatWindowMess}
                openChatWindowMess={openChatWindowMess}
                setOpenChatWindows={setOpenChatWindows}
                mess={mess}
                getRoomMess={getRoomMess}
                setVisiblePhotoDetail={setVisiblePhotoDetail}
              />
            }
            exact
          />
          <Route
            path="/profile"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile&sk=:sk"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile&sk=:sk/album=:album"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile/:IdUser"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile/:IdUser&sk=:sk"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile/:IdUser&sk=:sk/album=:album"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile/:IdUser&post_id:=post_id"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/profile/:IdUser&post_id:=post_id&comment_id:=comment_id"
            element={
              <Profile
                setVisible={setVisible}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                User={User}
                getUser={getUserData}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                setReport_Profile={setReport_Profile}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/friends"
            element={
              <Friends
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                friendsByBirthdayLoading={friendsByBirthdayLoading}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                getUser={getUserData}
              />
            }
            exact
          />
          <Route
            path="/saved"
            element={
              <Saved
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                friendsByBirthdayLoading={friendsByBirthdayLoading}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                listPostSaved={listPostSaved}
                postGroupsLoading={postGroupsLoading}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                setVisiblePhoto={setVisiblePhoto}
                setReportGroup={setReportGroup}
                setReport={setReport}
                getListPostSaved={getListPostSaved}
              />
            }
            exact
          />
          <Route
            path="/friends/:type"
            element={
              <Friends
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                friendsByBirthdayLoading={friendsByBirthdayLoading}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
              />
            }
            exact
          />
          <Route
            path="/groups"
            element={
              <Groups
                getGroups={getGroups}
                getDiscoverGroups={getDiscoverGroups}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                setVisible={setVisible}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                postGroupsLoading={postGroupsLoading}
                dataPostGroups={dataPostGroups}
                groupsLoading={groupsLoading}
                discoverGroupsLoading={discoverGroupsLoading}
                dataDiscoverGroups={dataDiscoverGroups}
                dataGroups={dataGroups}
                setVisiblePhoto={setVisiblePhoto}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                User={User}
                getUserData={getUserData}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/groups/:type"
            element={
              <Groups
                getGroups={getGroups}
                getDiscoverGroups={getDiscoverGroups}
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                setVisible={setVisible}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                postGroupsLoading={postGroupsLoading}
                dataPostGroups={dataPostGroups}
                groupsLoading={groupsLoading}
                discoverGroupsLoading={discoverGroupsLoading}
                dataDiscoverGroups={dataDiscoverGroups}
                dataGroups={dataGroups}
                setVisiblePhoto={setVisiblePhoto}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                dataRoomMess={dataRoomMess}
                User={User}
                getUserData={getUserData}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/group/:idgroup/:sk/album=:album"
            element={
              <PageGroup
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                setVisible={setVisible}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                getGroups={getGroups}
                getDiscoverGroups={getDiscoverGroups}
                setVisiblePhoto={setVisiblePhoto}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                dataRoomMess={dataRoomMess}
                getRoomMess={getRoomMess}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/group/:idgroup/:sk/:type"
            element={
              <PageGroup
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                setVisible={setVisible}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                getGroups={getGroups}
                getDiscoverGroups={getDiscoverGroups}
                setVisiblePhoto={setVisiblePhoto}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                dataRoomMess={dataRoomMess}
                getRoomMess={getRoomMess}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/group/:idgroup/:sk"
            element={
              <PageGroup
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                setVisible={setVisible}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                getGroups={getGroups}
                getDiscoverGroups={getDiscoverGroups}
                setVisiblePhoto={setVisiblePhoto}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                dataRoomMess={dataRoomMess}
                getRoomMess={getRoomMess}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/group/:idgroup"
            element={
              <PageGroup
                getAllPosts={getAllPosts}
                socket={socket}
                notifications={notifications}
                setNotifi={setNotifi}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                friendsLoading={friendsLoading}
                getNotifications={getNotifications}
                setVisible={setVisible}
                setVisiblePost={setVisiblePost}
                visibleReact={visibleReact}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                getGroups={getGroups}
                getDiscoverGroups={getDiscoverGroups}
                setVisiblePhoto={setVisiblePhoto}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                dataRoomMess={dataRoomMess}
                getRoomMess={getRoomMess}
                setReportGroup={setReportGroup}
                setReport={setReport}
              />
            }
            exact
          />
          <Route
            path="/"
            element={
              <Home
                loadingAllPosts={loadingAllPosts}
                setVisible={setVisible}
                socket={socket}
                posts={posts}
                loading={loading}
                getAllPosts={getAllPosts}
                notifications={notifications}
                setVisiblePost={setVisiblePost}
                visiblePost={visiblePost}
                setVisibleReact={setVisibleReact}
                setVisibleReactComment={setVisibleReactComment}
                visibleReactComment={visibleReactComment}
                getNotifications={getNotifications}
                dataFriend={dataFriend}
                getDataFriend={getDataFriend}
                dataByBirthday={dataByBirthday}
                getDatafriendsByBirthday={getDatafriendsByBirthday}
                setVisiblePhoto={setVisiblePhoto}
                dataRoomMess={dataRoomMess}
                onlineUsers={onlineUsers}
                setReport={setReport}
                setReportGroup={setReportGroup}
                loadingListMess={loadingListMess}
                getListMess={getListMess}
                listMess={listMess}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
              />
            }
            exact
          />
          <Route
            path="/search/searchTerm=:searchTerm"
            element={
              <Search
                socket={socket}
                getAllPosts={getAllPosts}
                notifications={notifications}
                setNotifi={setNotifi}
                getDataFriend={getDataFriend}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                getGroups={getGroups}
              />
            }
            exact
          />
          <Route
            path="/search/:typeSearch/searchTerm=:searchTerm"
            element={
              <Search
                socket={socket}
                getAllPosts={getAllPosts}
                notifications={notifications}
                setNotifi={setNotifi}
                getDataFriend={getDataFriend}
                getListMess={getListMess}
                listMess={listMess}
                onlineUsers={onlineUsers}
                openChatWindow={openChatWindow}
                setOpenChatWindows={setOpenChatWindows}
                getGroups={getGroups}
              />
            }
            exact
          />

          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login socket={socket} />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
        <Route path="/verifi" element={<Verifi socket={socket} />} />
        <Route
          path="/verifi/:emailRegister"
          element={<VerifiRegister socket={socket} />}
        />
        <Route
          path="*"
          element={
            <NotFoundPage
              socket={socket}
              getAllPosts={getAllPosts}
              notifications={notifications}
              setVisiblePost={setVisiblePost}
              setNotifi={setNotifi}
              getListMess={getListMess}
              listMess={listMess}
              onlineUsers={onlineUsers}
              openChatWindow={openChatWindow}
              setOpenChatWindows={setOpenChatWindows}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
