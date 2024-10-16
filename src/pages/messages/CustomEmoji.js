import { useEffect, useRef, useState } from "react";
import "./style.css";
import { updateRoom } from "../../functions/roommess";
import Picker from "emoji-picker-react";
export default function CustomEmoji({
  setPicker,
  openChatWindowMess,
  token,
  getListMess,
  getRoomMess
}) {
  const handleEmoji = async (e, { emoji }) => {
    await updateRoom(
      openChatWindowMess?.roomId,
      openChatWindowMess?.color,
      emoji,
      token
    );
    getListMess();
    getRoomMess();
    setPicker(false);
  };

  return (
    <div
      className="blur"
      style={{
        alignContent: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="postBoxReact ">
        <div className="box_header">
          <span>Emoji</span>
          <div
            className="small_circle hover1"
            style={{ right: "0", display: "flex", position: "absolute" }}
            onClick={() => {
              setPicker(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
        </div>

        <div className="custom-emoji-picker-container">
          <Picker onEmojiClick={handleEmoji} />
        </div>
      </div>
    </div>
  );
}
