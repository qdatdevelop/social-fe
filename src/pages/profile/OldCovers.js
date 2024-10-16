import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";
import PhotoMenu from "../../components/photo/PhotoMenu";
export default function OldCovers({
  photos,
  setCoverPicture,
  setShow,
  setVisiblePhoto,
  loading,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [tab, setTab] = useState("Recent_Photos");
  const [album, setAlbum] = useState();
  const Ref = useRef(null);
  useClickOutside(Ref, () => setShow(false));
  console.log(photos);
  return (
    <div className="blur">
      <div className="postBox selectCoverBox" ref={Ref}>
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setShow(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Select photo</span>

          {album && (
            <div
              className="small_circle hover1"
              style={{ left: "15px", display: "flex", position: "absolute" }}
              onClick={() => {
                setAlbum();
              }}
            >
              <i className="arrow_back_icon"></i>
            </div>
          )}
        </div>
        <div className="selectCoverBox_links">
          <div
            className={`${
              tab === "Recent_Photos"
                ? "selectCoverBox_link_active"
                : "selectCoverBox_link"
            }`}
            onClick={() => setTab("Recent_Photos")}
          >
            Recent Photos
          </div>
          <div
            className={`${
              tab === "Photo_Albums"
                ? "selectCoverBox_link_active"
                : "selectCoverBox_link"
            }`}
            onClick={() => setTab("Photo_Albums")}
          >
            Photo Albums
          </div>
        </div>

        {tab === "Recent_Photos" ? (
          <>
            {" "}
            <div className="old_pictures_wrap scrollbar">
              <div className="old_pictures">
                {photos.cover_pictures &&
                  photos.cover_pictures.map((photo) => (
                    <img
                      src={photo.secure_url}
                      key={photo.public_id}
                      alt=""
                      onClick={() => {
                        setCoverPicture(photo.secure_url);
                        setShow(false);
                      }}
                    />
                  ))}
              </div>
              <div className="old_pictures">
                {photos.post_images &&
                  photos.post_images.map((photo) => (
                    <img
                      src={photo.secure_url}
                      key={photo.public_id}
                      alt=""
                      onClick={() => {
                        setCoverPicture(photo.secure_url);
                        setShow(false);
                      }}
                    />
                  ))}
                {photos.profile_pictures &&
                  photos.profile_pictures.map((photo) => (
                    <img
                      src={photo.secure_url}
                      key={photo.public_id}
                      alt=""
                      onClick={() => {
                        setCoverPicture(photo.secure_url);
                        setShow(false);
                      }}
                    />
                  ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="old_pictures_wrap scrollbar">
              <div className="old_pictures" style={{ borderBottom: "unset" }}>
                <>
                  {!album && (
                    <div className="profile_card_grid_photo">
                      {photos.cover_pictures?.length > 0 && (
                        <div className="post_photos_card">
                          <div onClick={() => setAlbum("0")}>
                            <img
                              src={photos.cover_pictures[0]?.secure_url}
                              alt=""
                              style={{ width: "164px" }}
                            />
                            <p
                              style={{
                                fontSize: "15px",
                                color: "#050505",
                                fontWeight: "500",
                              }}
                            >
                              Cover photos
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#050505",
                                fontWeight: "400",
                              }}
                            >
                              {photos.cover_pictures?.length} Uploads
                            </p>
                          </div>
                        </div>
                      )}

                      {photos.profile_pictures?.length > 0 && (
                        <div className="post_photos_card">
                          <div onClick={() => setAlbum("1")}>
                            <img
                              src={photos.profile_pictures[0]?.secure_url}
                              alt=""
                              style={{ width: "164px" }}
                            />
                            <p
                              style={{
                                fontSize: "15px",
                                color: "#050505",
                                fontWeight: "500",
                              }}
                            >
                              Profile pictures
                            </p>

                            <p
                              style={{
                                fontSize: "13px",
                                color: "#050505",
                                fontWeight: "400",
                              }}
                            >
                              {photos.profile_pictures?.length} Uploads
                            </p>
                          </div>
                        </div>
                      )}
                      {photos.cover_pictures?.length === 0 &&
                        photos.profile_pictures?.length === 0 && (
                          <div className="No_results">
                            <p>No album to show</p>
                          </div>
                        )}
                    </div>
                  )}

                  {album === "0" && (
                    <>
                      <div className="profile_card_grid_photo">
                        <div
                          className="friends_right_wrap"
                          style={{ borderBottom: "unset" }}
                        >
                          <div className="flex_wrap">
                            {photos.cover_pictures?.map((img, index) => (
                              <div
                                onClick={() => {
                                  setCoverPicture(img.secure_url);
                                  setShow(false);
                                }}
                                className="cover_photos_card"
                                style={{ width: "32%" }}
                                key={index}
                              >
                                <img
                                  style={{ width: "164px" }}
                                  src={img.secure_url}
                                  alt=""
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {album === "1" && (
                    <div className="profile_card_grid_photo">
                      <div
                        className="friends_right_wrap"
                        style={{ borderBottom: "unset" }}
                      >
                        <div className="flex_wrap">
                          {photos.profile_pictures?.map((img, index) => (
                            <div
                              onClick={() => {
                                setCoverPicture(img.secure_url);
                                setShow(false);
                              }}
                              className="post_photos_card"
                              key={index}
                              style={{ width: "30%" }}
                            >
                              <img
                                style={{ width: "164px" }}
                                src={img.secure_url}
                                alt=""
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
