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
import Comment from "./Comment";
import { getComment, getCountCommentInPost } from "../../functions/comment";

export default function Post({
  post,
  user,
  profile,
  socket,
  visiblePost,
  setVisiblePost,
  setVisibleReact,
  commentId,
  postId,
  setVisibleReactComment,
  visibleReactComment,
  setVisiblePhoto,
  page,
  setReport,
  setReportGroup,
}) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(1);
  const [totalComment, setTotalComment] = useState(0);
  const [comment, setComment] = useState("");
  const [checkSaved, setCheckSaved] = useState();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const group = ["coverPictureGroup", "group"];
  const textRef = useRef(null);
  const postRef = useRef(null);
  useEffect(() => {
    getPostReacts();
  }, [post?._id]);

  const handleComment = () => {
    // Gọi phương thức focus() trên đối tượng DOM của input
    textRef.current.focus();
  };

  useEffect(() => {
    getPostComments();
    getCountCommentPost();
  }, [post?._id, comment]);

  const getCountCommentPost = async () => {
    const res = await getCountCommentInPost(post?._id, user.token);
    setTotalComment(res);
  };

  const getPostComments = async () => {
    const res = await getComment(post?._id, user.token);
    setComments(res);
  };
  const getPostReacts = async () => {
    const res = await getReactsPost(post?._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };
  const reactHandler = async (type) => {
    reactPost(post?._id, type, user.token);
    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotal((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);

        setTotal((prev) => ++prev);
        if (user.id !== post.user._id) {
          if (!group.includes(post.type)) {
            const newNotification = await createNotification(
              post.user._id,
              type,
              post?._id,
              null,
              `/profile/${post.user._id}?post_id=${post?._id}`,
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
              postId: post?._id,
              commentId: "",
              link: `/profile/${post.user._id}?post_id=${post?._id}`,
              description: ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your post.`,
              id: newNotification.newnotification._id,
              createdAt: newNotification.newnotification.createdAt,
              groupId: "",
            });
          } else {
            const newNotification = await createNotification(
              post.user._id,
              type,
              post?._id,
              null,
              `/group/${post?.group._id}?post_id=${post?._id}`,
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
              postId: post?._id,
              commentId: "",
              link: `/group/${post?.group._id}?post_id=${post?._id}`,
              description: ` <b>${user.first_name} ${user.last_name}</b> drop emotions into your post in group <b>${post?.group.group_name}</b>.`,
              id: newNotification.newnotification._id,
              createdAt: newNotification.newnotification.createdAt,
              groupId: post?.group._id,
            });
          }
        }
      }
      if (index1 !== -1) {
        // const newReacts = [...reacts]; // Tạo một bản sao của mảng reacts
        // newReacts[index1] = {
        //   ...newReacts[index1],
        //   count: newReacts[index1].count - 1,
        // }; // Cập nhật giá trị count trong bản sao
        // setReacts(newReacts); // Cập nhật mảng reacts với bản sao đã cập nhật
        // setTotal((prev) => --prev);
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
      }
    }
  };
  const showMore = () => {
    setVisiblePost({ post: post, commentId: commentId, page: page });
  };

  return (
    <div
      className={`${postId === post?._id ? "post_active" : "post"}`}
      style={{ width: `${profile && "100%"}` }}
      ref={postRef}
    >
      <div className="post_header" id={`post-${post?._id}`}>
        <div className="post_header_left">
          {group.includes(post?.type) && page === "home" ? (
            <>
              {" "}
              <div className="circle_icon_notification">
                <div className="req_card_pagegroup">
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
      ) : post.type === null || post.type === "group" ? (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length && (
            <div
              style={{ cursor: "pointer" }}
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
                <div
                  onClick={() =>
                    setVisiblePhoto({ url: image.url, type: "post" })
                  }
                >
                  <img src={image.url} key={i} alt="" />
                </div>
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
      ) : post.type === "profilePicture" ? (
        <>
          <div className="post_text">{post.text}</div>
          <div className="post_profile_wrap" style={{ cursor: "pointer" }}>
            <div className="post_updated_bg">
              <img src={post.user.cover} alt="" />
            </div>
            <img
              src={post.images[0].url}
              alt=""
              className="post_updated_picture"
              onClick={() =>
                setVisiblePhoto({ url: post.images[0].url, type: "profile" })
              }
            />
          </div>
        </>
      ) : (
        <div
          className="post_cover_wrap"
          style={{ cursor: "pointer" }}
          onClick={() =>
            setVisiblePhoto({ url: post.images[0].url, type: "cover" })
          }
        >
          <img src={post.images[0].url} alt="" />
        </div>
      )}

      <div className="post_infos">
        <div
          className="reacts_count"
          onClick={() => setVisibleReact(post?._id)}
        >
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
          setComments={setComments}
          setCount={setCount}
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
                .slice(0, count)
                .map((comment, i) => (
                  <Comment
                    group={group}
                    comment={comment}
                    user={user}
                    key={i}
                    socket={socket}
                    post={post}
                    setVisiblePost={setVisiblePost}
                    visiblePost={visiblePost}
                    commentId={commentId}
                    setVisibleReact={setVisibleReact}
                    setVisibleReactComment={setVisibleReactComment}
                    visibleReactComment={visibleReactComment}
                    page={page}
                    idgroup={post?.group?._id}
                    setReportGroup={setReportGroup}
                    setReport={setReport}
                  />
                ))}
            {count < comments.length && (
              <div className="view_comments_post" onClick={() => showMore()}>
                View more comments
              </div>
            )}
          </>
        )}
      </div>
      {showMenu && (
        <PostMenu
          userId={user.id}
          postUserId={post.user._id}
          imagesLength={post?.images?.length}
          setShowMenu={setShowMenu}
          postId={post?._id}
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
      )}
    </div>
  );
}
