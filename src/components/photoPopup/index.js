import { useEffect, useRef, useState, useReducer } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import { getPostByUrl } from "../../functions/post";
import { getCountCommentInPost } from "../../functions/comment";
import { getComment } from "../../functions/comment";
import { getReactsPost } from "../../functions/post";
import { reactPost } from "../../functions/post";
import { createNotification } from "../../functions/notification";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Public, Dots, Logo } from "../../svg";
import ReactsPopup from "../post/ReactsPopup";
import CreateComment from "../post/CreateComment";
import Comment_detail from "../post/Comment_detail";
import PostMenu from "../post/PostMenu";
import { postReducer } from "../../functions/reducers";
import { HashLoader } from "react-spinners";
export default function PhotoPopup({ setVisiblePost, setVisibleReact, setVisibleReactComment, visibleReactComment, setVisiblePhoto, visiblePhoto, socket }) {
    const { user } = useSelector((state) => ({ ...state }));
    const textRef = useRef(null);
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
    const goOut = () => {
        setVisiblePhoto(null);
    };
    useEffect(() => {
        setVisiblePost(false);
        setVisibleReact(null);
        setVisibleReactComment(null);
        getPost();
    }, []);

    const [{ loading: postLoading, error: postError, post }, dispatchPost] = useReducer(postReducer, {
        loading: false,
        post: [],
        error: "",
    });

    const handleComment = () => {
        // Gọi phương thức focus() trên đối tượng DOM của input
        textRef.current.focus();
    };

    const handleLinkClick = (link) => {
        // Reload the current page
        window.location.replace(link);
    };

    const getPost = async () => {
        dispatchPost({ type: "POSTS_REQUEST" });
        const data = await getPostByUrl(visiblePhoto.url, user.token);
        console.log(data);
        if (data.status === "ok") {
            dispatchPost({ type: "POSTS_SUCCESS", payload: data.data });
            getPostReacts(data.data._id);
            getCountCommentPost(data.data._id);
            getPostComments(data.data._id);
        } else {
            dispatchPost({
                type: "POSTS_ERROR",
                payload: postError.response.data.message,
            });
        }
    };

    const getCountCommentPost = async (id) => {
        const res = await getCountCommentInPost(id, user.token);
        setTotalComment(res);
    };

    const visibleReeact3 = () => {
        setVisibleReact(post._id);
    };

    const getPostComments = async (id) => {
        const res = await getComment(id, user.token);
        setComments(res);
    };

    const getPostReacts = async (id) => {
        const res = await getReactsPost(id, user.token);
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
                setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
                setTotal((prev) => --prev);
            }
        }
    };

    return (
        <div className="PhotoPopup">
            <div className={`${visiblePhoto.type === "cover" ? "photoDetailCover" : "photoDetail"}`}>
                <div className="exit_photoDetail" onClick={goOut} style={{ alignItems: "center", gap: "17px" }}>
                    <i className="exit_icon_photo" style={{ cursor: "pointer", color: "#fff" }}></i>

                    <div onClick={() => handleLinkClick("/")} className="header_logo">
                        <div className="circle">
                            <img src="/public/icons/logo 2.png" alt="" />
                        </div>
                    </div>
                </div>

                <img src={visiblePhoto.url} alt="" />
            </div>{" "}
            <div className="post" style={{ width: "400px", position: "absolute", right: "0" }}>
                {postLoading ? (
                    <>
                        <div className="sekelton_loader">
                            <HashLoader color="#1876f2" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="post_content">
                            <div className="post_header " style={{ width: "400px", display: "flex" }}>
                                <div className="post_header_left">
                                    <div style={{ cursor: "pointer" }} onClick={() => handleLinkClick(`/profile/${post.user?._id}`)}>
                                        <img src={post.user?.picture} alt="" />
                                    </div>

                                    <div className="header_col">
                                        <div className="post_profile_name">
                                            <div className="hover6" style={{ cursor: "pointer" }} onClick={() => handleLinkClick(`/profile/${post.user?._id}`)}>
                                                {post.user?.first_name} {post.user?.last_name}
                                            </div>

                                            <div className="updated_p">
                                                {post.type == "profilePicture" && `updated ${post.user?.gender === "male" ? "his" : "her"} profile picture`}
                                                {post.type == "coverPicture" && `updated ${post.user?.gender === "male" ? "his" : "her"} cover picture`}
                                            </div>
                                        </div>
                                        <div className="post_profile_privacy_date">
                                            <Moment fromNow interval={30}>
                                                {post.createdAt}
                                            </Moment>
                                            . <Public color="#828387" />
                                        </div>
                                    </div>
                                </div>
                                <div className="post_header_right hover1" onClick={() => setShowMenu((prev) => !prev)}>
                                    <Dots color="#828387" />
                                </div>
                            </div>
                        </div>
                        <div className="post_infos">
                            <div className="reacts_count" onClick={() => visibleReeact3()}>
                                <div className="reacts_count_imgs">
                                    {reacts &&
                                        reacts
                                            .sort((a, b) => {
                                                return b.count - a.count;
                                            })
                                            .slice(0, 3)
                                            .map((react, i) => react.count > 0 && <img src={`../../../reacts/${react.react}.svg`} alt="" key={i} />)}
                                </div>
                                <div className="reacts_count_num">{total > 0 && total}</div>
                            </div>
                            <div className="to_right">
                                <div className="comments_count">{totalComment} comments</div>
                                <div className="share_count">0 share</div>
                            </div>
                        </div>
                        <div className="post_actions">
                            <ReactsPopup visible={visible} setVisible={setVisible} reactHandler={reactHandler} />
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
                                onClick={() => reactHandler(check ? check : "Like")}>
                                {check ? <img src={`../../../reacts/${check}.svg`} alt="" className="small_react" style={{ width: "18px" }} /> : <i className="like_icon"></i>}
                                <span
                                    style={{
                                        color: `
        
        ${check === "Like" ? "#4267b2" : check === "Love" ? "#f63459" : check === "Haha" ? "#f7b125" : check === "Sad" ? "#f7b125" : check === "Wow" ? "#f7b125" : check === "Angry" ? "#e4605a" : ""}
        `,
                                    }}>
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
                        <div className="comments_wrap scrollbar" style={{ height: "851px", overflowY: "scroll" }}>
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
                                                    setVisibleReactComment={setVisibleReactComment}
                                                    visibleReactComment={visibleReactComment}
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
                    </>
                )}
            </div>
        </div>
    );
}
