import { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
export default function AboutDetail({ dataPageGroup, idGroup }) {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <div className="profile_card">
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
              <i className="public_group_icon"></i> Public
            </h3>{" "}
            Anyone can see who's in the group and what they post.
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
            <h3>
              {" "}
              <i className="clock_eye_icon"></i> Hidden
            </h3>{" "}
            Only members can find this group.{" "}
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
      <div className="profile_card">
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
