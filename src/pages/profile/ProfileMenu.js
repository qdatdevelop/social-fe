import { Link, useNavigate, useParams } from "react-router-dom";
import { Dots } from "../../svg";
import { useState } from "react";
const aboutSections = [
  "about",
  "about_overview",
  "about_work_and_education",
  "about_places",
  "about_contact_and_basic_info",
  "about_family_and_relationships",
  "about_details",
  "about_life_events",
];
const friendSections = [
  "friends",
  "friends_all",
  "friends_with_upcoming_birthdays",
  "friends_mutual",
];
const photoSections = ["photos", "photos_by", "photos_albums"];

export default function ProfileMenu({
  idUser,
  setReport_Profile,
  user,
  profileMenuDots,
  setProfileMenuDots,
}) {
  const { sk } = useParams();

  return (
    <div className="profile_menu_wrap">
      <div className="profile_menu">
        <Link
          to={idUser ? `/profile/${idUser}` : "/profile"}
          className={sk === undefined ? "profile_menu_active" : "hover1"}
        >
          Posts
        </Link>
        <Link
          to={idUser ? `/profile/${idUser}&sk=about` : "/profile&sk=about"}
          className={
            aboutSections.includes(sk) ? "profile_menu_active" : "hover1"
          }
        >
          About
        </Link>
        <Link
          to={idUser ? `/profile/${idUser}&sk=friends` : "/profile&sk=friends"}
          className={
            friendSections.includes(sk) ? "profile_menu_active" : "hover1"
          }
        >
          Friends
        </Link>
        <Link
          to={idUser ? `/profile/${idUser}&sk=photos` : "/profile&sk=photos"}
          className={
            photoSections.includes(sk) ? "profile_menu_active" : "hover1"
          }
        >
          Photos
        </Link>
        <div
          className="p10_dots"
          style={{ cursor: "pointer" }}
          onClick={() => setProfileMenuDots((prev) => !prev)}
        >
          <Dots />
        </div>
      </div>
      {profileMenuDots && idUser !== user.id && (
        <div
          className="open_cover_menu"
          style={{
            boxShadow: "2px 2px 2px var(--shadow-1)",
            border: "1px solid rgb(204, 204, 204)",
            marginTop: "5px",
            marginRight: "5px",
          }}
        >
          <div
            className="open_cover_menu_item hover1"
            onClick={() =>
              setReport_Profile({
                postId: null,
                groupId: null,
                commentId: null,
                userReportedRef: idUser,
                groupReportedRef: null,
              })
            }
          >
            <i className="report"></i>
            Report profile
          </div>
        </div>
      )}
    </div>
  );
}
