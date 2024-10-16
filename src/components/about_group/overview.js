import { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
export default function Overview({
  dataPageGroup,
  idGroup,
  reports,
  setTab,
  pendingPosts,
}) {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <div className="profile_card" style={{ maxWidth: "470px" }}>
        <div className="profile_card_header" style={{ fontWeight: "500" }}>
          To review
        </div>
        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        <Link
          onClick={() => setTab("Manage")}
          to={`/group/${idGroup}/memberReported`}
          className="mmenu_item hover3"
        >
          <div
            className="small_circle"
            style={{
              background: "#FB724B",
            }}
          >
            <img
              src={
                "https://static.xx.fbcdn.net/rsrc.php/v3/y_/r/dyUE00V7yM0.png"
              }
              alt=""
            />
          </div>
          <span style={{ fontSize: "16px" }}>Member-reported content</span>

          <div
            className="rArrow"
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <p style={{ fontSize: "20px", marginRight: "10px" }}>
              {reports?.length}
            </p>
            <i className="right_icon"></i>
          </div>
        </Link>
        <Link
          onClick={() => setTab("Manage")}
          to={`/group/${idGroup}/pendingPost`}
          className="mmenu_item hover3"
        >
          <div
            className="small_circle"
            style={{
              background: "#54C7EC",
            }}
          >
            <img
              src={
                "https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/SKGh9nTtBca.png"
              }
              alt=""
            />
          </div>
          <span style={{ fontSize: "16px" }}>Pending posts</span>

          <div
            className="rArrow"
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <p style={{ fontSize: "20px", marginRight: "10px" }}>
              {pendingPosts?.length}
            </p>
            <i className="right_icon"></i>
          </div>
        </Link>
        <Link
          onClick={() => setTab("Manage")}
          to={`/group/${idGroup}/memberRequests`}
          className="mmenu_item hover3"
        >
          <div
            className="small_circle"
            style={{
              background: "#45BD62",
            }}
          >
            <img
              src={
                "https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/cPVVi0CPFhD.png"
              }
              alt=""
            />
          </div>
          <span style={{ fontSize: "16px" }}>Member requests</span>

          <div
            className="rArrow"
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <p style={{ fontSize: "20px", marginRight: "10px" }}>
              {dataPageGroup?.pendingMembers?.length}
            </p>
            <i className="right_icon"></i>
          </div>
        </Link>
        <Link
          onClick={() => setTab("Manage")}
          to={`/group/${idGroup}/moderationAlerts`}
          className="mmenu_item hover3"
        >
          <div
            className="small_circle"
            style={{
              background: "#F7B928",
            }}
          >
            <img
              src={
                "https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/9VvqLPfGC0H.png"
              }
              alt=""
            />
          </div>
          <span style={{ fontSize: "16px" }}>Moderation alerts</span>

          <div
            className="rArrow"
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <p style={{ fontSize: "20px", marginRight: "10px" }}>0</p>
            <i className="right_icon"></i>
          </div>
        </Link>
      </div>

      <div className="profile_card" style={{ maxWidth: "470px" }}>
        <div className="profile_card_header" style={{ fontWeight: "500" }}>
          About this group
        </div>
        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        {dataPageGroup.description && (
          <>
            <p>{dataPageGroup.description}</p>
          </>
        )}
        {dataPageGroup.public ? (
          <>
            {" "}
            <h3>
              <i className="lock_icon"></i> Private
            </h3>{" "}
            Only members can see who's in the group and what they post.{" "}
          </>
        ) : (
          <>
            <h3>
              <i className="lock_icon"></i> Private
            </h3>{" "}
            Only members can see who's in the group and what they post.
          </>
        )}
        {dataPageGroup.hidden ? (
          <>
            {" "}
            <i className="clock_eye_icon"></i>
            <h3>Hidden</h3> Only members can find this group.{" "}
          </>
        ) : (
          <>
            <h3>
              <i className="open_eye_icon"></i> Visible
            </h3>{" "}
            Anyone can find this group.
          </>
        )}
      </div>
      <div className="profile_card" style={{ maxWidth: "470px" }}>
        <div className="profile_card_header" style={{ fontWeight: "500" }}>
          Members . {dataPageGroup.numMembers}
        </div>
        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        <div className="pagegroupe_friend_imgs" style={{ marginTop: "20px" }}>
          {dataPageGroup.adminMembers &&
            dataPageGroup.adminMembers.slice(0, 20).map((user, i) => (
              <Link to={`/profile/${user.user._id}`} key={i}>
                <img
                  src={user.user.picture}
                  alt=""
                  style={{
                    transform: `translateX(${-i * 7}px)`,
                    zIndex: `${i}`,
                  }}
                />
              </Link>
            ))}
        </div>
        {dataPageGroup.adminMembers &&
        dataPageGroup.adminMembers.length === 1 ? (
          <>
            {" "}
            {dataPageGroup.adminMembers[0].user.first_name}{" "}
            {dataPageGroup.adminMembers[0].user.last_name} is admin.
          </>
        ) : (
          <>
            {dataPageGroup.adminMembers &&
            dataPageGroup.adminMembers.length > 0 ? (
              <>
                {dataPageGroup.adminMembers[0].user.first_name}{" "}
                {dataPageGroup.adminMembers[0].user.last_name} and{" "}
                {dataPageGroup.adminMembers.length - 1} other members are
                admins.
              </>
            ) : (
              <div className="sekelton_loader">
                <HashLoader color="#1876f2" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
