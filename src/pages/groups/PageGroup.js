import { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header";
import "./style.css";
import { Dots, Home, HomeActive, Public } from "../../svg";
import axios from "axios";
import { pagegroup } from "../../functions/reducers";
import CreatePostGroupPopup from "../../components/createPostGroupPopup";
import Skeleton from "react-loading-skeleton";
import Media from "./tabs/Media";
import Detail_Albums_Group from "./tabs/Detail_Albums_Group";
import PageGroup_Menu from "./PageGroup_Menu";
import useClickOutside from "../../helpers/clickOutside";
import About from "../../components/about_group/aboutDetail";
import Members from "./tabs/Members";
import Cover_Group from "./Cover_Group";
import PageGroup_Discussion from "./tabs/PageGroup_Discussion";
import {
  leavegroup,
  followgroup,
  unfollowgroup,
  cancelRequestGroup,
  joingroup,
  pendingposts,
  getusersendinviteasadmin,
  cancelinviteasadmin,
  acceptinviteasadmin,
} from "../../functions/group";

import InviteMembers from "./InviteMembers";

import PageGroup_Menu_Private from "./PageGroup_Menu_Private";
import PageGroup_Discussion_Preview from "./tabs/PageGroup_Discussion_Preview";
import AboutDetail from "../../components/about_group/aboutDetail";
import CreateRoomMess from "./createRoomMess";
import Overview from "../../components/about_group/overview";
import MemberReported from "../../components/about_group/memberReported";
import { getReportsToGroup } from "../../functions/report";
import EditGroup from "../../components/about_group/editGroup";
import PendingPosts from "../../components/about_group/pendingPosts";
import MemberRequests from "../../components/about_group/memberRequests";
import ModerationAlerts from "../../components/about_group/moderationAlerts";
export default function PageGroup({
  getAllPosts,
  socket,
  notifications,
  setNotifi,
  getDataFriend,
  getNotifications,
  friendsLoading,
  setVisiblePost,
  visibleReact,
  setVisibleReact,
  setVisibleReactComment,
  visibleReactComment,
  getGroups,
  getDiscoverGroups,
  setVisiblePhoto,
  listMess,
  loadingListMess,
  onlineUsers,
  openChatWindow,
  setOpenChatWindows,
  dataRoomMess,
  getRoomMess,
  setReportGroup,
  setReport,
  
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const menu = useRef(null);
  const color = "#65676b";
  console.log(dataRoomMess);
  const [
    { loading: PageGroupLoading, error: PageGroupError, dataPageGroup },
    dispatchPageGroup,
  ] = useReducer(pagegroup, {
    loading: false,
    dataPageGroup: [],
    error: "",
  });
  const offroom = (room) => {
    openChatWindow(room);
  };
  const [tab, setTab] = useState();
  const [groupsMenu, setGroupsMenu] = useState(false);
  const [groupsMenuDots, setGroupsMenuDots] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleInvite, setVisibleInvite] = useState(false);
  const [visibleCreatRoomMess, setVisibleCreatRoomMess] = useState(false);
  const { idgroup, sk, album, type } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reports, setReports] = useState([]);

  const membersSections = ["members"];
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [hideGroup, setHideGroup] = useState(false);
  const [approveMembers, setApproveMembers] = useState(false);
  const [approvePosts, setApprovePosts] = useState(false);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [usersend, setUsersend] = useState();
  var idGroup = idgroup;
  const path = `${idgroup}/`;
  const max = 30;
  const sort = "desc";
  const media = ["media"];
  const profileTop = useRef(null);

  const getPageGroup = async () => {
    try {
      dispatchPageGroup({
        type: "PAGEGROUP_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getPageGroup/${idgroup}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatchPageGroup({
        type: "PAGEGROUP_SUCCESS",
        payload: data,
      });
      const images = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/listImages`,
        { path, sort, max },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setPhotos(images.data);
      if (postId) {
        scrollToPost(postId);
      }
    } catch (error) {
      dispatchPageGroup({
        type: "PAGEGROUP_ERROR",
        payload: PageGroupError.response.data.message,
      });
    }
  };
  console.log(dataPageGroup);

  const reportsToGroup = async () => {
    setLoadingReports(true);
    const res = await getReportsToGroup(idgroup, user.token);
    setReports(res);
    setLoadingReports(false);
  };

  const getPendingPosts = async () => {
    const res = await pendingposts(idgroup, user.token);
    setPendingPosts(res);
  };

  function scrollToPost(postId) {
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  function scrollToComment(commmentId) {
    const element = document.getElementById(`comment-${commmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }
  console.log(usersend);
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post_id");
  const commentId = urlParams.get("comment_id");
  var member = false; // Mặc định gán giá trị false
  var admin = false;
  var visitor = false;

  const isUserPending = dataPageGroup.pendingMembers?.some(
    (pendingMember) => pendingMember.user._id === user.id
  );

  const requestAdmin = dataPageGroup?.requests_admin?.includes(user.id);

  if (dataPageGroup?.members) {
    const userIDs = dataPageGroup.members.map((member) => member.user._id);
    const userAdminIDs = dataPageGroup.adminMembers.map(
      (member) => member.user._id
    );
    if (userIDs.includes(user.id)) {
      if (userAdminIDs.includes(user.id)) {
        admin = true;
      } else {
        member = true;
      }
    } else {
      visitor = true;
    }
  }

  console.log(isUserPending);

  const setleavegroup = async () => {
    const res = await leavegroup(dataPageGroup?._id, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const getuser_send_invite_as_admin = async () => {
    const res = await getusersendinviteasadmin(user.id, idGroup, user.token);
    setUsersend(res);
  };

  const setcancelinviteasadmin = async () => {
    const res = await cancelinviteasadmin(user.id, idGroup, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const setacceptinviteasadmin = async () => {
    const res = await acceptinviteasadmin(user.id, idGroup, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };
  const cancelRequestJoinGroup = async () => {
    const res = await cancelRequestGroup(dataPageGroup?._id, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const setfollowgroup = async () => {
    const res = await followgroup(dataPageGroup?._id, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };
  const setunfollowgroup = async () => {
    const res = await unfollowgroup(dataPageGroup?._id, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };
  const getPost = async (postId, commentId) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/getPost/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setVisiblePost({ post: data, commentId: commentId });
  };

  const joinGroup = async () => {
    const res = await joingroup(dataPageGroup?._id, user.token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const overview = [
    "overview",
    "memberReported",
    "pendingPost",
    "memberRequests",
    "moderationAlerts",
    "edit",
  ];
  const top = [
    "memberReported",
    "pendingPost",
    "memberRequests",
    "moderationAlerts",
  ];
  useEffect(() => {
    setVisiblePost(false);
    setVisibleReact(null);
    setVisibleReactComment(null);

    getPageGroup();
    getuser_send_invite_as_admin();
    getPendingPosts();
    setTab(sk);
    setDescription(dataPageGroup.description);
    setPrivacy(dataPageGroup.public);
    setHideGroup(dataPageGroup.hidden);
    setApproveMembers(dataPageGroup.approveMembers);
    setApprovePosts(dataPageGroup.approvePosts);
    getDataFriend();
    getNotifications();
    reportsToGroup();
    if (postId && !PageGroupLoading) {
      setTimeout(function () {
        scrollToPost(postId);
      }, 1000);
    }
    if (commentId) {
      getPost(postId, commentId);
      scrollToComment(commentId);
    }
    return () => {
      setVisiblePost(false);
      setVisibleReact(null);
      setVisibleReactComment(null);
    };
  }, [dataPageGroup?._id]);
  if (postId && !PageGroupLoading) {
    setTimeout(function () {
      scrollToPost(postId);
    }, 1000);
  }

  return (
    <>
      <Header
        getAllPosts={getAllPosts}
        socket={socket}
        notifications={notifications}
        setNotifi={setNotifi}
        listMess={listMess}
        loadingListMess={loadingListMess}
        onlineUsers={onlineUsers}
        openChatWindow={openChatWindow}
        setOpenChatWindows={setOpenChatWindows}
      />

      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <div className="req_card_pagegroup">
              <div className="group_content_pagegroup">
                <div className="content_head_pagegroup">
                  {PageGroupLoading ? (
                    <>
                      {" "}
                      <Skeleton
                        height="48px"
                        width="48px "
                        containerClassName="avatar-skeleton"
                      />
                      <div>
                        <div className="req_name">
                          <Skeleton
                            height="16px"
                            width="50px "
                            containerClassName="avatar-skeleton"
                          />
                        </div>
                        <div className="post_profile_privacy_date">
                          <Skeleton
                            height="16px"
                            width="80px "
                            containerClassName="avatar-skeleton"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Link to={`/group/${dataPageGroup?._id}`}>
                        <img src={dataPageGroup?.cover} alt="" />
                      </Link>
                      <div>
                        <Link  to={`/group/${dataPageGroup?._id}`} className="req_name hover6">
                          {dataPageGroup?.group_name}
                        </Link>
                        <div
                          className="post_profile_privacy_date"
                          style={{ gap: "5px" }}
                        >
                          {dataPageGroup.public ? (
                            <>
                              {" "}
                              <Public color="#828387" /> <p>Public group</p>{" "}
                              <p>.</p>
                            </>
                          ) : (
                            <>
                              {" "}
                              <i className="private_icon"></i>
                              <p>Private group</p>
                              <p>.</p>
                            </>
                          )}
                          <p>{dataPageGroup?.numMembers}</p> <p> members</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {PageGroupLoading ? (
                  <>
                    <div className="content_bottom_pagegroup">
                      <div className="req_name">
                        <Skeleton
                          height="37px"
                          width="280px "
                          containerClassName="avatar-skeleton"
                        />
                      </div>
                      <div style={{ height: "39px", marginBottom: "8px" }}>
                        <div className="req_name">
                          <Skeleton
                            height="39px"
                            width="39px "
                            containerClassName="avatar-skeleton"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {" "}
                    {admin && (
                      <>
                        <div className="content_bottom_pagegroup">
                          <div
                            className="blue_btn"
                            style={{ marginTop: "10px", width: "280px" }}
                            onClick={() => setVisibleInvite((prev) => !prev)}
                          >
                            <i className="plus_icon_white"></i>
                            <span>Invite</span>
                          </div>
                          <div
                            className="p10_dots_friend"
                            style={{ height: "39px", marginTop: "10px" }}
                            onClick={() => setGroupsMenuDots((prev) => !prev)}
                          >
                            <Dots />
                          </div>
                        </div>
                        {groupsMenuDots && (
                          <div
                            className="open_cover_menu"
                            style={{
                              boxShadow: "2px 2px 2px var(--shadow-1)",
                              border: "1px solid rgb(204, 204, 204)",
                            }}
                          >
                            {dataPageGroup.follow ? (
                              <>
                                {" "}
                                <div
                                  className="open_cover_menu_item hover1"
                                  onClick={() => setunfollowgroup()}
                                >
                                  <i className="unfollow_icon"></i>
                                  Unfollow group
                                </div>
                              </>
                            ) : (
                              <>
                                {" "}
                                <div
                                  className="open_cover_menu_item hover1"
                                  onClick={() => setfollowgroup()}
                                >
                                  <i className="follow_icon"></i>
                                  Follow group
                                </div>
                              </>
                            )}

                            <div className="mmenu_splitter"></div>
                            <div
                              className="open_cover_menu_item hover1"
                              onClick={() => setleavegroup()}
                            >
                              <i className="leave_icon"></i>
                              Leave group
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {member && (
                      <>
                        <div className="content_bottom_pagegroup">
                          <button
                            className="gray_btn"
                            style={{
                              marginTop: "10px",
                              width: "280px",
                              backgroundColor: "#E4E6EB",
                            }}
                            onClick={() => setGroupsMenu((prev) => !prev)}
                          >
                            <i className="yourgroups_icon"></i>
                            <span>Joined</span>
                            <i className="arrow_down_icon"></i>
                          </button>
                          <div
                            className="p10_dots_friend"
                            style={{ height: "39px", marginTop: "10px" }}
                          >
                            <Dots />
                          </div>
                        </div>
                        {groupsMenu && (
                          <div
                            className="open_cover_menu"
                            style={{
                              marginRight: "30px",
                              boxShadow: "2px 2px 2px var(--shadow-1)",
                            }}
                          >
                            {dataPageGroup.follow ? (
                              <>
                                {" "}
                                <div
                                  className="open_cover_menu_item hover1"
                                  onClick={() => setunfollowgroup()}
                                >
                                  <i className="unfollow_icon"></i>
                                  Unfollow group
                                </div>
                              </>
                            ) : (
                              <>
                                {" "}
                                <div
                                  className="open_cover_menu_item hover1"
                                  onClick={() => setfollowgroup()}
                                >
                                  <i className="follow_icon"></i>
                                  Follow group
                                </div>
                              </>
                            )}

                            <div className="mmenu_splitter"></div>
                            <div
                              className="open_cover_menu_item hover1"
                              onClick={() => setleavegroup()}
                            >
                              <i className="leave_icon"></i>
                              Leave group
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {admin ? (
            <>
              {" "}
              <div className="friends_left_wrap">
                <div className="selectCoverBox_links">
                  <div
                    className={`${
                      tab === "Browse" || tab === undefined
                        ? "selectCoverBox_link_active"
                        : "selectCoverBox_link hover7"
                    }`}
                    onClick={() => setTab("Browse")}
                  >
                    Browse
                  </div>
                  <div
                    className={`${
                      tab === "Manage" || overview.includes(tab)
                        ? "selectCoverBox_link_active"
                        : "selectCoverBox_link hover7"
                    }`}
                    onClick={() => setTab("Manage")}
                  >
                    Manage
                  </div>
                </div>
              </div>
              <div className="mmenu_splitter"></div>
              {tab === "Browse" || tab === undefined ? (
                <>
                  <div className="friends_left_wrap">
                    <Link
                      to={`/group/${idGroup}`}
                      className={` ${
                        overview.includes(sk)
                          ? "light_btn hover3"
                          : "light_blue_btn"
                      }`}
                      style={{ marginTop: "10px", paddingRight: "171px" }}
                    >
                      {overview.includes(sk) ? (
                        <>
                          <Home />
                          <p style={{ color: "var(--color-primary)"}}>Communnity home</p>
                        </>
                      ) : (
                        <>
                          <HomeActive />{" "}
                          <p style={{ color: "#0567D2" }}>Communnity home</p>
                        </>
                      )}
                    </Link>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {dataRoomMess &&
                      dataRoomMess.roomMess?.map((room) => (
                        <>
                          {room?.groupRef._id === idgroup && (
                            <div
                              className="contact hover3"
                              onClick={() => {
                                offroom(room);
                              }}
                            >
                              <div className="contact_img">
                                <img
                                  src="https://scontent.xx.fbcdn.net/v/t1.15752-9/311070626_1205014643680530_1668259112361737223_n.png?stp=dst-png_p206x206&_nc_cat=1&ccb=1-7&_nc_sid=61f064&_nc_eui2=AeHfBBLA5FlKKmGPuagiNTCojrnsystYOW6OuezKy1g5bpHeCc5WAkItMMppJAXcH7ie72ft81ZTeWwLzZeck5Rs&_nc_ohc=KYklkO2PBPEAX81938B&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdT74-ubXg7-mnF7yFEQfZ0Y4WXQfcDacUYeZFqq-QE_7g&oe=65DE9B87"
                                  alt=""
                                />
                              </div>
                              {room?.groupRef?.members?.map((member) => {
                                const isUserOnline = onlineUsers.some(
                                  (userOnline) =>
                                    userOnline.userId === member?.user &&
                                    userOnline.userId !== user.id &&
                                    member?.user !== user.id
                                );

                                return isUserOnline ? (
                                  <div
                                    key={member.user}
                                    className="state_active_user"
                                  />
                                ) : null;
                              })}

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span>{room?.room_name}</span>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "#65676B",
                                    fontWeight: "400",
                                  }}
                                >
                                  {room?.groupRef.group_name}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="friends_left_wrap">
                    <Link
                      to={`/group/${idGroup}`}
                      className={` ${
                        overview.includes(sk)
                          ? "light_btn hover3"
                          : "light_blue_btn "
                      }`}
                      style={{ marginTop: "10px", paddingRight: "171px" }}
                    >
                      {overview.includes(sk) ? (
                        <>
                          <Home />
                          <p style={{  color: "var(--color-primary)"}}>Communnity home</p>
                        </>
                      ) : (
                        <>
                          <HomeActive />{" "}
                          <p style={{ color: "#0567D2" }}>Communnity home</p>
                        </>
                      )}
                    </Link>
                    <Link
                      to={`/group/${idGroup}/overview`}
                      className={` ${
                        sk === "overview"
                          ? "light_blue_btn "
                          : " light_btn hover3"
                      }`}
                      style={{ paddingRight: "230px", gap: "14px" }}
                    >
                      {sk === "overview" ? (
                        <>
                          <i className="overview_active_icon"></i>
                          <p style={{ color: "#0567D2" }}>Overview </p>
                        </>
                      ) : (
                        <>
                          <i className="overview_icon"></i>
                          <p style={{  color: "var(--color-primary)" }}>Overview </p>
                        </>
                      )}
                    </Link>
                    <div className="create_splitter"></div>
                    <Link
                      to={`/group/${idGroup}/memberReported`}
                      className={`mmenu_item hover3 ${
                        sk === "memberReported" && "active_report"
                      }`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginRight: "11px",
                        }}
                      >
                        <img
                          src={
                            "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/WKkPKZz6y-9.png"
                          }
                          height={"20px"}
                          width={"20px"}
                          alt=""
                        />
                      </div>

                      {sk === "memberReported" ? (
                        <>
                          <p style={{ color: "#0567D2" }}>
                            Member-reported content{" "}
                          </p>
                        </>
                      ) : (
                        <>
                          {" "}
                          <p style={{  color: "var(--color-primary)" }}>
                            Member-reported content{" "}
                          </p>
                        </>
                      )}
                    </Link>

                    <Link
                      to={`/group/${idGroup}/memberRequests`}
                      className={`mmenu_item hover3 ${
                        sk === "memberRequests" && "active_report"
                      }`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginRight: "11px",
                        }}
                      >
                        <img
                          src={
                            "https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/3pvrsbqwH_6.png"
                          }
                          height={"20px"}
                          width={"20px"}
                          alt=""
                        />
                      </div>

                      {sk === "memberRequests" ? (
                        <>
                          <p style={{ color: "#0567D2" }}>Member requests </p>
                        </>
                      ) : (
                        <>
                          {" "}
                          <p style={{  color: "var(--color-primary)" }}>Member requests </p>
                        </>
                      )}
                    </Link>
                    <Link
                      to={`/group/${idGroup}/pendingPost`}
                      className={`mmenu_item hover3 ${
                        sk === "pendingPost" && "active_report"
                      }`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginRight: "11px",
                        }}
                      >
                        {/* {sk === "pendingPost" ? () : () */}
                        <img
                          src={
                            "https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/NsBMW9JrvfQ.png"
                          }
                          height={"20px"}
                          width={"20px"}
                          backgroundColor={"#0567D2"}
                          alt=""
                        />
                      </div>

                      {sk === "pendingPost" ? (
                        <>
                          <p style={{ color: "#0567D2" }}>Pending posts </p>
                        </>
                      ) : (
                        <>
                          {" "}
                          <p style={{  color: "var(--color-primary)"}}>Pending posts </p>
                        </>
                      )}
                    </Link>
                    <Link
                      to={`/group/${idGroup}/moderationAlerts`}
                      className={`mmenu_item hover3 ${
                        sk === "moderationAlerts" && "active_report"
                      }`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginRight: "11px",
                        }}
                      >
                        <img
                          src={
                            "https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/tHKOr6a_6aY.png"
                          }
                          height={"20px"}
                          width={"20px"}
                          alt=""
                        />
                      </div>

                      {sk === "moderationAlerts" ? (
                        <>
                          <p style={{ color: "#0567D2" }}>Moderation alerts </p>
                        </>
                      ) : (
                        <>
                          {" "}
                          <p style={{  color: "var(--color-primary)" }}>Moderation alerts </p>
                        </>
                      )}
                    </Link>
                    <Link
                      to={`/group/${idGroup}/edit`}
                      className={`mmenu_item hover3 ${
                        sk === "edit" && "active_report"
                      }`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginRight: "11px",
                        }}
                      >
                        {/* {sk === "pendingPost" ? () : () */}
                        <img
                          src={
                            "https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/nMuc0LmvYth.png"
                          }
                          height={"20px"}
                          width={"20px"}
                          backgroundColor={"#0567D2"}
                          alt=""
                        />
                      </div>

                      {sk === "edit" ? (
                        <>
                          <p style={{ color: "#0567D2" }}>Group settings</p>
                        </>
                      ) : (
                        <>
                          {" "}
                          <p style={{  color: "var(--color-primary)" }}>Group settings</p>
                        </>
                      )}
                    </Link>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {" "}
              <div className="friends_left_wrap">
                <div
                  className={` ${
                    sk === "overview"
                      ? "light_btn hover5"
                      : "light_blue_btn hover5"
                  }`}
                  style={{ marginTop: "10px", paddingRight: "171px" }}
                >
                  <HomeActive />
                  <p style={{ color: "#0567D2" }}>Communnity home</p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                {dataRoomMess &&
                  dataRoomMess.roomMess?.map((room) => (
                    <>
                      {room?.groupRef._id === idgroup && (
                        <div
                          className="contact hover3"
                          onClick={() => {
                            offroom(room);
                          }}
                        >
                          <div className="contact_img">
                            <img
                              src="https://scontent.xx.fbcdn.net/v/t1.15752-9/311070626_1205014643680530_1668259112361737223_n.png?stp=dst-png_p206x206&_nc_cat=1&ccb=1-7&_nc_sid=61f064&_nc_ohc=OOUSxmZvpX4AX9Ec52l&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdSfANxf_j6Qxp6IFN6vPDk365_uJnnsLAWTOqrpxQrwCA&oe=65ADD407"
                              alt=""
                            />
                          </div>
                          {room?.groupRef?.members?.map((member) => {
                            const isUserOnline = onlineUsers.some(
                              (userOnline) =>
                                userOnline.userId === member?.user &&
                                userOnline.userId !== user.id &&
                                member?.user !== user.id
                            );

                            return isUserOnline ? (
                              <div
                                key={member.user}
                                className="state_active_user"
                              />
                            ) : null;
                          })}

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span>{room?.room_name}</span>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#65676B",
                                fontWeight: "400",
                              }}
                            >
                              {room?.groupRef.group_name}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ))}
              </div>
            </>
          )}

          {admin && (
            <>
              <div
                className="light_blue_btn hover5"
                // style={{marginTop: "483px"}}
                style={{ position: "absolute", bottom: "75px", width: "340px" }}
                onClick={() => setVisibleCreatRoomMess(true)}
              >
                <img
                  src="../../../icons/add.png"
                  alt=""
                  className="filter_blue"
                />
                <p style={{ color: "#0567D2" }}>Create a chat</p>
              </div>
            </>
          )}
        </div>
        <div className="friends_right_pagegroup">
          <div className="profile">
            {visible && (
              <CreatePostGroupPopup
                user={user}
                setVisible={setVisible}
                posts={dataPageGroup?.posts}
                dispatch={dispatchPageGroup}
                idGroup={dataPageGroup?._id}
                admin={admin}
                approvePosts={dataPageGroup?.approvePosts}
              />
            )}
            {visibleInvite && (
              <InviteMembers
                setVisibleInvite={setVisibleInvite}
                socket={socket}
                dataPageGroup={dataPageGroup}
              />
            )}
            {visibleCreatRoomMess && (
              <CreateRoomMess
                setVisibleCreatRoomMess={setVisibleCreatRoomMess}
                socket={socket}
                dataPageGroup={dataPageGroup}
                getPageGroup={getPageGroup}
                getRoomMess={getRoomMess}
              />
            )}
            {!overview.includes(sk) && (
              <>
                {" "}
                <div
                  className="pagegroup_top"
                  style={{ marginTop: 0 }}
                  ref={profileTop}
                >
                  <div
                    className="pagegroup_container"
                    style={{ height: requestAdmin ? "660px" : "600px" }}
                  >
                    {PageGroupLoading ? (
                      <>
                        <div className="profile_cover">
                          <Skeleton
                            height="460px"
                            width="1260px"
                            containerClassName="avatar-skeleton"
                            style={{ borderRadius: "8px" }}
                          />
                        </div>
                        <div
                          className="profile_img_wrap"
                          style={{
                            marginBottom: "-3rem",
                            transform: "translateY(110px)",
                          }}
                        >
                          <div className="profile_w_left">
                            <div className="profile_w_col">
                              <div
                                className="profile_name"
                                style={{ paddingBottom: "20px" }}
                              >
                                <Skeleton
                                  height="35px"
                                  width="200px"
                                  containerClassName="avatar-skeleton"
                                />
                              </div>

                              <div className="profile_friend_imgs">
                                {Array.from(
                                  new Array(6),
                                  (val, i) => i + 1
                                ).map((id, i) => (
                                  <Skeleton
                                    circle
                                    height="32px"
                                    width="32px"
                                    containerClassName="avatar-skeleton"
                                    style={{
                                      transform: `translateX(${-i * 7}px)`,
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Cover_Group
                          cover={dataPageGroup?.cover}
                          visitor={member}
                          photos={photos}
                          idGroup={idGroup}
                          admin={admin}
                        />
                        <div className="pagegroupe_w_col">
                          <div className="pagegroupe_name">
                            {dataPageGroup?.group_name}
                          </div>
                          <div
                            className="pagegroupe_friend_imgs"
                            style={{ width: "1215px" }}
                          >
                            {((sk === undefined &&
                              !dataPageGroup.public &&
                              !visitor) ||
                              (sk === undefined && dataPageGroup.public)) && (
                              <>
                                {" "}
                                {dataPageGroup.members &&
                                  dataPageGroup.members
                                    .slice(0, 20)
                                    .map((user, i) => (
                                      <Link
                                        to={`/profile/${user.user._id}`}
                                        key={i}
                                      >
                                        <img
                                          src={user.user.picture}
                                          alt=""
                                          style={{
                                            transform: `translateX(${
                                              -i * 7
                                            }px)`,
                                            zIndex: `${i}`,
                                          }}
                                        />
                                      </Link>
                                    ))}
                              </>
                            )}

                            {visitor && !isUserPending && (
                              <>
                                <div className="reg_btn_wrapper">
                                  <button
                                    className="blue_btn"
                                    style={{
                                      position: "absolute",
                                      right: "0",
                                      width: "auto",
                                    }}
                                    onClick={() => joinGroup()}
                                  >
                                    Join group
                                  </button>
                                </div>
                              </>
                            )}
                            {!visitor && !isUserPending && (
                              <>
                                {" "}
                                <div className="reg_btn_wrapper">
                                  <div
                                    className="blue_btn"
                                    style={{ position: "absolute", right: "0" }}
                                    onClick={() =>
                                      setVisibleInvite((prev) => !prev)
                                    }
                                  >
                                    <i className="plus_icon_white"></i>
                                    <span>Invite</span>
                                  </div>
                                </div>
                              </>
                            )}
                            {visitor && isUserPending && (
                              <>
                                <button
                                  className="gray_btn_requests"
                                  style={{
                                    width: "fit-content",
                                    position: "absolute",
                                    right: "0",
                                    top: "0",
                                    background: "#F0F0F0",
                                  }}
                                  onClick={() => cancelRequestJoinGroup()}
                                >
                                  <span>Cancel Request</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {requestAdmin && !PageGroupLoading && (
                      <div
                        className="profile_card"
                        style={{
                          display: "flex",
                          width: "1206px",
                          marginLeft: "30px",
                          position: "relative",
                          height: "52px",
                        }}
                      >
                        <p style={{ fontSize: "14px", fontWeight: "500" }}>
                          {usersend?.data[0]?.first_name}{" "}
                          {usersend?.data[0]?.last_name} invited you to become
                          an admin.
                        </p>
                        <div
                          className="button_requests"
                          style={{ right: "0", position: "absolute" }}
                        >
                          <button
                            className="blue_btn_requests"
                            onClick={() => setacceptinviteasadmin()}
                          >
                            Confirm
                          </button>
                          <button
                            className="gray_btn_requests"
                            onClick={() => setcancelinviteasadmin()}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {!PageGroupLoading && (
                    <>
                      {" "}
                      {visitor && !dataPageGroup.public ? (
                        <>
                          <PageGroup_Menu_Private
                            idGroup={idGroup}
                            setReport={setReport}
                          />
                        </>
                      ) : (
                        <>
                          <PageGroup_Menu
                            idGroup={idGroup}
                            setReport={setReport}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
            {sk === "memberReported" && (
              <>
                {" "}
                <div
                  className="pagegroup_top"
                  style={{ marginTop: 0 }}
                  ref={profileTop}
                >
                  <div
                    className="pagegroup_container"
                    style={{ height: "100px" }}
                  >
                    {" "}
                    {sk === "memberReported"}
                    <div
                      className="pagegroupe_name"
                      style={{ paddingTop: "25px" }}
                    >
                      Member-reported content
                    </div>
                  </div>
                </div>
              </>
            )}
            {sk === "pendingPost" && (
              <>
                {" "}
                <div
                  className="pagegroup_top"
                  style={{ marginTop: 0 }}
                  ref={profileTop}
                >
                  <div
                    className="pagegroup_container"
                    style={{ height: "100px" }}
                  >
                    {" "}
                    {sk === "memberReported"}
                    <div
                      className="pagegroupe_name"
                      style={{ paddingTop: "25px" }}
                    >
                      Pending Posts
                    </div>
                  </div>
                </div>
              </>
            )}
            {sk === "memberRequests" && (
              <>
                {" "}
                <div
                  className="pagegroup_top"
                  style={{ marginTop: 0 }}
                  ref={profileTop}
                >
                  <div
                    className="pagegroup_container"
                    style={{ height: "100px" }}
                  >
                    {" "}
                    {sk === "memberRequests"}
                    <div
                      className="pagegroupe_name"
                      style={{ paddingTop: "25px" }}
                    >
                      Member Requests
                    </div>
                  </div>
                </div>
              </>
            )}
            {sk === "moderationAlerts" && (
              <>
                {" "}
                <div
                  className="pagegroup_top"
                  style={{ marginTop: 0 }}
                  ref={profileTop}
                >
                  <div
                    className="pagegroup_container"
                    style={{ height: "100px" }}
                  >
                    {" "}
                    {sk === "moderationAlerts"}
                    <div
                      className="pagegroupe_name"
                      style={{ paddingTop: "25px" }}
                    >
                      Moderation Alerts
                    </div>
                  </div>
                </div>
              </>
            )}

            <div
              className="profile_bottom"
              style={{
                alignContent: "center",
                justifyContent: "center",
                display: "grid",
              }}
            >
              <div className="pagegroup_container">
                <div className="bottom_container">
                  {((sk === undefined && !dataPageGroup.public && !visitor) ||
                    (sk === undefined && dataPageGroup.public)) && (
                    <PageGroup_Discussion
                      socket={socket}
                      dataPageGroup={dataPageGroup}
                      loading={PageGroupLoading}
                      member={member}
                      admin={admin}
                      setOthername={""}
                      idGroup={idGroup} //
                      photos={photos}
                      setVisible={setVisible}
                      profileTop={profileTop}
                      setVisiblePost={setVisiblePost}
                      visibleReact={visibleReact}
                      setVisibleReact={setVisibleReact}
                      commentId={commentId}
                      postId={postId}
                      setVisibleReactComment={setVisibleReactComment}
                      visibleReactComment={visibleReactComment}
                      setVisiblePhoto={setVisiblePhoto}
                      setReportGroup={setReportGroup}
                      setReport={setReport}
                    />
                  )}
                  {sk === "discussion" && (
                    <PageGroup_Discussion_Preview
                      socket={socket}
                      dataPageGroup={dataPageGroup}
                      loading={PageGroupLoading}
                      member={member}
                      admin={admin}
                      setOthername={""}
                      idGroup={idGroup} //
                      photos={photos}
                      setVisible={setVisible}
                      profileTop={profileTop}
                      setVisiblePost={setVisiblePost}
                      visibleReact={visibleReact}
                      setVisibleReact={setVisibleReact}
                      commentId={commentId}
                      postId={postId}
                      setVisibleReactComment={setVisibleReactComment}
                      visibleReactComment={visibleReactComment}
                    />
                  )}
                  {sk === undefined && visitor && !dataPageGroup.public && (
                    <AboutDetail
                      idGroup={idGroup}
                      dataPageGroup={dataPageGroup}
                      detailss={[]}
                      visitor={member}
                    />
                  )}

                  {sk === "overview" && (
                    <Overview
                      idGroup={idGroup}
                      pendingPosts={pendingPosts}
                      dataPageGroup={dataPageGroup}
                      detailss={[]}
                      visitor={member}
                      reports={reports}
                      setTab={setTab}
                    />
                  )}
                  {sk === "memberReported" && (
                    <MemberReported
                      idGroup={idGroup}
                      dataPageGroup={dataPageGroup}
                      loadingReports={loadingReports}
                      reports={reports}
                      reportsToGroup={reportsToGroup}
                    />
                  )}
                  {sk === "pendingPost" && (
                    <PendingPosts
                      idGroup={idGroup}
                      dataPageGroup={dataPageGroup}
                      pendingPosts={pendingPosts}
                      PageGroupLoading={PageGroupLoading}
                      getPageGroup={getPageGroup}
                      getPendingPosts={getPendingPosts}
                    />
                  )}
                  {sk === "edit" && (
                    <EditGroup
                      idGroup={idGroup}
                      dataPageGroup={dataPageGroup}
                      description={description}
                      setDescription={setDescription}
                      privacy={privacy}
                      setPrivacy={setPrivacy}
                      hideGroup={hideGroup}
                      setHideGroup={setHideGroup}
                      approveMembers={approveMembers}
                      setApproveMembers={setApproveMembers}
                      approvePosts={approvePosts}
                      setApprovePosts={setApprovePosts}
                      getPageGroup={getPageGroup}
                    />
                  )}
                  {sk === "memberRequests" && (
                    <MemberRequests
                      idGroup={idGroup}
                      dataPageGroup={dataPageGroup}
                      PageGroupLoading={PageGroupLoading}
                      getPageGroup={getPageGroup}
                    />
                  )}
                  {sk === "moderationAlerts" && (
                    <ModerationAlerts
                      idGroup={idGroup}
                      dataPageGroup={dataPageGroup}
                      detailss={[]}
                      visitor={member}
                    />
                  )}

                  {membersSections.includes(sk) && (
                    <Members
                      sk={sk}
                      requests_admin={dataPageGroup?.requests_admin}
                      numMembers={dataPageGroup?.numMembers}
                      admins={dataPageGroup?.adminMembers}
                      members={dataPageGroup?.members}
                      friendMembers={dataPageGroup?.friendMembers}
                      PageGroupLoading={PageGroupLoading}
                      user={user}
                      visitor={visitor}
                      admin={admin}
                      member={member}
                      socket={socket}
                      getDataFriend={getDataFriend}
                      getPageGroup={getPageGroup}
                      idGroup={idGroup}
                      openChatWindow={openChatWindow}
                    />
                  )}
                  {media.includes(sk) &&
                    (album ? (
                      <Detail_Albums_Group
                        sk={sk}
                        type={type}
                        idUser={idGroup}
                        loading={friendsLoading}
                        photos={photos}
                        user={user}
                        album={album}
                        setVisiblePhoto={setVisiblePhoto}
                      />
                    ) : (
                      <Media
                        sk={sk}
                        type={type}
                        idGroup={idGroup}
                        loading={friendsLoading}
                        photos={photos}
                        user={user}
                        setVisiblePhoto={setVisiblePhoto}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
