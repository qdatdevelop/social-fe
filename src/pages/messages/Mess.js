import Moment from "react-moment";
import "./style.css";
import { Dots, Public } from "../../svg";
import CommentMenu from "../../components/post/CommentMenu";
import { useEffect, useRef, useState } from "react";
import ReactsPopup from "../../components/post/ReactsPopup";
import { reactMess, getReactsMess } from "../../functions/messenger";
import CustomMoment from "../../components/CustomMoment/CustomMoment";
export default function Mess_Screen({ message, user, showChat, socket , setVisiblePhotoDetail }) {
  const sender = message?.senderId === user?.id;
  const [showMenuComment, setShowMenuComment] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const [visible, setVisible] = useState(false);
  const [check, setCheck] = useState();
  const [reacts, setReacts] = useState();
  const [checkSaved, setCheckSaved] = useState();
  const [total, setTotal] = useState(0);
  const reactHandler = async (type) => {
    reactMess(message._id, type, user.token);
    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotal((prev) => --prev);
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId: showChat._id,
        });
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotal((prev) => ++prev);
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId: showChat._id,
        });
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
        socket.emit("sendMessage", {
          senderId: user.id,
          receiverId: showChat._id,
        });
      }
    }
  };
  useEffect(() => {
    getMessReacts();
  }, [message]);
  const getMessReacts = async () => {
    const res = await getReactsMess(message._id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
    setCheckSaved(res.checkSaved);
  };

  return (
    <>
      {sender ? (
        <>
          <div
            className="comment"
            style={{ flexDirection: "row-reverse" }}
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
            <div
              className="comment_col"
              style={{
                display: "flex",
                flexDirection: "row",
                position: "relative",
              }}
            >
              <div>
                {total > 0 && (
                  <div
                    className="reacts_count_comment"
                    style={{
                      bottom: "-16px",
                      right: "5px",
                      position: "relative",
                    }}
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
                                  style={{
                                    position: "relative",
                                    right: `${i * 2}px`,
                                  }}
                                  src={`../../../reacts/${react.react}.svg`}
                                  alt=""
                                  key={i}
                                  // onClick={() =>
                                  //   setVisibleReactComment(comment._id, user.token)
                                  // }
                                />
                              )
                          )}
                    </div>
                    <div className="reacts_count_num">{total > 1 && total}</div>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                {message.image && (
                  <>
                    {" "}
                    <div className="mess_img_wrap"  onClick={() => setVisiblePhotoDetail(message.image)}>
                      <img src={message.image} alt="" className="mess_image" />
                    </div>
                  </>
                )}
                {message.message && (
                  <>
                    <div
                      className="mess_wrap_active"
                      style={{
                        marginRight: "8px",
                        width: "fit-content",
                        background: showChat?.color,
                      }}
                    >
                      <div className="comment_text" style={{color:"#fff"}}>{message.message}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {visibleComment && (
              <>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
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
                >
                  <div
                    className="post_comment hover8"
                    style={{ width: "25px", height: "25px" }}
                  >
                    <ReactsPopup
                      visible={visible}
                      setVisible={setVisible}
                      reactHandler={reactHandler}
                    />
                    <i className="emoji_icon"></i>
                  </div>
                  <CustomMoment messageAt={message.messageAt} />
                </div>
                {showMenuComment && <></>}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className="comment"
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
            <div className="user_img_mess" style={{ marginLeft: "6px" }}>
              <img src={showChat?.picture} alt="" />
            </div>
            <div
              className="comment_col"
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                position: "relative",
              }}
            >
              <div>
                {total > 0 && (
                  <div
                    className="reacts_count_comment"
                    style={{ bottom: "-16px", position: "relative" }}
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
                                  style={{
                                    position: "relative",
                                    right: `${i * 2}px`,
                                  }}
                                  src={`../../../reacts/${react.react}.svg`}
                                  alt=""
                                  key={i}
                                  // onClick={() =>
                                  //   setVisibleReactComment(comment._id, user.token)
                                  // }
                                />
                              )
                          )}
                    </div>
                    <div className="reacts_count_num">{total > 1 && total}</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {message.image && (
                  <>
                    <div className="mess_img_wrap"  onClick={() => setVisiblePhotoDetail(message.image)}>
                      {" "}
                      <img src={message.image} alt="" className="mess_image" />
                    </div>
                  </>
                )}
                {message.message && (
                  <>
                    <div
                      className="mess_wrap"
                      style={{ marginLeft: "8px", width: "fit-content" }}
                    >
                      <div className="comment_text">{message.message}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {visibleComment && (
              <>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
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
                >
                  <div
                    className="post_comment hover8"
                    style={{ width: "25px", height: "25px" }}
                  >
                    <ReactsPopup
                      visible={visible}
                      setVisible={setVisible}
                      reactHandler={reactHandler}
                    />

                    <i className="emoji_icon"></i>
                  </div>
                  <CustomMoment messageAt={message.messageAt} />
                </div>
                {showMenuComment && <></>}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
