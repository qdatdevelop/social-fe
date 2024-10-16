import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { joingroup, cancelRequestGroup } from "../../functions/group";
export default function Card_Discover_Group({
  group,
  getDataFriend,
  getGroups,
  getDiscoverGroups,
  user,
}) {
  const joinGroup = async (idgroup) => {
    const res = await joingroup(idgroup, user.token);
    if (res == "ok") {
      getDataFriend();
      getGroups();
      getDiscoverGroups();
    }
  };
  const cancelRequestJoinGroup = async () => {
    const res = await cancelRequestGroup(group?._id, user.token);
    if (res == "ok") {
      getDataFriend();
      getGroups();
      getDiscoverGroups();
    }
  };
  console.log(group);
  const isUserPending = group.pendingMembers?.some(
    (pendingMember) => pendingMember.user === user.id
  );

  return (
    <div
      className="req_card_discover_group"
      style={{ width: "392px", height: "376px" }}
    >
      <Link to={`/group/${group._id}`}>
        <img
          style={{ width: "392px", height: "220px" }}
          src={group.cover}
          alt=""
        />
      </Link>
      <Link
        to={`/group/${group._id}`}
        className="req_name_discover_group hover6"
      >
        {group.group_name}
      </Link>
      <div className="post_profile_privacy_date" style={{ marginLeft: "14px" }}>
        <p>{group?.numMembers} members</p>
      </div>
      {isUserPending ? (
        <>
          <button
            className="gray_btn_requests"
            style={{
              background: "#F0F0F0",
            }}
            onClick={() => cancelRequestJoinGroup()}
          >
            <span>Cancel Request</span>
          </button>
        </>
      ) : (
        <>
          {" "}
          <button className="gray_btn" onClick={() => joinGroup(group._id)}>
            Join group
          </button>
        </>
      )}
    </div>
  );
}
