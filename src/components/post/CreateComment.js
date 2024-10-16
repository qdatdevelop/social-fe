import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
// import { comment } from "../../functions/post";
import { comment } from "../../functions/comment";
import { uploadImages } from "../../functions/uploadImages";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { ClipLoader } from "react-spinners";
import { createNotification } from "../../functions/notification";
export default function CreateComment({
  user,
  post,
  setComments,
  setCount,
  setLoading,
  loading,
  socket,
  setComment,
  group,
  textRef,
}) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const handleLinkClick = (link) => {
    // Reload the current page
    window.location.replace(link);
  };
  // const textRef = useRef(null);
  const imgInput = useRef(null);
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);
  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };
  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentImage(event.target.result);
    };
  };

  const notification = async (id) => {
    setComment(id);
    if (user.id !== post.user._id) {
      if (!group.includes(post.type)) {
        const newNotification = await createNotification(
          post.user._id,
          "comment",
          post._id,
          id,
          `/profile/${post.user._id}?post_id=${post._id}&comment_id=${id}`,
          ` <b>${user.first_name} ${user.last_name}</b> commented on your post.`,
          user.token,
          null
        );

        socket.emit("sendNotification", {
          senderId: user.id,
          sender_first_name: user.first_name,
          sender_last_name: user.last_name,
          sender_picture: user.picture,
          receiverId: post.user._id,
          type: "comment",
          postId: post._id,
          commentId: id,
          link: `/profile/${post.user._id}?post_id=${post._id}&comment_id=${id}`,
          description: ` <b>${user.first_name} ${user.last_name}</b> commented on your post.`,
          id: newNotification.newnotification._id,
          createdAt: newNotification.newnotification.createdAt,
          groupId: "",
        });
      } else {
        const newNotification = await createNotification(
          post.user._id,
          "comment",
          post._id,
          id,
          `/group/${post?.group._id}?post_id=${post._id}&comment_id=${id}`,
          ` <b>${user.first_name} ${user.last_name}</b> commented on your post in group <b>${post?.group.group_name}</b>.`,
          user.token,
          post?.group._id
        );

        socket.emit("sendNotification", {
          senderId: user.id,
          sender_first_name: user.first_name,
          sender_last_name: user.last_name,
          sender_picture: user.picture,
          receiverId: post.user._id,
          type: "comment",
          postId: post._id,
          commentId: id,
          link: `/group/${post?.group._id}?post_id=${post._id}&comment_id=${id}`,
          description: ` <b>${user.first_name} ${user.last_name}</b> commented on your post in group <b>${post?.group.group_name}</b>.`,
          id: newNotification.newnotification._id,
          createdAt: newNotification.newnotification.createdAt,
          groupId: post?.group._id,
        });
      }
    }
  };
  const handleComment = async (e) => {
    if (e.key === "Enter") {
      if (commentImage != "") {
        setLoading(true);
        const img = dataURItoBlob(commentImage);
        const path = `${user._id}/post_images/${post._id}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        const imgComment = await uploadImages(formData, path, user.token);

        const comments = await comment(
          post._id,
          text,
          imgComment[0].url,
          user.token
        );
        setComments(comments.newComments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
        notification(comments.savedComment._id);
      } else {
        setLoading(true);
        const comments = await comment(post._id, text, "", user.token);
        setComments(comments.newComments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
        notification(comments.savedComment._id);
      }
    }
  };
  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <div
          onClick={() => handleLinkClick(`/profile/${user?._id}`)}
          style={{ cursor: "pointer" }}
        >
          {" "}
          <img src={user?.picture} alt="" />
        </div>

        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker">
              <Picker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImage}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleComment}
          />
          <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader size={20} color="#1876f2" loading={loading} />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker((prev) => !prev);
            }}
          >
            <i className="emoji_icon"></i>
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current.click()}
          >
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
}
