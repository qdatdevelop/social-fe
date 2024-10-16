import { acceptInvite, deleteInvite } from "../../functions/group";
import { Link } from "react-router-dom";
import { createNotification } from "../../functions/notification";
export default function InviteGroups({
  user,
  dataFriend,
  getDataFriend,
  socket,
  getGroups,
  getDiscoverGroups,
}) {
  const confirmHandler = async (idgroup, requestId, userId) => {
    const res = await acceptInvite(idgroup, requestId, user.token);
    if (res == "ok") {
      getDataFriend();
      getGroups();
      getDiscoverGroups();
    }
    const newNotification = await createNotification(
      userId,
      "acceptRequest",
      null,
      null,
      `/profile/${user.id}`,
      ` <b>${user.first_name} ${user.last_name}</b> accepted your invite to group.`,
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
      description: ` <b>${user.first_name} ${user.last_name}</b> accepted your invite to group.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
      groupId: "",
    });
  };
  const deleteHandler = async (requestId) => {
    const res = await deleteInvite(requestId, user.token);
    if (res == "ok") {
      getDataFriend();
    }
  };
  return (
    <>
      {dataFriend.requests_group?.length > 0 &&
        dataFriend.requests_group.map((group) => (
          <>
            {!group?.hide && (
              <>
                {" "}
                <div
                  className="contact hover3"
                  style={{
                    width: "362px",
                    backgroundColor: "var(--bg-primary)",
                    cursor: "auto",
                    border: "1px solid rgb(204, 204, 204)",
                  }}
                >
                  <div
                    className="circle_icon_notification"
                    style={{ marginBottom: "22px", marginLeft: "5px" }}
                  >
                    <div
                      className="req_card_pagegroup"
                      style={{ background: "#F0F2F5" }}
                    >
                      <div className="content_head_pagegroup ">
                        <Link to={`/group/${group.groupRef?._id}`}>
                          <img src={group.groupRef?.cover} alt="" />
                        </Link>
                      </div>
                    </div>
                    <div className="right_bottom_notification_group">
                      <img src={group.senderRef?.picture} alt="" />
                    </div>
                  </div>

                  <div className="body_requests">
                    <div className="name_requests">
                      <p>
                        <Link
                          className="hover6"
                          to={`/profile/${group.senderRef?._id}`}
                        >
                          {group.senderRef.first_name}{" "}
                          {group.senderRef.last_name}
                        </Link>
                        <span style={{ fontWeight: "300" }}>invite you to</span>
                        <Link
                          className="hover6"
                          to={`/group/${group.groupRef?._id}`}
                        >
                          {group.groupRef.group_name}
                        </Link>
                      </p>
                    </div>

                    <div className="button_requests">
                      <button
                        className="blue_btn_requests"
                        onClick={() =>
                          confirmHandler(
                            group?.groupRef._id,
                            group?._id,
                            group?.senderRef._id
                          )
                        }
                      >
                        Confirm
                      </button>
                      <button
                        className="gray_btn_requests"
                        style={{ boxShadow: "1px 1px 1px var(--shadow-1)" }}
                        onClick={() => deleteHandler(group?._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ))}
    </>
  );
}
