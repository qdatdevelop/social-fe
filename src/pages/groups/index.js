import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header";
import CreateGroup from "./createGroup";
import "./style.css";
import { HashLoader } from "react-spinners";
import { getGroupsJoined, getdiscoverGroups } from "../../functions/user";
import axios from "axios";
import Card_Group from "./Card_Group";
import InviteGroups from "./InviteGroups";
import Card_Discover_Group from "./Card_Discover_Group";
import Post from "../../components/post";
import { Public } from "../../svg";
export default function Groups({
  getAllPosts,
  socket,
  notifications,
  setNotifi,
  dataFriend,
  getDataFriend,
  setVisiblePost,
  visibleReact,
  setVisibleReact,
  setVisibleReactComment,
  visibleReactComment,
  getGroups,
  getDiscoverGroups,
  postGroupsLoading,
  dataPostGroups,
  groupsLoading,
  discoverGroupsLoading,
  dataDiscoverGroups,
  dataGroups,
  setVisiblePhoto,
  listMess,
  loadingListMess,
  onlineUsers,
  openChatWindow,
  setOpenChatWindows,
  User,
  getUserData,
  setReport,
  setReportGroup
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const { type } = useParams();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Header
        page="groups"
        getAllPosts={getAllPosts}
        socket={socket}
        notifications={notifications}
        setNotifi={setNotifi}
        listMess={listMess}
        loadingListMess={loadingListMess}
        onlineUsers={onlineUsers}
        openChatWindow={openChatWindow}
        setOpenChatWindows={setOpenChatWindows}
      />
      {visible && (
        <CreateGroup
          setVisible={setVisible}
          dataFriend={dataFriend}
          socket={socket}
        />
      )}
      <div className="friends">
        <div className="friends_left scrollbar" style={{overflowY:"scroll" , overflowX:"hidden"}}>
          <div className="friends_left_header">
            <h2>Groups</h2>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
          </div>
          <div className="friends_left_wrap">
            <Link
              to="/groups"
              className={`mmenu_item hover3 ${
                type === undefined && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="newfeed_icon"></i>
              </div>
              <span>Your feed</span>
            </Link>
            <Link
              to="/groups/discover"
              className={`mmenu_item hover3 ${
                type === "discover" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="discoverr_icon"></i>
              </div>
              <span>Discover</span>
            </Link>
            <Link
              to="/groups/yourgroups"
              className={`mmenu_item hover3 ${
                type === "yourgroups" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="yourgroups_icon"></i>
              </div>
              <span>Your groups</span>
            </Link>

            <div
              className="light_blue_btn hover5"
              style={{ marginTop: "10px" }}
              onClick={() => setVisible(true)}
            >
              <img
                src="../../../icons/add.png"
                alt=""
                className="filter_blue"
              />
              <p style={{ color: "#0567D2" }}>Create new group</p>
            </div>
            <div className="mmenu_splitter"></div>
            <div
              className="mmenu_item"
              style={{ cursor: "auto", fontSize: "17px" }}
            >
              <span>Groups you manage</span>
            </div>
            {groupsLoading ? (
              <div className="sekelton_loader">
                <HashLoader color="#1876f2" />
              </div>
            ) : (
              <>
                {dataGroups.adminGroups &&
                  dataGroups.adminGroups.map((group) => (
                    <>
                      <Link
                        to={`/group/${group?._id}`}
                        className="req_card_pagegroup hover3"
                        style={{ width: "99%", borderRadius: "10px" }}
                      >
                        <div className="group_content_pagegroup">
                          <div className="content_head_pagegroup">
                            <div>
                              <img src={group?.cover} alt="" />
                            </div>
                            <div>
                              <div className="req_name">
                                {group?.group_name}
                              </div>
                              <div
                                className="post_profile_privacy_date"
                                style={{ gap: "5px" }}
                              >
                                {group.public ? (
                                  <>
                                    {" "}
                                    <Public color="#828387" />{" "}
                                    <p>Public group</p> <p>.</p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <i className="private_icon"></i>
                                    <p>Private group</p>
                                    <p>.</p>
                                  </>
                                )}
                                <p>{group?.numMembers}</p> <p> members</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </>
                  ))}
              </>
            )}
            <div className="mmenu_splitter"></div>
            <div
              className="mmenu_item"
              style={{ cursor: "auto", fontSize: "17px" }}
            >
              <span>Groups you've joined</span>
            </div>
            {groupsLoading ? (
              <div className="sekelton_loader">
                <HashLoader color="#1876f2" />
              </div>
            ) : (
              <>
                {dataGroups.memberGroups &&
                  dataGroups.memberGroups.map((group) => (
                    <>
                      <Link
                        to={`/group/${group?._id}`}
                        className="req_card_pagegroup hover3"
                        style={{ width: "99%", borderRadius: "10px" }}
                      >
                        <div className="group_content_pagegroup">
                          <div className="content_head_pagegroup">
                            <div>
                              <img src={group?.cover} alt="" />
                            </div>
                            <div>
                              <div className="req_name">
                                {group?.group_name}
                              </div>
                              <div
                                className="post_profile_privacy_date"
                                style={{ gap: "5px" }}
                              >
                                {group.public ? (
                                  <>
                                    {" "}
                                    <Public color="#828387" />{" "}
                                    <p>Public group</p> <p>.</p>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <i className="private_icon"></i>
                                    <p>Private group</p>
                                    <p>.</p>
                                  </>
                                )}
                                <p>{group?.numMembers}</p> <p> members</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </>
                  ))}
              </>
            )}
          </div>
        </div>
        <div className="friends_right" style={{ overflowX: "hidden" }}>
          {type === undefined && (
            <div className="friends_right_wrap">
              {postGroupsLoading ? (
                <div className="sekelton_loader">
                  <HashLoader color="#1876f2" />
                </div>
              ) : (
                <div className="posts" style={{ marginLeft: "310px" }}>
                  {dataPostGroups && dataPostGroups?.length > 0 ? (
                    dataPostGroups.map((post) => (
                      <Post
                        post={post}
                        user={user}
                        key={post._id}
                        dataPageGroup
                        socket={socket}
                        postId={undefined}
                        setVisiblePost={setVisiblePost}
                        visibleReact={visibleReact}
                        setVisibleReact={setVisibleReact}
                        commentId={undefined}
                        setVisibleReactComment={setVisibleReactComment}
                        visibleReactComment={visibleReactComment}
                        setVisiblePhoto={setVisiblePhoto}
                        page="home"
                        setReport={setReport}
                        setReportGroup={setReportGroup}
                      />
                    ))
                  ) : (
                    <div className="no_posts" style={{ marginRight: "654px" }}>
                      No posts available
                    </div>
                  )}
                </div>
              )}
              <div className="flex_wrap"></div>
            </div>
          )}
          {type === "discover" && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Invitations to join the group</h3>
              </div>
              <div className="flex_wrap">
                {groupsLoading ? (
                  <div className="sekelton_loader">
                    <HashLoader color="#1876f2" />
                  </div>
                ) : (
                  <>
                    <InviteGroups
                      user={user}
                      dataFriend={dataFriend}
                      getDataFriend={getDataFriend}
                      socket={socket}
                      getGroups={getGroups}
                      getDiscoverGroups={getDiscoverGroups}
                    />
                  </>
                )}
              </div>
              <div className="friends_left_header">
                <h3>More suggestions</h3>
              </div>
              <div className="flex_wrap">
                {discoverGroupsLoading ? (
                  <div className="sekelton_loader">
                    <HashLoader color="#1876f2" />
                  </div>
                ) : (
                  <>
                    {dataDiscoverGroups &&
                      dataDiscoverGroups.map((group) => (
                        <>
                          <Card_Discover_Group
                            user={user}
                            group={group}
                            key={group._id}
                            getDataFriend={getDataFriend}
                            getGroups={getGroups}
                            getDiscoverGroups={getDiscoverGroups}
                          />
                        </>
                      ))}
                  </>
                )}
              </div>
              <div className="flex_wrap"></div>
            </div>
          )}
          {type === "yourgroups" && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>All groups you've joined</h3>
              </div>
              <div className="flex_wrap">
                {groupsLoading ? (
                  <div className="sekelton_loader">
                    <HashLoader color="#1876f2" />
                  </div>
                ) : (
                  <>
                    {dataGroups.allGroups &&
                      dataGroups.allGroups.map((group) => (
                        <>
                          <Card_Group
                            group={group}
                            key={group._id}
                            getGroups={getGroups}
                            User={User}
                            getUserData={getUserData}
                          />
                        </>
                      ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
