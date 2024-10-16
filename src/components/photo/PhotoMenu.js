import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Dots } from "../../svg";
import { useEffect, useReducer, useState, useRef } from "react";
import { HashLoader } from "react-spinners";

export default function PhotoMenu({
  sk,
  idUser,
  loading,
  photos,
  setVisiblePhoto,
}) {
  const photoSections = ["photos", "photos_by"];

  return (
    <div className="profile_menu_wrap">
      <div className="header_photo">
        <h1 style={{ marginRight: "685px" }}>Photos</h1>
      </div>
      <div className="profile_menu_photo">
        <Link
          to={
            idUser ? `/profile/${idUser}&sk=photos_by` : "/profile&sk=photos_by"
          }
          className={
            sk === "photos" || sk === "photos_by"
              ? "profile_menu_photo_active"
              : "hover1"
          }
        >
          Your photos
        </Link>
        <Link
          to={
            idUser
              ? `/profile/${idUser}&sk=photos_albums`
              : "/profile&sk=photos_albums"
          }
          className={
            sk === "photos_albums" ? "profile_menu_photo_active" : "hover1"
          }
        >
          Albums
        </Link>
      </div>
      <div
        className="bottom-content"
        style={{
          justifyContent:
            (photos.post_images?.length > 0 && photoSections.includes(sk)) ||
            (photos.cover_pictures?.length !== 0 && sk === "photos_albums")
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
                {photoSections.includes(sk) && (
                  <>
                    <div
                      className="friends_right_wrap"
                      style={{ borderBottom: "none" }}
                    >
                      <div
                        className="profile_card_grid"
                        style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                      >
                        {photos.post_images?.length > 0 ? (
                          photos.post_images.map(
                            (img) =>
                              img.folder === `${idUser}/post_images` && (
                                <div
                                  className="post_photos_card"
                                  onClick={() =>
                                    setVisiblePhoto({
                                      url: img.secure_url,
                                      type: "post",
                                    })
                                  }
                                  // style={{ width: "18%" }}
                                  key={img.public_id}
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

              {sk === "photos_albums" && (
                <>
                  <div className="profile_card_grid_photo">
                    {photos.cover_pictures?.length > 0 && (
                      <div className="post_photos_card">
                        <Link
                          to={
                            idUser
                              ? `/profile/${idUser}&sk=photos/album=0`
                              : "/profile&sk=photos/album=0"
                          }
                        >
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
                        <Link
                          to={
                            idUser
                              ? `/profile/${idUser}&sk=photos/album=1`
                              : "/profile&sk=photos/album=1"
                          }
                        >
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
