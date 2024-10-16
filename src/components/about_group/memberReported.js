import { useEffect, useState } from "react";
import "./style.css";
import { Dots, Public } from "../../svg";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { keepReport, removeReport } from "../../functions/report";
export default function MemberReported({
  dataPageGroup,
  idGroup,
  loadingReports,
  reports,
  reportsToGroup,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const handleLinkClick = (link) => {
    // Reload the current page
    window.location.replace(link);
  };

  const functionkeepReport = async (idReport) => {
    await keepReport(idReport, user.token);
    reportsToGroup();
  };
  const functionremoveReport = async (idReport, postRef, commentRef) => {
    await removeReport(idReport, postRef, commentRef, user.token);
    reportsToGroup();
  };
  console.log(reports);
  return (
    <>
      {loadingReports ? (
        <div className="sekelton_loader">
          <HashLoader color="#1876f2" />
        </div>
      ) : (
        <>
          {reports.length === 0 ? (
            <>
              {" "}
              <div className="No_results">
                <p>No reports to show</p>
              </div>
            </>
          ) : (
            <>
              {reports.map((report, i) => (
                <div className="profile_card">
                  <div>
                    <p></p>
                    <p>
                      <Link
                        to={`/profile/${report.userRef._id}`}
                        className="hover6"
                      >
                        {report.userRef.first_name} {report.userRef.last_name}{" "}
                      </Link>
                      {report.postRef && !report.commentRef && (
                        <>
                          {" "}
                          <span style={{ fontWeight: "300" }}>
                            {" "}
                            reported this post for
                          </span>
                        </>
                      )}
                      {report.commentRef && (
                        <>
                          {" "}
                          <span style={{ fontWeight: "300" }}>
                            {" "}
                            reported this comment on
                          </span>
                          <Link
                            to={`/group/${idGroup}?post_id=${report.postRef._id}&comment_id=${report.commentRef._id}`}
                            className="hover6"
                            onClick={() =>
                              handleLinkClick(
                                `/group/${idGroup}?post_id=${report.postRef._id}&comment_id=${report.commentRef._id}`
                              )
                            }
                          >
                            {" "}
                            {report.userRef.first_name}'s Post
                          </Link>
                          <span style={{ fontWeight: "300" }}> for</span>
                        </>
                      )}
                      <span style={{ fontWeight: "400" }}>
                        {" "}
                        "{report.type}".
                      </span>
                    </p>
                  </div>
                  <div className="mmenu_splitter"></div>
                  {report.postRef && !report.commentRef && (
                    <>
                      <div className="posts">
                        <div className="post">
                          <div
                            className="post_header"
                            id={`post-${report.postRef._id}`}
                          >
                            <div className="post_header_left">
                              <Link to={`/profile/${report.postRef.user._id}`}>
                                <img src={report.postRef.user.picture} alt="" />
                              </Link>

                              <div className="header_col">
                                <div className="post_profile_name">
                                  <>
                                    <Link
                                      to={`/profile/${report.postRef.user._id}`}
                                      className="hover6"
                                    >
                                      {report.postRef.user.first_name}{" "}
                                      {report.postRef.user.last_name}
                                    </Link>
                                  </>

                                  <div className="updated_p">
                                    {report.postRef.type == "profilePicture" &&
                                      `updated ${
                                        report.postRef.user.gender === "male"
                                          ? "his"
                                          : "her"
                                      } profile picture`}
                                    {report.postRef.type == "coverPicture" &&
                                      `updated ${
                                        report.postRef.user.gender === "male"
                                          ? "his"
                                          : "her"
                                      } cover picture`}
                                    {report.postRef.type ==
                                      "coverPictureGroup" &&
                                      `updated the group cover photo.`}
                                  </div>
                                </div>
                                <div className="post_profile_privacy_date">
                                  <Moment fromNow interval={30}>
                                    {report.postRef.createdAt}
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
                          {report.postRef.background ? (
                            <div
                              className="post_bg"
                              style={{
                                backgroundImage: `url(${report.postRef.background})`,
                              }}
                            >
                              <div className="post_bg_text">
                                {report.postRef.text}
                              </div>
                            </div>
                          ) : report.postRef.type === null ||
                            report.postRef.type === "group" ? (
                            <>
                              <div className="post_text">
                                {report.postRef.text}
                              </div>
                              {report.postRef.images &&
                                report.postRef.images.length && (
                                  <div
                                    className={
                                      report.postRef.images.length === 1
                                        ? "grid_1"
                                        : report.postRef.images.length === 2
                                        ? "grid_2"
                                        : report.postRef.images.length === 3
                                        ? "grid_3"
                                        : report.postRef.images.length === 4
                                        ? "grid_4"
                                        : report.postRef.images.length >= 5 &&
                                          "grid_5"
                                    }
                                  >
                                    {report.postRef.images
                                      .slice(0, 5)
                                      .map((image, i) => (
                                        <img src={image.url} key={i} alt="" />

                                        // className={`img-${i}`}
                                      ))}
                                    {report.postRef.images.length > 5 && (
                                      <div className="more-pics-shadow">
                                        +{report.postRef.images.length - 5}
                                      </div>
                                    )}
                                  </div>
                                )}
                            </>
                          ) : report.postRef.type === "profilePicture" ? (
                            <div className="post_profile_wrap">
                              <div className="post_updated_bg">
                                <img src={report.postRef.user.cover} alt="" />
                              </div>
                              <img
                                src={report.postRef.images[0].url}
                                alt=""
                                className="post_updated_picture"
                              />
                            </div>
                          ) : (
                            <img src={report.postRef.images[0].url} alt="" />
                          )}

                          {/* {showMenu && (
                <PostMenu
                  userId={user.id}
                  postUserId={post.user._id}
                  imagesLength={post?.images?.length}
                  setShowMenu={setShowMenu}
                  postId={post._id}
                  token={user.token}
                  checkSaved={checkSaved}
                  setCheckSaved={setCheckSaved}
                  images={post.images}
                  postRef={postRef}
                  postType={post.type}
                  group={group}
                  setReport={setReport}
                  setReportGroup={setReportGroup}
                  groupId={post?.group?._id}
                />
              )} */}
                        </div>
                      </div>
                    </>
                  )}
                  {report.commentRef && (
                    <>
                      <div
                        className="comment"
                        style={{ marginBottom: "10px", marginTop: "10px" }}
                      >
                        <Link
                          to={`/profile/${report.commentRef.commentBy._id}`}
                        >
                          <img
                            src={report.commentRef.commentBy.picture}
                            alt=""
                            className="comment_img"
                          />
                        </Link>
                        <div className="comment_col">
                          <div className="comment_react_wrap">
                            <div className="comment_wrap">
                              <Link
                                to={`/profile/${report.commentRef.commentBy._id}`}
                              >
                                <div className="comment_name hover6">
                                  <b>
                                    {report.commentRef.commentBy.first_name}{" "}
                                    {report.commentRef.commentBy.last_name}
                                  </b>
                                </div>
                              </Link>
                              <div className="comment_text">
                                {report.commentRef.commentRef && (
                                  <Link
                                    to={`/profile/${report.commentRef.commentRef.commentBy._id}`}
                                    className="hover6"
                                  >
                                    <b>
                                      {
                                        report.commentRef.commentRef.commentBy
                                          .first_name
                                      }{" "}
                                      {
                                        report.commentRef.commentRef.commentBy
                                          .last_name
                                      }
                                    </b>
                                  </Link>
                                )}{" "}
                                {report.commentRef.comment}
                              </div>
                            </div>

                            {/* {!report.commentRef.image && (
                            <div className="reacts_count_comment">
                              <div className="reacts_count_imgs">
                                {reacts &&
                                  reacts
                                    .sort((a, b) => {
                                      return b.count - a.count;
                                    })
                                    .slice(0, 3)
                                    .map(
                                      (react, i) =>
                                        react.count > 0 && (
                                          <img
                                            style={{
                                              position: "relative",
                                              right: `${i * 2}px`,
                                            }}
                                            src={`../../../reacts/${react.react}.svg`}
                                            alt=""
                                            key={i}
                                            onClick={() =>
                                              setVisibleReactComment(
                                                comment._id,
                                                user.token
                                              )
                                            }
                                          />
                                        )
                                    )}
                              </div>
                              <div className="reacts_count_num">
                                {total > 1 && total}
                              </div>
                            </div>
                          )} */}
                          </div>

                          {report.commentRef.image && (
                            <>
                              <div className="comment_react_wrap">
                                <div className="img_wrap">
                                  <img
                                    src={report.commentRef.image}
                                    alt=""
                                    className="comment_image"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mmenu_splitter"></div>
                  <div className="menu_button_report">
                    <div
                      className="gray_btn"
                      style={{ width: "330px" }}
                      onClick={() => functionkeepReport(report._id)}
                    >
                      <span>Keep</span>
                    </div>

                    <div
                      className="gray_btn"
                      style={{ width: "330px" }}
                      onClick={() =>
                        report.commentRef
                          ? functionremoveReport(
                              report._id,
                              null,
                              report.commentRef._id,
                              null,
                              null
                            )
                          : functionremoveReport(
                              report._id,
                              report.postRef._id,
                              null,
                              null,
                              null
                            )
                      }
                    >
                      <span>Remove</span>
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
