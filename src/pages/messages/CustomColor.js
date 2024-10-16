import { useEffect, useRef, useState } from "react";
import "./style.css";
import { updateRoom } from "../../functions/roommess";
export default function CustomColor({
  setThemes,
  openChatWindowMess,
  token,
  getListMess,
  getRoomMess,
  page,
}) {
  const themeColors = [
    "#d21313", // Red
    "rgb(0, 132, 255)", // Blue
    "#4b7b30", // Green
    "#F7D700",
    "purple",
    "orange",
    "pink",
    "#FF7F23",
    "#F25C54",
    "gray",
    "black",
    "#4D3EC2", 
    "#008000", // Green
    "#00BEBC", 
    "#A797FF", // Orange
    "#FF1493", // Deep Pink
  ];

  // Trạng thái màu chủ đề được chọn
  const [selectedColor, setSelectedColor] = useState("");
  const updateThemes = async () => {
    await updateRoom(
      openChatWindowMess?.roomId,
      selectedColor,
      openChatWindowMess?.icon,
      token
    );
    getListMess();
    if (page === "messages") {
      getRoomMess();
    }

    setThemes(false);
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
          <span>Themes</span>
          <div
            className="small_circle hover1"
            style={{ right: "0", display: "flex", position: "absolute" }}
            onClick={() => {
              setThemes(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 50px)",
            gap: "10px",
            padding: "10px",
          }}
        >
          {themeColors.map((color, index) => (
            <div
              key={index}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: color,
                cursor: "pointer",
                border: selectedColor === color ? "2px solid #333" : "none",
              }}
              onClick={() => setSelectedColor(color)}
            ></div>
          ))}
        </div>

        <div
          className="flex"
          style={{ flexDirection: "row-reverse", padding: "10px" }}
        >
          <div className="flex flex_right">
            <button className="gray_btn" onClick={() => setThemes(false)}>
              Cancel
            </button>
            {selectedColor && (
              <button
                className="blue_btn"
                onClick={() => {
                  updateThemes();
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
