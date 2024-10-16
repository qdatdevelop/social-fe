import { Link } from "react-router-dom";
import "./style.css";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useRef, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReactsPost, reactPost } from "../../functions/post";
import { createNotification } from "../../functions/notification";
import Comment_detail from "./Comment_detail";
import { getComment, getCountCommentInPost } from "../../functions/comment";
export default function Post_detail({
  post,
  user,
  socket,
  visiblePost,
  setVisiblePost,
  setVisibleReact,
  commentId,
  setVisibleReactComment,
  visibleReactComment,
  setVisiblePhoto,
  page,
  setReportGroup,
  setReport
}) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [checkSaved, setCheckSaved] = useState();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const popup = useRef(null);
  const postRef = useRef(null);
  const [totalComment, setTotalComment] = useState(0);
  const [comment, setComment] = useState("");
  const group = ["coverPictureGroup", "group"];
  const textRef = useRef(null);
  useEffect(() => {
    getPostReacts();
  }, [post._id]);

  useEffect(() => {
    getPostComments();
    getCountCommentPost();
  }, [post._id, comment]);

  const handleComment = () => {
    // Gọi phương thức focus() trên đối tượng DOM của input
    textRef.current.focus();
  };


  const getCountCommentPost = async () => {
    const res = await getCountCommentInPost(post._id, user.token);
    setTotalComment(res);
  };

  const visibleReeact3 = () => {
    setVisibleReact(post._id);
  };

  const getPostComments = async () => {
    const res = await getComment(post._id, user.token);
    setComments(res);
  };

  const getPostReacts = async () => {
    const res = await getReactsPost(post._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };

  const reactHandler = async (type) => {
    reactPost(post._id, type, user.token);

    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        // const newReacts = [...reacts]; // Tạo một bản sao của mảng reacts
        // newReacts[index] = {
        //   ...newReacts[index],
        //   count: newReacts[index].count - 1,
        // }; // Cập nhật giá trị count trong bản sao
        // setReacts(newReacts); // Cập nhật mảng reacts với bản sao đã cập nhật
        // // setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        // setTotal((prev) => --prev);
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotal((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        // const newReacts = [...reacts]; // Tạo một bản sao của mảng reacts
        // newReacts[index] = {
        //   ...newReacts[index],
        //   count: newReacts[index].count + 1,
        // }; // Cập nhật giá trị count trong bản sao
        // setReacts(newReacts); // Cập nhật mảng reacts với bản sao đã cập nhật
        // // setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        // setTotal((prev) => ++prev);
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotal((prev) => ++prev);
        if (user.id !== post.user._id) {
          if (!group.includes(post.type)) {
            const newNotification = await createNotification(
              post.user._id,
              type,
              post._id,
              null,
              `/profile/${post.user._id}?post_id=${post._id}`,
              ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your post.`,
              user.token,
              null
            );

            socket.emit("sendNotification", {
              senderId: user.id,
              sender_first_name: user.first_name,
              sender_last_name: user.last_name,
              sender_picture: user.picture,
              receiverId: post.user._id,
              type: type,
              postId: post._id,
              commentId: "",
              link: `/profile/${post.user._id}?post_id=${post._id}`,
              description: ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your post.`,
              id: newNotification.newnotification._id,
              createdAt: newNotification.newnotification.createdAt,
              groupId: "",
            });
          } else {
            const newNotification = await createNotification(
              post.user._id,
              type,
              post._id,
              null,
              `/group/${post?.group._id}?post_id=${post._id}`,
              ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your post in group <b>${post?.group.group_name}</b>.`,
              user.token,
              post?.group._id
            );

            socket.emit("sendNotification", {
              senderId: user.id,
              sender_first_name: user.first_name,
              sender_last_name: user.last_name,
              sender_picture: user.picture,
              receiverId: post.user._id,
              type: type,
              postId: post._id,
              commentId: "",
              link: `/group/${post?.group._id}?post_id=${post._id}`,
              description: ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your post in group <b>${post?.group.group_name}</b>.`,
              id: newNotification.newnotification._id,
              createdAt: newNotification.newnotification.createdAt,
              groupId: post?.group._id,
            });
          }
        }
      }
      if (index1 !== -1) {
        // Tìm thấy một phản ứng giống với `check`, cập nhật nó
        // const updatedReacts = [...reacts];
        // updatedReacts[index1].count--;
        // setReacts(updatedReacts);
        // setTotal((prev) => prev - 1);
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
      }
    }
  };
  function scrollToComment(commmentId) {
    const element = document.getElementById(`comment-${commmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }
  if (visiblePost.commentId) {
    // Chờ 2 giây trước khi thực hiện scrollToComment
    setTimeout(function () {
      scrollToComment(visiblePost.commentId);
    }, 2000); // 2000 milliseconds = 2 seconds
  }

  return (
    <div className="blur">
      <div className="post_detail " ref={popup}>
        <div className="box_header">
          <span> {post.user.first_name}'s Post</span>
          <div
            className="small_circle"
            onClick={() => {
              setVisiblePost(null);
            }}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
        <div className="post_content scrollbar">
          <div className="post_header ">
            <div className="post_header_left">
              {group.includes(post.type) && page === "home" ? (
                <>
                  {" "}
                  <div className="circle_icon_notification">
                    <div
                      className="req_card_pagegroup"
                      style={{ background: "#F0F2F5" }}
                    >
                      <div className="content_head_pagegroup">
                        <Link to={`/group/${post.group._id}`}>
                          <img src={post.group.cover} alt="" />
                        </Link>
                      </div>
                    </div>
                    <div className="right_bottom_notification_group">
                      <Link to={`/profile/${post.user._id}`}>
                        <img src={post.user.picture} alt="" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to={`/profile/${post.user._id}`}>
                    <img src={post.user.picture} alt="" />
                  </Link>
                </>
              )}

              <div className="header_col">
                <div className="post_profile_name">
                  {group.includes(post.type) && page === "home" ? (
                    <>
                      <Link to={`/group/${post.group._id}`} className="hover6">
                        {post.group.group_name}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={`/profile/${post.user._id}`} className="hover6">
                        {post.user.first_name} {post.user.last_name}
                      </Link>
                    </>
                  )}

                  <div className="updated_p">
                    {post.type == "profilePicture" &&
                      `updated ${
                        post.user.gender === "male" ? "his" : "her"
                      } profile picture`}
                    {post.type == "coverPicture" &&
                      `updated ${
                        post.user.gender === "male" ? "his" : "her"
                      } cover picture`}
                    {post.type == "coverPictureGroup" &&
                      `updated the group cover photo.`}
                  </div>
                </div>
                <div className="post_profile_privacy_date">
                  {group.includes(post.type) && page === "home" && (
                    <>
                      <Link
                        to={`/profile/${post.user._id}`}
                        className="userPostGroup hover6"
                        style={{
                          color: "#67696D",
                          fontWeight: "600",
                          fontSize: "12px",
                        }}
                      >
                        {post.user.first_name} {post.user.last_name}
                      </Link>
                      .
                    </>
                  )}
                  <Moment fromNow interval={30}>
                    {post.createdAt}
                  </Moment>
                  . <Public color="#828387" />
                </div>
              </div>
            </div>
            <div
              className="post_header_right hover1"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <Dots color="#828387" />
            </div>
          </div>
          {post.background ? (
            <div
              className="post_bg"
              style={{ backgroundImage: `url(${post.background})` }}
            >
              <div className="post_bg_text">{post.text}</div>
            </div>
          ) : post.type === null ? (
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
                    <div onClick={() => setVisiblePhoto(image.url)}>
                      <img src={image.url} key={i} alt="" />
                    </div>
                  ))}
                  {post.images.length > 5 && (
                    <div className="more-pics-shadow">
                      +{post.images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : post.type === "profilePicture" ? (
            <div className="post_profile_wrap">
              <div className="post_updated_bg">
                <img src={post.user.cover} alt="" />
              </div>
              <img
                src={post.images[0].url}
                alt=""
                className="post_updated_picture"
              />
            </div>
          ) : (
            <div className="post_cover_wrap">
              <img src={post.images[0].url} alt="" />
            </div>
          )}

          <div className="post_infos">
            <div className="reacts_count" onClick={() => visibleReeact3()}>
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
                            src={`../../../reacts/${react.react}.svg`}
                            alt=""
                            key={i}
                          />
                        )
                    )}
              </div>
              <div className="reacts_count_num">{total > 0 && total}</div>
            </div>
            <div className="to_right">
              <div className="comments_count">{totalComment} comments</div>
              <div className="share_count">0 share</div>
            </div>
          </div>
          <div className="post_actions">
            <ReactsPopup
              visible={visible}
              setVisible={setVisible}
              reactHandler={reactHandler}
            />
            <div
              className="post_action hover1"
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
              {check ? (
                <img
                  src={`../../../reacts/${check}.svg`}
                  alt=""
                  className="small_react"
                  style={{ width: "18px" }}
                />
              ) : (
                <i className="like_icon"></i>
              )}
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
            <div className="post_action hover1" onClick={handleComment}>
              <i className="comment_post_icon"></i>
              <span>Comment</span>
            </div>
            <div className="post_action hover1">
              <i className="share_icon"></i>
              <span>Share</span>
            </div>
          </div>
          <div className="comments_wrap">
            <div className="comments_order"></div>
            <CreateComment
              textRef={textRef}
              group={group}
              user={user}
              post={post}
              setCount={setCount}
              setComments={setComments}
              setLoading={setLoading}
              loading={loading}
              socket={socket}
              setComment={setComment}
            />
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
                        visiblePost={visiblePost}
                        commentId={visiblePost.commentId}
                        setVisibleReactComment={setVisibleReactComment}
                        visibleReactComment={visibleReactComment}
                        idgroup={post?.group?._id}
                        setReportGroup={setReportGroup}
                        setReport={setReport}
                      />
                    ))}
              </>
            )}
          </div>
          {showMenu && (
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
