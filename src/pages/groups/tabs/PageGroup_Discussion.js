import { useEffect, useReducer, useRef, useState } from "react";
import CreatePost from "../../../components/createPost";
import Post from "../../../components/post";
import GridPosts from "../../profile/GridPosts";
import Photos from "../Photos";
import About_group from "../../../components/about_group";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
export default function PageGroup_Discussion({
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
  setVisiblePhoto,  
  setReportGroup,
  setReport
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
          {(member || admin) && (
            <CreatePost user={user} setVisible={setVisible} />
          )}

          {loading ? (
            <div className="sekelton_loader">
              <HashLoader color="#1876f2" />
            </div>
          ) : (
            <div className="posts">
              {dataPageGroup?.posts && dataPageGroup?.posts?.length > 0 ? (
                dataPageGroup?.posts?.map((post) => (
                  <Post
                    post={post}
                    user={user}
                    key={post?._id}
                    dataPageGroup={dataPageGroup}
                    socket={socket}
                    postId={postId}
                    setVisiblePost={setVisiblePost}
                    visibleReact={visibleReact}
                    setVisibleReact={setVisibleReact}
                    commentId={commentId}
                    setVisibleReactComment={setVisibleReactComment}
                    visibleReactComment={visibleReactComment}
                    setVisiblePhoto={setVisiblePhoto}
                    setReportGroup={setReportGroup}
                    setReport={setReport}
                  />
                ))
              ) : (
                <div className="no_posts">No posts available</div>
              )}
            </div>
          )}
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
              <div className="profile_card">
                <div className="profile_card_header">
                  Media
                  <div className="profile_header_link">See all photos</div>
                </div>
                <div className="sekelton_loader">
                  <HashLoader color="#1876f2" />
                </div>
              </div>
            </>
          ) : (
            <>
              <About_group
                dataPageGroup={dataPageGroup}
                detailss={[]}
                visitor={member}
                setOthername={setOthername}
              />
              <Photos
                idGroup={idGroup}
                token={user.token}
                photos={photos}
                setVisiblePhoto={setVisiblePhoto}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
