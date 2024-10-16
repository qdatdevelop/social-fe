import { useEffect, useState } from "react";
import "./style.css";
import { Dots, Public } from "../../svg";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import Detail from "../intro/Detail";
import { settingsgroup } from "../../functions/group";
export default function EditGroup({
  dataPageGroup,
  idGroup,
  description,
  setDescription,
  privacy,
  setPrivacy,
  hideGroup,
  setHideGroup,
  approveMembers,
  setApproveMembers,
  approvePosts,
  setApprovePosts,
  getPageGroup,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [showDescription, setShowDescription] = useState(false);
  const [showPublic, setShowPublic] = useState(false);

  const [showHidden, setShowHidden] = useState(false);
  const [showApprovePosts, setShowApprovePosts] = useState(false);
  const [showApproveMembers, setShowApproveMembers] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDescription(value);
  };

  const updategroupdescription = async () => {
    if (description !== dataPageGroup.description) {
      await settingsgroup(
        description,
        null,
        null,
        null,
        null,
        dataPageGroup?._id,
        user.token
      );
      getPageGroup();
    }
  };

  const updategroupprivacy = async () => {
    if (privacy !== dataPageGroup.public) {
      await settingsgroup(
        null,
        privacy,
        null,
        null,
        null,
        dataPageGroup?._id,
        user.token
      );
      getPageGroup();
    }
  };

  const updategrouphideGroup = async () => {
    if (hideGroup !== dataPageGroup.hidden) {
      await settingsgroup(
        null,
        null,
        hideGroup,
        null,
        null,
        dataPageGroup?._id,
        user.token
      );
      getPageGroup();
    }
  };

  const updategroupapproveMembers = async () => {
    if (approveMembers !== dataPageGroup.approveMembers) {
      await settingsgroup(
        null,
        null,
        null,
        approveMembers,
        null,
        dataPageGroup?._id,
        user.token
      );
      getPageGroup();
    }
  };

  const updategroupapprovePosts = async () => {
    if (approvePosts !== dataPageGroup.approvePosts) {
      await settingsgroup(
        null,
        null,
        null,
        null,
        approvePosts,
        dataPageGroup?._id,
        user.token
      );
      getPageGroup();
    }
  };

  return (
    <>
      <div
        className="profile_card"
        style={{ maxWidth: "470px", width: "470px" }}
      >
        <div
          className="profile_card_header"
          style={{ fontWeight: "700", marginBottom: "20px" }}
        >
          Set up group
        </div>
        <div style={{ display: "flex", position: "relative" }}>
          <p style={{ fontWeight: "500", fontSize: "15px" }}>Description</p>
          <i
            className="edit_icon"
            onClick={() => {
              setDescription(dataPageGroup.description);
              setShowDescription((prev) => !prev);
            }}
            style={{
              display: "flex",
              position: "absolute",
              right: "0",
              cursor: "pointer",
            }}
          ></i>
        </div>

        {showDescription && (
          <>
            <textarea
              placeholder={"Description"}
              name={"Description"}
              value={description}
              className="textarea_blue details_input"
              onChange={handleChange}
            ></textarea>
            <div className="flex" style={{ flexDirection: "row-reverse" }}>
              <div className="flex flex_right">
                <button
                  className="blue_btn"
                  onClick={() => {
                    updategroupdescription();
                    setShowDescription(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="gray_btn"
                  onClick={() => {
                    setDescription(dataPageGroup.description);
                    setShowDescription(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        <div
          style={{
            display: "flex",
            position: "relative",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontWeight: "500", fontSize: "15px" }}>Privacy</p>
          <i
            className="edit_icon"
            onClick={() => {
              setPrivacy(dataPageGroup.public);
              setShowPublic((prev) => !prev);
            }}
            style={{
              display: "flex",
              position: "absolute",
              right: "0",
              cursor: "pointer",
            }}
          ></i>
        </div>

        {showPublic ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <label
                htmlFor="public"
                className="hover1"
                style={{
                  padding: "10px",

                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  borderRadius: "12px",
                }}
                onClick={() => setPrivacy(true)}
              >
                <div className="small_circle">
                  <i className="public_icon"></i>
                </div>

                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Public
                  </span>
                  <div className="mmenu_span2">
                    Anyone can see who's in the group and what they post.
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {privacy ? (
                    <input
                      type="radio"
                      name="privacy"
                      id="public"
                      style={{ accentColor: "#0062D2" }}
                      checked
                    />
                  ) : (
                    <input type="radio" name="privacy" id="public" />
                  )}
                </div>
              </label>
              <label
                htmlFor="private"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: "10px",
                  borderRadius: "12px",
                }}
                onClick={() => setPrivacy(false)}
              >
                <div className="small_circle">
                  <i className="private_group_icon"></i>
                </div>
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Private
                  </span>
                  <div className="mmenu_span2">
                    Only members can see who's in this group and what they post.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  {privacy ? (
                    <input type="radio" name="privacy" id="private" />
                  ) : (
                    <input
                      type="radio"
                      name="privacy"
                      id="private"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  )}
                </div>
              </label>
            </div>
            <div className="flex" style={{ flexDirection: "row-reverse" }}>
              <div className="flex flex_right">
                <button
                  className="blue_btn"
                  onClick={() => {
                    updategroupprivacy();
                    setShowPublic(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="gray_btn"
                  onClick={() => {
                    setPrivacy(dataPageGroup.public);
                    setShowPublic(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mmenu_span2" style={{ marginTop: "5px" }}>
            {dataPageGroup.public ? "Public" : "Private"}
          </div>
        )}
        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        <div
          style={{
            display: "flex",
            position: "relative",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontWeight: "500", fontSize: "15px" }}>Hide group</p>
          <i
            className="edit_icon"
            onClick={() => setShowHidden((prev) => !prev)}
            style={{
              display: "flex",
              position: "absolute",
              right: "0",
              cursor: "pointer",
            }}
          ></i>
        </div>

        {showHidden ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <label
                htmlFor="visible"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  borderRadius: "12px",
                }}
                onClick={() => setHideGroup(true)}
              >
                <div className="small_circle">
                  <i className="visible_icon"></i>
                </div>
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Visible
                  </span>
                  <div className="mmenu_span2">Anyone can find this group.</div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {hideGroup ? (
                    <input type="radio" name="hidden" id="hidden" />
                  ) : (
                    <input
                      type="radio"
                      name="hidden"
                      id="hidden"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  )}
                </div>
              </label>
              <label
                htmlFor="hidden"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: "10px",
                  borderRadius: "12px",
                }}
                onClick={() => setHideGroup(false)}
              >
                <div className="small_circle">
                  <i className="hidden_icon"></i>
                </div>
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Hidden
                  </span>
                  <div className="mmenu_span2">
                    Only members can find this group.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  {hideGroup ? (
                    <input
                      type="radio"
                      name="hidden"
                      id="visible"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  ) : (
                    <input type="radio" name="hidden" id="visible" />
                  )}
                </div>
              </label>
            </div>
            <div className="flex" style={{ flexDirection: "row-reverse" }}>
              <div className="flex flex_right">
                <button
                  className="blue_btn"
                  onClick={() => {
                    updategrouphideGroup();
                    setShowHidden(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="gray_btn"
                  onClick={() => {
                    setHideGroup(dataPageGroup.hidden);
                    setShowHidden(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mmenu_span2" style={{ marginTop: "5px" }}>
            {dataPageGroup.hidden ? "Hidden" : "Visible"}
          </div>
        )}
        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        <div
          style={{
            display: "flex",
            position: "relative",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontWeight: "500", fontSize: "15px" }}>
            Approve members to join this group
          </p>
          <i
            className="edit_icon"
            onClick={() => {
              setApproveMembers(dataPageGroup.approveMembers);
              setShowApproveMembers((prev) => !prev);
            }}
            style={{
              display: "flex",
              position: "absolute",
              right: "0",
              cursor: "pointer",
            }}
          ></i>
        </div>
        {showApproveMembers ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <label
                htmlFor="hidden"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: "10px",
                  borderRadius: "12px",
                }}
                onClick={() => {
                  setApproveMembers(false);
                }}
              >
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Anyone can join this group
                  </span>
                  <div className="mmenu_span2">
                    Anyone can join this group without admin approval.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  {approveMembers ? (
                    <input
                      type="radio"
                      name="approvemember"
                      id="nomemberapproval"
                    />
                  ) : (
                    <input
                      type="radio"
                      name="approvemember"
                      id="nomemberapproval"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  )}
                </div>
              </label>
              <label
                htmlFor="visible"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  borderRadius: "12px",
                }}
                onClick={() => {
                  setApproveMembers(true);
                }}
              >
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Member approval
                  </span>
                  <div className="mmenu_span2">
                    Members need to be approved by admins before joining this
                    group.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {approveMembers ? (
                    <input
                      type="radio"
                      name="approvemember"
                      id="memberapproval"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  ) : (
                    <input
                      type="radio"
                      name="approvemember"
                      id="memberapproval"
                    />
                  )}
                </div>
              </label>
            </div>
            <div className="flex" style={{ flexDirection: "row-reverse" }}>
              <div className="flex flex_right">
                <button
                  className="blue_btn"
                  onClick={() => {
                    updategroupapproveMembers();
                    setShowApproveMembers(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="gray_btn"
                  onClick={() => {
                    setApproveMembers(dataPageGroup.approveMembers);
                    setShowApproveMembers(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mmenu_span2" style={{ marginTop: "5px" }}>
            {" "}
            {dataPageGroup.approveMembers ? "On" : "Off"}
          </div>
        )}

        <div className="mmenu_splitter" style={{ marginTop: "10px" }}></div>
        <div
          style={{ display: "flex", position: "relative", marginTop: "20px" }}
        >
          <p style={{ fontWeight: "500", fontSize: "15px" }}>
            Approve posts to this group
          </p>
          <i
            className="edit_icon"
            onClick={() => {
              setApprovePosts(dataPageGroup.approvePosts);
              setShowApprovePosts((prev) => !prev);
            }}
            style={{
              display: "flex",
              position: "absolute",
              right: "0",
              cursor: "pointer",
            }}
          ></i>
        </div>
        {showApprovePosts ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <label
                htmlFor="hidden"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: "10px",
                  borderRadius: "12px",
                }}
                onClick={() => setApprovePosts(false)}
              >
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Anyone can post on this group
                  </span>
                  <div className="mmenu_span2">
                    Anyone can post on this group.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {" "}
                  {approvePosts ? (
                    <input
                      type="radio"
                      name="approvePosts"
                      id="noapprovePost"
                    />
                  ) : (
                    <input
                      type="radio"
                      name="approvePosts"
                      id="noapprovePost"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  )}
                </div>
              </label>
              <label
                htmlFor="visible"
                className="hover1"
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  borderRadius: "12px",
                }}
                onClick={() => setApprovePosts(true)}
              >
                <div>
                  <span style={{ fontWeight: "500", fontSize: "15px" }}>
                    Post approval
                  </span>
                  <div className="mmenu_span2">
                    Members need to be approved by admins before post on this
                    group.
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  {approvePosts ? (
                    <input
                      type="radio"
                      name="approvePosts"
                      id="approvePost"
                      checked
                      style={{ accentColor: "#0062D2" }}
                    />
                  ) : (
                    <input type="radio" name="approvePosts" id="approvePost" />
                  )}
                </div>
              </label>
            </div>
            <div className="flex" style={{ flexDirection: "row-reverse" }}>
              <div className="flex flex_right">
                <button
                  className="blue_btn"
                  onClick={() => {
                    updategroupapprovePosts();
                    setShowApprovePosts(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="gray_btn"
                  onClick={() => {
                    setApprovePosts(dataPageGroup.approvePosts);
                    setShowApprovePosts(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="mmenu_span2" style={{ marginTop: "5px" }}>
            {" "}
            {dataPageGroup.approvePosts ? "On" : "Off"}
          </div>
        )}
      </div>
    </>
  );
}
