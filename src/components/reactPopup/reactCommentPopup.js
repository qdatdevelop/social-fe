import { useEffect, useRef, useState } from "react";
import "./style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getReactsComment } from "../../functions/comment";
import useClickOutside from "../../helpers/clickOutside";
import { addFriend, cancelRequest, acceptRequest } from "../../functions/user";
import { getUser } from "../../functions/user";
import { HashLoader } from "react-spinners";
import { createNotification } from "../../functions/notification";
export default function ReactCommentPopup({
  user,
  setVisibleReactComment,
  visibleReactComment,
  socket
}) {
  const popup = useRef(null);
  const [reacts, setReacts] = useState();
  const [totalType, setTotalType] = useState(0);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState();
  const [User, setUser] = useState();
  useClickOutside(popup, () => {
    setVisibleReactComment(null);
  });

  useEffect(() => {
    getCommentReacts();
    getUserData();
  }, [visibleReactComment]);

  const getUserData = async () => {
    const res = await getUser(user.token);
    setUser(res);
  };

  const getCommentReacts = async () => {
    const res = await getReactsComment(visibleReactComment, user.token);
    setReacts(res.reacts);
    setTotal(res.total);
    setTotalType(res.totalType);
    {
      res.totalType === 1
        ? setActiveTab(`tab${res.TypeHigh}`)
        : setActiveTab("tabAll");
    }
  };

  const getCommentReacts2 = async () => {
    const res = await getReactsComment(visibleReactComment, user.token);
    setReacts(res.reacts);
    setTotal(res.total);
    setTotalType(res.totalType);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const addFriendHandler = async (Userid) => {
    await addFriend(Userid, user.token);
    getUserData();
    getCommentReacts2();
    const newNotification = await createNotification(
      Userid,
      "addFriend",
      null,
      null,
      `/profile/${user.id}`,
      ` <b>${user.first_name} ${user.last_name}</b> has sent you a friend request.`,
      user.token
    );

    socket.emit("sendNotification", {
      senderId: user.id,
      sender_first_name: user.first_name,
      sender_last_name: user.last_name,
      sender_picture: user.picture,
      receiverId: Userid,
      type: "addFriend",
      postId: "",
      commentId: "",
      link: `/profile/${user.id}`,
      description: ` <b>${user.first_name} ${user.last_name}</b> has sent you a friend request.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
    });
  };
  const cancelRequestHandler = async (Userid) => {
    await cancelRequest(Userid, user.token);
    getUserData();
    getCommentReacts2();
  };
  const acceptRequestHanlder = async (Userid) => {
    await acceptRequest(Userid, user.token);
    getUserData();
    getCommentReacts2();
    const newNotification = await createNotification(
      Userid,
      "acceptRequest",
      null,
      null,
      `/profile/${user.id}`,
      ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
      user.token
    );

    socket.emit("sendNotification", {
      senderId: user.id,
      sender_first_name: user.first_name,
      sender_last_name: user.last_name,
      sender_picture: user.picture,
      receiverId: Userid,
      type: "acceptRequest",
      postId: "",
      commentId: "",
      link: `/profile/${user.id}`,
      description: ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
    });
  };
  console.log(reacts);
  return (
    <div className="blur_react">
      <div className="postBoxReact " ref={popup}>
        <div className="box_react_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisibleReactComment(null);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <div className="profile_menu_wrap">
            <div className="react_menu">
              {totalType > 1 && (
                <div className="tab_menu_react">
                  <a
                    className={
                      activeTab === "tabAll" ? "react_menu_active" : "hover1"
                    }
                    onClick={() => handleTabClick("tabAll")}
                  >
                    All
                  </a>
                </div>
              )}

              {reacts &&
                reacts
                  .sort((a, b) => {
                    return b.count - a.count;
                  })
                  .map(
                    (react, i) =>
                      react.count > 0 && (
                        <>
                          <div className="tab_menu_react" key={i}>
                            <a
                              className={
                                activeTab === `tab${react.react}`
                                  ? "react_menu_active"
                                  : "hover1"
                              }
                              onClick={() =>
                                handleTabClick(`tab${react.react}`)
                              }
                            >
                              <img
                                src={`../../../reacts/${react.react}.svg`}
                                alt=""
                              />

                              <p>{react.count}</p>
                            </a>
                          </div>
                        </>
                      )
                  )}
            </div>
          </div>
        </div>
        <div className="box_react scrollbar">
          <div className="box_col">
            {User ? (
              <>
                {" "}
                {activeTab === "tabAll" && (
                  <>
                    {reacts &&
                      reacts
                        .sort((a, b) => {
                          return b.count - a.count;
                        })
                        .map(
                          (react, i) =>
                            react.count > 0 && (
                              <>
                                <>
                                  {reacts[i].users.map((user1, i) => (
                                    <div className="user_react" key={i}>
                                      <Link
                                        to={`/profile/${user1?._id}`}
                                        className="uses_react_left hover6"
                                      >
                                        <img src={user1.picture} alt="" />
                                        <p>
                                          {" "}
                                          {user1.first_name} {user1.last_name}
                                        </p>
                                      </Link>

                                      {user1?.friends.indexOf(user.id) !==
                                      -1 ? (
                                        <>
                                          <button className="btn_add_friend_react">
                                            <p>Message</p>
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          {user1?.requests.indexOf(user.id) !==
                                          -1 ? (
                                            <button
                                              className="btn_add_friend_react"
                                              onClick={() =>
                                                cancelRequestHandler(user._id)
                                              }
                                            >
                                              <p>Cancel request</p>
                                            </button>
                                          ) : (
                                            <>
                                              {User?.requests.indexOf(
                                                user1._id
                                              ) !== -1 ? (
                                                <button
                                                  className="btn_add_friend_react"
                                                  onClick={() =>
                                                    acceptRequestHanlder(
                                                      user._id
                                                    )
                                                  }
                                                >
                                                  <p>Confirm request</p>
                                                </button>
                                              ) : (
                                                <>
                                                  {user1._id === User._id ? (
                                                    ""
                                                  ) : (
                                                    <button
                                                      className="btn_add_friend_react"
                                                      onClick={() =>
                                                        addFriendHandler(
                                                          user._id
                                                        )
                                                      }
                                                    >
                                                      <p>Add Friend</p>
                                                    </button>
                                                  )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </>
                              </>
                            )
                        )}
                  </>
                )}
                {reacts &&
                  reacts
                    .sort((a, b) => {
                      return b.count - a.count;
                    })
                    .map(
                      (react, i) =>
                        react.count > 0 && (
                          <>
                            {activeTab === `tab${react.react}` && (
                              <>
                                {reacts[i].users.map((user1, i) => (
                                  <div className="user_react" key={i}>
                                    <Link
                                      to={`/profile/${user1?._id}`}
                                      className="uses_react_left hover6"
                                    >
                                      <img src={user1.picture} alt="" />
                                      <p>
                                        {" "}
                                        {user1.first_name} {user1.last_name}
                                      </p>
                                    </Link>
                                    {user1?.friends.indexOf(user.id) !== -1 ? (
                                      <>
                                        <button className="btn_add_friend_react">
                                          <p>Message</p>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        {user1?.requests.indexOf(user.id) !==
                                        -1 ? (
                                          <button
                                            className="btn_add_friend_react"
                                            onClick={() =>
                                              cancelRequestHandler(user1._id)
                                            }
                                          >
                                            <p>Cancel request</p>
                                          </button>
                                        ) : (
                                          <>
                                            {User?.requests.indexOf(
                                              user1._id
                                            ) !== -1 ? (
                                              <button
                                                className="btn_add_friend_react"
                                                onClick={() =>
                                                  acceptRequestHanlder(
                                                    user1._id
                                                  )
                                                }
                                              >
                                                <p>Confirm request</p>
                                              </button>
                                            ) : (
                                              <>
                                                {user1._id === User._id ? (
                                                  ""
                                                ) : (
                                                  <button
                                                    className="btn_add_friend_react"
                                                    onClick={() =>
                                                      addFriendHandler(
                                                        user1._id
                                                      )
                                                    }
                                                  >
                                                    <p>Add Friend</p>
                                                  </button>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                ))}
                              </>
                            )}
                          </>
                        )
                    )}
              </>
            ) : (
              <div className="sekelton_loader" style={{marginLeft: "120px"}}>
                <HashLoader color="#1876f2" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
