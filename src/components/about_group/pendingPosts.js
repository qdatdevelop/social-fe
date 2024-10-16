import { useEffect, useState } from "react";
import "./style.css";
import { Dots, Public } from "../../svg";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { approvependingposts, refusependingposts } from "../../functions/group";
export default function PendingPosts({
  dataPageGroup,
  idGroup,
  PageGroupLoading,
  getPageGroup,
  pendingPosts,
  getPendingPosts
}) {
  const { user } = useSelector((state) => ({ ...state }));

  const RefusePendingPosts = async (idPost) => {
    await refusependingposts(idPost, user.token);
    getPendingPosts();
    getPageGroup();
  };
  const ApprovePendingPosts = async (idPost) => {
    await approvependingposts(idPost, user.token);
    getPendingPosts();
    getPageGroup();
  };
  console.log(pendingPosts);
  return (
    <>
      {PageGroupLoading ? (
        <div className="sekelton_loader">
          <HashLoader color="#1876f2" />
        </div>
      ) : (
        <>
          {pendingPosts?.length === 0 || !pendingPosts ?  (
            <>
              {" "}
              <div className="No_results">
                <p>No request post approval to show</p>
              </div>
            </>
          ) : (
            <>
              {pendingPosts?.map((post, i) => (
                <div className="profile_card">
                  <>
                    <div className="posts">
                      <div className="post">
                        <div className="post_header" id={`post-${post._id}`}>
                          <div className="post_header_left">
                            <Link to={`/profile/${post.user._id}`}>
                              <img src={post.user.picture} alt="" />
                            </Link>

                            <div className="header_col">
                              <div className="post_profile_name">
                                <>
                                  <Link
                                    to={`/profile/${post.user._id}`}
                                    className="hover6"
                                  >
                                    {post.user.first_name} {post.user.last_name}
                                  </Link>
                                </>
                              </div>
                              <div className="post_profile_privacy_date">
                                <Moment fromNow interval={30}>
                                  {post.createdAt}
                                </Moment>
                                . <Public color="#828387" />
                              </div>
                            </div>
                          </div>
                          <div
                            className="post_header_right hover1"
                            // onClick={() => setShowMenu((prev) => !prev)}
                          >
                            <Dots color="#828387" />
                          </div>
                        </div>
                        {post.background ? (
                          <div
                            className="post_bg"
                            style={{
                              backgroundImage: `url(${post.background})`,
                            }}
                          >
                            <div className="post_bg_text">{post.text}</div>
                          </div>
                        ) : (
                          post.type === null ||
                          (post.type === "pending" && (
                            <>
                              <div className="post_text">{post.text}</div>
                              {post.images && post.images.length && (
                                <div
                                  className={
                                    post.images.length === 1
                                      ? "grid_1"
                                      : post.images.length === 2
                                      ? "grid_2"
                                      : post.images.length === 3
                                      ? "grid_3"
                                      : post.images.length === 4
                                      ? "grid_4"
                                      : post.images.length >= 5 && "grid_5"
                                  }
                                >
                                  {post.images.slice(0, 5).map((image, i) => (
                                    <img src={image.url} key={i} alt="" />

                                    // className={`img-${i}`}
                                  ))}
                                  {post.images.length > 5 && (
                                    <div className="more-pics-shadow">
                                      +{post.images.length - 5}
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          ))
                        )}
                      </div>
                    </div>
                  </>

                  <div className="mmenu_splitter"></div>
                  <div className="menu_button_report">
                    <div
                      className="blue_btn"
                      style={{ width: "330px" }}
                      onClick={() => ApprovePendingPosts(post._id)}
                    >
                      <span>Approve</span>
                    </div>

                    <div
                      className="gray_btn"
                      style={{ width: "330px" }}
                      onClick={() => RefusePendingPosts(post._id)}
                    >
                      <span>Refuse</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}
