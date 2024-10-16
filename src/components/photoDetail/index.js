import { useEffect, useRef, useState, useReducer } from "react";
import "./style.css";
import { useSelector } from "react-redux";
import { Logo } from "../../svg";
export default function PhotoDetail({
  visiblePhotoDetail,
  setVisiblePhotoDetail,
}) {
  const handleLinkClick = (link) => {
    // Reload the current page
    window.location.replace(link);
  };

  return (
    <div className="PhotoPopup">
      <div className="photoDetail" style={{width:"1685px" , alignItems:"center"}}>
        <div
          className="exit_photoDetail"
          onClick={() => setVisiblePhotoDetail(null)}
          style={{ alignItems: "center", gap: "17px" }}
        >
          <i
            className="exit_icon_photo"
            style={{ cursor: "pointer", color: "#fff" }}
          ></i>

          <div onClick={() => handleLinkClick("/")} className="header_logo">
            <div className="circle">
              <Logo />
            </div>
          </div>
        </div>

        <img style={{width:"fit-content" , height:"fit-content"}} src={visiblePhotoDetail} alt="" />
      </div>{" "}
    </div>
  );
}
