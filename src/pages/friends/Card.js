import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createNotification } from "../../functions/notification";
import {
  acceptRequest,
  cancelRequest,
  deleteRequest,
} from "../../functions/user";

export default function Card({ userr, type, getData ,socket}) {
  const { user } = useSelector((state) => ({ ...state }));
  const cancelRequestHandler = async (userId) => {
    const res = await cancelRequest(userId, user.token);
    if (res == "ok") {
      getData();
    }
  };
  const confirmHandler = async (userId) => {
    const res = await acceptRequest(userId, user.token);
    if (res == "ok") {
      getData();
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
      groupId: "",
    });
  };
  const deleteHandler = async (userId) => {
    const res = await deleteRequest(userId, user.token);
    if (res == "ok") {
      getData();
    }
  };
  return (
    <div className="req_card">
      <Link to={`/profile/${userr._id}`}>
        <img src={userr.picture} alt="" />
      </Link>
      <div className="req_name">
        {userr.first_name} {userr.last_name}
      </div>
      {type === "sent" ? (
        <button
          className="blue_btn"
          onClick={() => cancelRequestHandler(userr._id)}
        >
          Cancel Request
        </button>
      ) : type === "request" ? (
        <>
          <button
            className="blue_btn"
            onClick={() => confirmHandler(userr._id)}
          >
            Confirm
          </button>
          <button className="gray_btn" onClick={() => deleteHandler(userr._id)}>
            Delete
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
