import Moment from "react-moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Dots, Public } from "../../svg";
import CreateCommentsInComment from "./CreateCommentInComment";
import { createNotification } from "../../functions/notification";
import CommentMenu from "./CommentMenu";
import {
  getCommentInComment,
  getReactsComment,
  reactComment,
} from "../../functions/comment";
import ReactsPopup from "./ReactsPopup";
export default function Comment_detail({
  comment,
  user,
  socket,
  post,
  setVisiblePost,
  visiblePost,
  commentId,
  setVisibleReactComment,
  group,
  idgroup,
  setReportGroup,
  setReport,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [comments, setComments] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const [count, setCount] = useState(0);
  const [check, setCheck] = useState();
  const [reacts, setReacts] = useState();
  const [total, setTotal] = useState(0);
  const [checkSaved, setCheckSaved] = useState();
  const [loading, setLoading] = useState(false);
  const [showMenuComment, setShowMenuComment] = useState(false);
  const handleLinkClick = (link) => {
    // Reload the current page
    window.location.replace(link);
  };
  const handleReplyClick = () => {
    setCount((prev) => prev + 20);
    setIsReplying((prevIsReplying) => !prevIsReplying);
  };

  useEffect(() => {
    getComments();
  }, [comment]);

  const getComments = async () => {
    const res = await getCommentInComment(comment._id, user.token);
    setComments(res);
  };

  useEffect(() => {
    getCommentReacts();
  }, [comment]);

  const getCommentReacts = async () => {
    const res = await getReactsComment(comment._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };

  const reactHandler = async (type) => {
    reactComment(comment._id, type, user.token);
    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        const updatedReacts = [...reacts];
        updatedReacts[index].count--;
        setReacts(updatedReacts);
        setTotal((prev) => prev - 1);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        // Tìm thấy một phản ứng giống với `type`, cập nhật nó
        const updatedReacts = [...reacts];
        updatedReacts[index].count++;
        setReacts(updatedReacts);
        setTotal((prev) => prev + 1);
        if (user.id !== comment.commentBy._id) {
          if (!group.includes(post.type)) {
            const newNotification = await createNotification(
              comment.commentBy._id,
              type,
              post._id,
              comment._id,
              `/profile/${post.user._id}?post_id=${post._id}&comment_id=${comment._id}`,
              ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your comment.`,
              user.token,
              null
            );

            socket.emit("sendNotification", {
              senderId: user.id,
              sender_first_name: user.first_name,
              sender_last_name: user.last_name,
              sender_picture: user.picture,
              receiverId: comment.commentBy._id,
              type: type,
              postId: post._id,
              commentId: comment._id,
              link: `/profile/${post.user._id}?post_id=${post._id}&comment_id=${comment._id}`,
              description: ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your comment.`,
              id: newNotification.newnotification._id,
              createdAt: newNotification.newnotification.createdAt,
              groupId: "",
            });
          } else {
            const newNotification = await createNotification(
              comment.commentBy._id,
              type,
              post._id,
              comment._id,
              `/group/${post?.group._id}?post_id=${post._id}&comment_id=${comment._id}`,
              ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your comment in group <b>${post?.group.group_name}</b>.`,
              user.token,
              post?.group._id
            );

            socket.emit("sendNotification", {
              senderId: user.id,
              sender_first_name: user.first_name,
              sender_last_name: user.last_name,
              sender_picture: user.picture,
              receiverId: comment.commentBy._id,
              type: type,
              postId: post._id,
              commentId: comment._id,
              link: `/group/${post?.group._id}?post_id=${post._id}&comment_id=${comment._id}`,
              description: ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your comment in group <b>${post?.group.group_name}</b>.`,
              id: newNotification.newnotification._id,
              createdAt: newNotification.newnotification.createdAt,
              groupId: post?.group._id,
            });
          }
        }
      }
      if (index1 !== -1) {
        // Tìm thấy một phản ứng giống với `check`, cập nhật nó
        const updatedReacts = [...reacts];
        updatedReacts[index1].count--;
        setReacts(updatedReacts);
        setTotal((prev) => prev - 1);
      }
    }
  };
  return (
    <>
      <div className="comment" id={`comment-${comment._id}`}>
        <div
          onClick={() => handleLinkClick(`/profile/${comment.commentBy._id}`)}
          style={{ cursor: "pointer" }}
        >
          <img src={comment.commentBy.picture} alt="" className="comment_img" />
        </div>

        <div
          className="comment_col"
          onMouseOver={() => {
            setTimeout(() => {
              setVisibleComment(true);
            });
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisibleComment(false);
            });
          }}
        >
          <div className="comment_react_wrap">
            <div
              className={`${
                commentId === comment._id
                  ? "comment_wrap_active"
                  : "comment_wrap"
              }`}
            >
              <div
                onClick={() =>
                  handleLinkClick(`/profile/${comment.commentBy._id}`)
                }
                className="hover6"
                style={{ cursor: "pointer" }}
              >
                <div className="comment_name hover6 ">
                  <p style={{ fontSize: "13px", fontWeight: "600" }}>
                    {comment.commentBy.first_name} {comment.commentBy.last_name}
                  </p>
                </div>
              </div>
              <div className="comment_text">
                {comment.commentRef && (
                  <div
                    onClick={() =>
                      handleLinkClick(
                        `/profile/${comment.commentRef.commentBy._id}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                    className="hover6"
                  >
                    <p style={{ fontSize: "15px", fontWeight: "600" }}>
                      {comment.commentRef.commentBy.first_name}{" "}
                      {comment.commentRef.commentBy.last_name}
                    </p>
                  </div>
                )}{" "}
                <p style={{ fontSize: "15px" }}> {comment.comment}</p>
              </div>
            </div>

            {!comment.image && (
              <>
                {total > 0 && (
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
                    <div className="reacts_count_num">{total > 1 && total}</div>
                  </div>
                )}
              </>
            )}
            {visibleComment && (
              <>
                <div className="menu_comment">
                  <div
                    className="post_comment hover4"
                    onClick={() => setShowMenuComment((prev) => !prev)}
                  >
                    <Dots color="#828387" />
                  </div>
                </div>
                {showMenuComment && (
                  <CommentMenu
                    idgroup={idgroup}
                    setReportGroup={setReportGroup}
                    idcomment={comment._id}
                    idpost={post._id}
                    setReport={setReport}
                  />
                )}
              </>
            )}
          </div>

          {comment.image && (
            <>
              <div className="comment_react_wrap">
                <div className="img_wrap">
                  <img src={comment.image} alt="" className="comment_image" />
                </div>

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
                                className="react"
                                src={`../../../reacts/${react.react}.svg`}
                                alt=""
                                key={i}
                                onClick={() =>
                                  setVisibleReactComment(comment._id)
                                }
                              />
                            )
                        )}
                  </div>
                  <div className="reacts_count_num">{total > 1 && total}</div>
                </div>
              </div>
            </>
          )}

          <div className="comment_actions">
            <ReactsPopup
              visible={visible}
              setVisible={setVisible}
              reactHandler={reactHandler}
            />
            <div
              className="post_action_comment"
              onMouseOver={() => {
                setTimeout(() => {
                  setVisible(true);
                }, 500);
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setVisible(false);
                }, 500);
              }}
              onClick={() => reactHandler(check ? check : "Like")}
            >
              <span
                style={{
                  color: `
          
          ${
            check === "Like"
              ? "#4267b2"
              : check === "Love"
              ? "#f63459"
              : check === "Haha"
              ? "#f7b125"
              : check === "Sad"
              ? "#f7b125"
              : check === "Wow"
              ? "#f7b125"
              : check === "Angry"
              ? "#e4605a"
              : ""
          }
          `,
                }}
              >
                {check ? check : "Like"}
              </span>
            </div>
            <div className="post_action_comment">
              <span onClick={handleReplyClick}>Reply</span>
            </div>

            <span>
              <Moment fromNow interval={30}>
                {comment.commentAt}
              </Moment>
            </span>
          </div>
        </div>
      </div>
      <div className="commentIncomment">
        {!loading && (
          <>
            {comments &&
              comments
                .sort((a, b) => {
                  return new Date(b.commentAt) - new Date(a.commentAt);
                })
                .slice(0, comments.length)
                .map((comment, i) => (
                  <Comment_detail
                    group={group}
                    comment={comment}
                    user={user}
                    key={i}
                    socket={socket}
                    post={post}
                    setVisiblePost={setVisiblePost}
                    visiblePost={visiblePost}
                    commentId={visiblePost?.commentId}
                    setVisibleReactComment={setVisibleReactComment}
                    idgroup={idgroup}
                    setReportGroup={setReportGroup}
                  />
                ))}
          </>
        )}
      </div>
      <div className="commentIncomment">
        {isReplying && (
          <CreateCommentsInComment
            group={group}
            user={user}
            comment={comment}
            setComments={setComments}
            setCount={setCount}
            setLoading={setLoading}
            loading={loading}
            socket={socket}
            post={post}
          />
        )}
      </div>
    </>
  );
}
