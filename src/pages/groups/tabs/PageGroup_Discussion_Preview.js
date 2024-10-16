import { useEffect, useReducer, useRef, useState } from "react";
import CreatePost from "../../../components/createPost";
import Post from "../../../components/post";
import GridPosts from "../../profile/GridPosts";
import Photos from "../../profile/Photos";
import About_group from "../../../components/about_group";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
export default function PageGroup_Discussion_Preview({
  dataPageGroup,
  loading,
  member,
  admin,
  setOthername,
  idGroup,
  photos,
  setVisible,
  profileTop,
  socket,
  setVisiblePost,
  visibleReact,
  setVisibleReact,
  commentId,
  postId,
  setVisibleReactComment,
  visibleReactComment,
}) {
  const [height, setHeight] = useState();
  const [rightHeight, setRigthHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();
  const { user } = useSelector((state) => ({ ...state }));

  const rightSide = useRef(null);
  const check = useMediaQuery({
    query: "(min-width:901px)",
  });
  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300);
    console.log(profileTop.current.clientHeigh);
    setRigthHeight(rightSide.current.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [loading, scrollHeight]);
  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };
  return (
    <>
      <div className="pagegroup_grid">
        <div className="pagegroup_left">
          {" "}
          <div className="profile_card">
            <div className="private_discussion">
              <img
                src="https://www.facebook.com/images/comet/empty_states_icons/permissions/permissions_gray_wash.svg"
                alt=""
                width="112px"
                height="112px"
              />
              <h3>This group is private</h3>
              <p>Join this group to view or participate in discussions.</p>
            </div>
          </div>
        </div>

        <div className="pagegroupe_right" ref={rightSide}>
          {loading ? (
            <>
              <div className="profile_card">
                <div className="profile_card_header">About</div>
                <div className="sekelton_loader">
                  <HashLoader color="#1876f2" />
                </div>
              </div>
            </>
          ) : (
            <>
              <About_group
                idGroup={idGroup}
                dataPageGroup={dataPageGroup}
                detailss={[]}
                visitor={member}
                setOthername={setOthername}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
