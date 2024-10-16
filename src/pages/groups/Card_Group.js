import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dots } from "../../svg";
import { followgroup, unfollowgroup, leavegroup } from "../../functions/group";
export default function Card_Group({ group, getGroups, User, getUserData }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [groupsMenuDots, setGroupsMenuDots] = useState(false);
  const follow = User?.groups_following.includes(group?._id);
  const setfollowgroup = async () => {
    const res = await followgroup(group?._id, user.token);
    if (res == "ok") {
      getGroups();
      getUserData();
    }
  };
  const setunfollowgroup = async () => {
    const res = await unfollowgroup(group?._id, user.token);
    if (res == "ok") {
      getGroups();
      getUserData();
    }
  };
  const setleavegroup = async () => {
    const res = await leavegroup(group?._id, user.token);
    if (res == "ok") {
      getGroups();
      getUserData();
    }
  };
  return (
    <div className="req_card_group">
      <div className="group_content" style={{ position: "relative" }}>
        <div className="content_head">
          <Link to={`/group/${group._id}`}>
            <img src={group.cover} alt="" />
          </Link>
          <div>
            <Link
              to={`/group/${group._id}`}
              className="req_name hover6"
              style={{ cursor: "pointer" }}
            >
              {group.group_name}
            </Link>
            <div className="post_profile_privacy_date">
              <p>{group?.numMembers} members</p>
            </div>
          </div>
        </div>
        <div className="content_bottom">
          <Link
            to={`/group/${group._id}`}
            className="light_blue_btn hover5"
            style={{ marginTop: "10px", width: "304px" }}
          >
            <p style={{ color: "#0567D2" }}>View group</p>
          </Link>
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
            {follow ? (
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
      </div>
    </div>
  );
}
