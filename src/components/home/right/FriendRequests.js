import { acceptRequest, deleteRequest } from "../../../functions/user";
import { Link } from "react-router-dom";
import { createNotification } from "../../../functions/notification";
export default function FriendRequests({
  user,
  dataFriend,
  getDataFriend,
  socket,
}) {
  const confirmHandler = async (userId) => {
    const res = await acceptRequest(userId, user.token);
    if (res == "ok") {
      getDataFriend();
    }
    const newNotification = await createNotification(
      userId,
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
      receiverId: userId,
      type: "acceptRequest",
      postId: "",
      commentId: "",
      link: `/profile/${user.id}`,
      description: ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
      groupId: ""
    });
  };
  const deleteHandler = async (userId) => {
    const res = await deleteRequest(userId, user.token);
    if (res == "ok") {
      getDataFriend();
    }
  };
  return (
    <>
      {dataFriend.requests?.length > 0 && (
        <>
          <div className="contact hover3">
            <Link
              to={`/profile/${dataFriend.requests[0]?._id}`}
              className="requests_img"
            >
              <img src={dataFriend.requests[0]?.picture} alt="" />
            </Link>
            <div className="body_requests">
              <Link to={`/profile/${dataFriend.requests[0]?._id}`}>
                <div className="name_requests hover6">
                  {dataFriend.requests[0]?.first_name}{" "}
                  {dataFriend.requests[0]?.last_name}
                </div>
              </Link>
              <div className="button_requests">
                <button
                  className="blue_btn_requests"
                  onClick={() => confirmHandler(dataFriend.requests[0]?._id)}
                >
                  Confirm
                </button>
                <button
                  className="gray_btn_requests"
                  style={{color:"#050505"}}
                  onClick={() => deleteHandler(dataFriend.requests[0]?._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
