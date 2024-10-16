import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Dots } from "../../svg";
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
const medias = ["media"];
const photoSections = ["photos", "photos_by", "photos_albums"];

export default function PageGroup_Menu_Private({
  idGroup,
  setReport
}) {
  const { sk } = useParams();
  const [groupsMenuDots, setGroupsMenuDots] = useState(false);
  return (
    <div className="pagegroupe_menu_wrap">
      <div className="pagegroupe_menu">
        <Link
          to={`/group/${idGroup}`}
          className={sk === undefined ? "profile_menu_active" : "hover1"}
        >
          About
        </Link>

        <Link
          to={`/group/${idGroup}/discussion/preview`}
          className={sk === "discussion" ? "profile_menu_active" : "hover1"}
        >
          Discussion
        </Link>

        <div
          className="p10_dots"
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
            marginTop: "5px",
            marginRight: "5px",
          }}
          onClick={() =>
            setReport({
              postId: null,
              groupId: null,
              commentId: null,
              userReportedRef: null,
              groupReportedRef: idGroup,
            })
          }
        >
          <div className="open_cover_menu_item hover1">
            <i className="report"></i>
            Report group
          </div>
        </div>
      )}
    </div>
  );
}
