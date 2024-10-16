import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dots } from "../../svg";
import {
  addFriend,
  cancelRequest,
  follow,
  unfollow,
  acceptRequest,
  unfriend,
  deleteRequest,
} from "../../functions/user";
import { createNotification } from "../../functions/notification";
import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
export default function FriendCard({
  userr,
  type,
  getData,
  sk,
  User,
  getUser,
  getDataFriend,
  socket,
  getProfile,
}) {
  const { user } = useSelector((state) => ({ ...state }));

  const friendship = {
    friends: false,
    following: false,
    requestSent: false,
    requestReceived: false,
  };

  if (userr?.friends.includes(user.id) && User?.friends.includes(userr._id)) {
    friendship.friends = true;
  }
  if (User?.following.includes(userr._id)) {
    friendship.following = true;
  }
  if (User?.requests.includes(userr._id)) {
    friendship.requestReceived = true;
  }
  if (userr?.requests.includes(User._id)) {
    friendship.requestSent = true;
  }
  console.log(userr)
  useEffect(() => {
    getUser(user.token);
    if (userr?.friends.includes(user.id) && User?.friends.includes(userr._id)) {
      friendship.friends = true;
    }
    if (User?.following.includes(userr._id)) {
      friendship.following = true;
    }
    if (User?.requests.includes(userr._id)) {
      friendship.requestReceived = true;
    }
    if (User?.requests.includes(userr._id)) {
      friendship.requestSent = true;
    }
  }, []);

  const addFriendHandler = async () => {
    await addFriend(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
    const newNotification = await createNotification(
      userr._id,
      "addFriend",
      null,
      null,
      `/profile/${user.id}`,
      ` <b>${user.first_name} ${user.last_name}</b> has sent you a friend request.`,
      user.token,
      null
    );

    socket.emit("sendNotification", {
      senderId: user.id,
      sender_first_name: user.first_name,
      sender_last_name: user.last_name,
      sender_picture: user.picture,
      receiverId: userr._id,
      type: "addFriend",
      postId: "",
      commentId: "",
      link: `/profile/${user.id}`,
      description: ` <b>${user.first_name} ${user.last_name}</b> has sent you a friend request.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
      groupId: "",
    });
  };
  const cancelRequestHandler = async () => {
    await cancelRequest(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
  };
  const followHandler = async () => {
    await follow(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
  };
  const unfollowHandler = async () => {
    await unfollow(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
  };
  const acceptRequestHanlder = async () => {
    await acceptRequest(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
    const newNotification = await createNotification(
      userr._id,
      "acceptRequest",
      null,
      null,
      `/profile/${user.id}`,
      ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
      user.token,
      null
    );

    socket.emit("sendNotification", {
      senderId: user.id,
      sender_first_name: user.first_name,
      sender_last_name: user.last_name,
      sender_picture: user.picture,
      receiverId: userr._id,
      type: "acceptRequest",
      postId: "",
      commentId: "",
      link: `/profile/${user.id}`,
      description: ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
      groupId: "",
    });
  };
  const unfriendHandler = async () => {
    await unfriend(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
  };
  const deleteRequestHanlder = async () => {
    await deleteRequest(userr._id, user.token);
    getDataFriend();
    getUser(user.token);
    getProfile();
  };
  const menu = useRef(null);
  const menu1 = useRef(null);
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  useClickOutside(menu, () => setFriendsMenu(false));
  useClickOutside(menu1, () => setRespondMenu(false));

  return (
    <div
      className="req_card_profile"
      style={{ width: "500px", position: "initial" }}
    >
      <div className="req_profile_image">
        <Link to={`/profile/${userr._id}`}>
          <img src={userr.picture} alt="" />
        </Link>
      </div>
      <div className="req_name hover6">
        <Link to={`/profile/${userr._id}`}>
          {userr.first_name} {userr.last_name}
        </Link>

        {sk === "friends_with_upcoming_birthdays" && (
          <div className="req_name_state">{userr.daysToBirthdayMessage}</div>
        )}
      </div>

      <div className="right" style={{ marginLeft: "auto", position: "sticky" }}>
        <div className="friendship">
          {friendship?.friends ? (
            <div className="friends_menu_wrap">
              <div
                className="dots_friends hover1"
                onClick={() => setFriendsMenu(true)}
              >
                <Dots />
              </div>
              {friendsMenu && (
                <div className="open_cover_menu" ref={menu}>
                  {friendship.following ? (
                    <div
                      className="open_cover_menu_item hover1"
                      style={{ padding: "5px" }}
                      onClick={() => unfollowHandler()}
                    >
                      <img
                        src="../../../icons/unfollowOutlined.png"
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "0",
                          margin: "0",
                        }}
                      />
                      Unfollow
                    </div>
                  ) : (
                    <div
                      className="open_cover_menu_item hover1"
                      style={{ padding: "5px" }}
                      onClick={() => followHandler()}
                    >
                      <img
                        src="../../../icons/unfollowOutlined.png"
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "0",
                          margin: "0",
                        }}
                      />
                      Follow
                    </div>
                  )}
                  <div
                    className="open_cover_menu_item hover1"
                    style={{ padding: "5px" }}
                    onClick={() => unfriendHandler()}
                  >
                    <i className="unfriend_outlined_icon"></i>
                    Unfriend
                  </div>
                </div>
              )}
            </div>
          ) : (
            !friendship?.requestSent &&
            !friendship?.requestReceived &&
            userr._id !== user.id && (
              <button className="blue_btn" onClick={() => addFriendHandler()}>
                <span>Add Friend</span>
              </button>
            )
          )}
          {friendship?.requestSent ? (
            <button className="btn_add_friend_search" onClick={() => cancelRequestHandler()} style={{fontWeight: "550" , padding:"8.5px 12px" , margin:"0"}}>
              <span>Cancel Request</span>
            </button>
          ) : (
            friendship?.requestReceived && (
              <div className="friends_menu_wrap">
                <button
                  className="btn_add_friend_search"
                  style={{fontWeight: "550" , padding:"8.5px 12px" , margin:"0"}}
                  onClick={() => setRespondMenu(true)}
                >
                  <span>Respond</span>
                </button>
                {respondMenu && (
                  <div className="open_cover_menu" ref={menu1}>
                    <div
                      className="open_cover_menu_item hover1"
                      style={{ padding: "5px" }}
                      onClick={() => acceptRequestHanlder()}
                    >
                      Confirm
                    </div>
                    <div
                      className="open_cover_menu_item hover1"
                      style={{ padding: "5px" }}
                      onClick={() => deleteRequestHanlder()}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
