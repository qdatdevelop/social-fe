import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Dots } from "../../svg";
import { useEffect, useReducer, useState, useRef } from "react";
import { HashLoader } from "react-spinners";

export default function MediaMenu({
  sk,
  idGroup,
  loading,
  photos,
  type,
  setVisiblePhoto,
}) {
  const photoSections = ["photos", undefined];
  return (
    <div className="profile_menu_wrap">
      <div className="header_photo">
        <h1 style={{ marginRight: "700px" }}>Media</h1>
      </div>
      <div className="profile_menu_photo">
        <Link
          to={`/group/${idGroup}/media/photos`}
          className={
            type == "photos" || type === undefined
              ? "profile_menu_photo_active"
              : "hover1"
          }
        >
          Photos
        </Link>
        <Link
          to={`/group/${idGroup}/media/albums`}
          className={type === "albums" ? "profile_menu_photo_active" : "hover1"}
        >
          Albums
        </Link>
      </div>
      <div
        className="bottom-content"
        style={{
          justifyContent:
            (photos.post_images?.length > 0 && photoSections.includes(sk)) ||
            (photos.cover_pictures?.length !== 0 )
              ? "flex-start"
              : "center",
        }}
      >
        <>
          {loading ? (
            <div className="sekelton_loader_friends">
              <HashLoader color="#1876f2" />
            </div>
          ) : (
            <>
              <div className="profile_card_grid_photo">
                {photoSections.includes(type) && (
                  <>
                    <div
                      className="friends_right_wrap"
                      style={{ borderBottom: "none" }}
                    >
                       <div className="profile_card_grid" style={{gridTemplateColumns:"repeat(5, 1fr)"}}>
                        {" "}
                        {photos.post_images?.length > 0 ? (
                          photos.post_images.map(
                            (img) =>
                              img.folder === `${idGroup}/post_images` && (
                                <div
                                  className="post_photos_card"
                                  key={img.public_id}
                                  // style={{ width: "18%" }}
                                  onClick={() =>
                                    setVisiblePhoto({
                                      url: img.secure_url,
                                      type: "post",
                                    })
                                  }
                                >
                                  <img src={img.secure_url} alt="" />
                                </div>
                              )
                          )
                        ) : (
                          <div
                            className="No_results"
                            style={{ paddingTop: "36px" }}
                          >
                            <p>No photo to show</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {type === "albums" && (
                <>
                  <div className="profile_card_grid_photo">
                    {photos.cover_pictures?.length > 0 && (
                      <div className="post_photos_card">
                        <Link to={`/group/${idGroup}/media/album=0`}>
                          <img
                            src={photos.cover_pictures[0]?.secure_url}
                            alt=""
                          />
                          <h3>Cover photos</h3>
                          <p>{photos.cover_pictures?.length} Items</p>
                        </Link>
                      </div>
                    )}

                    {photos.profile_pictures?.length > 0 && (
                      <div className="post_photos_card">
                        <Link to={`/group/${idGroup}/media/album=1`}>
                          <img
                            src={photos.profile_pictures[0]?.secure_url}
                            alt=""
                          />
                          <h3>Profile pictures</h3>

                          <p>{photos.profile_pictures?.length} Items</p>
                        </Link>
                      </div>
                    )}
                    {photos.cover_pictures?.length === 0 &&
                      photos.profile_pictures?.length === 0 && (
                        <div className="No_results">
                          <p>No album to show</p>
                        </div>
                      )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}
