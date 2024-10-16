import { acceptInvite, deleteInvite } from "../../../functions/group";
import { Link } from "react-router-dom";
import { createNotification } from "../../../functions/notification";
import { useEffect, useReducer, useState } from "react";
export default function InviteGroup({
  user,
  dataFriend,
  getDataFriend,
  socket,
}) {
  const confirmHandler = async (idgroup, requestId, userId) => {
    const res = await acceptInvite(idgroup, requestId, user.token);
    if (res == "ok") {
      getDataFriend();
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
      {dataFriend.requests_group?.length > 0 && (
        <>
          <div className="contact hover3">
            <div className="circle_icon_notification">
              <div
                className="req_card_pagegroup"
                style={{ background: "#F0F2F5" }}
              >
                <div className="content_head_pagegroup">
                  <Link
                    to={`/group/${dataFriend.requests_group[0]?.groupRef._id}`}
                  >
                    <img
                      src={dataFriend.requests_group[0]?.groupRef.cover}
                      alt=""
                    />
                  </Link>
                </div>
              </div>
              <div className="right_bottom_notification_group">
                <img
                  src={dataFriend.requests_group[0]?.senderRef.picture}
                  alt=""
                />
              </div>
            </div>

            <div className="body_requests">
              <div className="name_requests">
                <p>
                  <Link
                    to={`/profile/${dataFriend.requests_group[0]?.senderRef._id}`}
                    className="hover6"
                  >
                    {dataFriend.requests_group[0]?.senderRef.first_name}{" "}
                    {dataFriend.requests_group[0]?.senderRef.last_name}
                  </Link>
                  <span style={{ fontWeight: "300" }}>invite you to</span>
                  <Link
                    to={`/group/${dataFriend.requests_group[0]?.groupRef._id}`}
                    className="hover6"
                  >
                    {dataFriend.requests_group[0]?.groupRef.group_name}
                  </Link>
                </p>
              </div>

              <div className="button_requests">
                <button
                  className="blue_btn_requests"
                  onClick={() =>
                    confirmHandler(
                      dataFriend.requests_group[0]?.groupRef._id,
                      dataFriend.requests_group[0]?._id,
                      dataFriend.requests_group[0]?.senderRef._id
                    )
                  }
                >
                  Confirm
                </button>
                <button
                  className="gray_btn_requests"
                  onClick={() =>
                    deleteHandler(dataFriend.requests_group[0]?._id)
                  }
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
