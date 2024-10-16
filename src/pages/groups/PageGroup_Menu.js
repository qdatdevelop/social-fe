import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Dots } from "../../svg";
const medias = ["media"];
export default function PageGroup_Menu({
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
          Discussion
        </Link>
        <Link
          to={`/group/${idGroup}/members`}
          className={sk === "members" ? "profile_menu_active" : "hover1"}
        >
          Members
        </Link>
        <Link
          to={`/group/${idGroup}/media`}
          className={medias.includes(sk) ? "profile_menu_active" : "hover1"}
        >
          Media
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
