import { useEffect, useState } from "react";
import "./style.css";
import { Dots, Public } from "../../svg";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { approveMember, declineMember } from "../../functions/group";
export default function MemberRequests({
  dataPageGroup,
  idGroup,
  PageGroupLoading,
  getPageGroup
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const handleLinkClick = (link) => {
    // Reload the current page
    window.location.replace(link);
  };

  const functionApprove = async (idUser) => {
    await approveMember(idGroup , idUser, user.token);
    getPageGroup();
  };
  const functionDecline = async (idUser) => {
    await declineMember(idGroup , idUser, user.token);
    getPageGroup();
  };

  return (
    <>
      {PageGroupLoading ? (
        <div className="sekelton_loader">
          <HashLoader color="#1876f2" />
        </div>
      ) : (
        <>
          {dataPageGroup.pendingMembers?.length === 0 ? (
            <>
              {" "}
              <div className="No_results">
                <p>No request member approval to show</p>
              </div>
            </>
          ) : (
            <>
              {dataPageGroup.pendingMembers?.map((user, i) => (
                <div className="profile_card" style={{ paddingBottom: "10px" }}>
                  <div
                    className="user_serach_wrap"
                    style={{ position: "relative" }}
                  >
                    <div
                      className={"user_serach "}
                      style={{ cursor: "default" }}
                    >
                      <Link to={`/profile/${user.user._id}`}>
                        <img src={user.user.picture} alt="" />
                      </Link>

                      <Link
                        to={`/profile/${user.user._id}`}
                        className="user_serach_name hover6"
                      >
                        {user.user.first_name} {user.user.last_name}
                      </Link>
                      <div
                        className="button_requests"
                        style={{
                          display: "flex",
                          right: "0",
                          position: "absolute",
                        }}
                      >
                        <button
                          className="blue_btn_requests"
                          style={{ height: "fit-content", width: "196px" }}
                          onClick={() =>
                            functionApprove(user.user._id)
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="gray_btn_requests"
                          style={{
                            height: "fit-content",
                            width: "196px",
                            background: "#F0F0F0",
                          }}
                          onClick={() =>
                            functionDecline(user.user._id)
                          }
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}
