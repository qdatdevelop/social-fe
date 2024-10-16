import axios from "axios";
import { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducers";
import { Link } from "react-router-dom";

export default function Photos({  token, photos , idUser , setVisiblePhoto }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Photos
        <Link to={
            idUser ? `/profile/${idUser}&sk=photos` : "/profile&sk=photos"
          } className="profile_header_link">See all photos </Link>
      </div>
      <div className="profile_card_count">
        {photos.post_images?.length === 0
          ? ""
          : photos.post_images?.length === 1
          ? "1 Photo"
          : `${photos.post_images?.length} photos`}
      </div>
      <div className="profile_card_grid">
        {photos.post_images &&
          photos.post_images.slice(0, 9).map((img) => (
            <div className="profile_photo_card" key={img.public_id}  onClick={() => setVisiblePhoto({ url: img.secure_url, type: "post" })}>
              <img src={img.secure_url} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
}
