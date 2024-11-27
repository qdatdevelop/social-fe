import { Link, useParams } from "react-router-dom";
import "./style.css";
import { useEffect, useReducer, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Search, Dots } from "../../../svg";
import { HashLoader } from "react-spinners";
import Moment from "react-moment";
import { getUser, addFriend, cancelRequest, acceptRequest, searchMembers } from "../../../functions/user";
import { createNotification } from "../../../functions/notification";
import MemberMenu from "../MemberMenu";
export default function Members({ sk, numMembers, PageGroupLoading, user, visitor, admin, member, admins, members, friendMembers, socket, getPageGroup, idGroup, requests_admin, openChatWindow }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchs, setSearchs] = useState([]);
    const [showMenu, setShowMenu] = useState({});
    const searchHandler = async () => {
        if (searchTerm === "") {
            setSearchs([]);
        } else {
            const res = await searchMembers(searchTerm, members, user.token);
            setSearchs(res);
        }
    };
    const userAdminIDs = admins?.map((member) => member.user._id);
    const input = useRef(null);
    const color = "#65676b";
    const [User, setUser] = useState();
    const [loadingMembers, setLoadingMembers] = useState(true);
    const getUserData = async () => {
        const res = await getUser(user.token);
        setUser(res);
    };
    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        searchHandler();
    }, [User]);
    const addFriendHandler = async (Userid) => {
        await addFriend(Userid, user.token);

        const newNotification = await createNotification(
            Userid,
            "addFriend",
            null,
            null,
            `/profile/${user.id}`,
            ` <b>${user.first_name} ${user.last_name}</b> has sent you a friend request.`,
            user.token,
            null
        );

        socket.emit("sendNotification", {
            senderId: user.id,
            sender_first_name: user.first_name,
            sender_last_name: user.last_name,
            sender_picture: user.picture,
            receiverId: Userid,
            type: "addFriend",
            postId: "",
            commentId: "",
            link: `/profile/${user.id}`,
            description: ` <b>${user.first_name} ${user.last_name}</b> has sent you a friend request.`,
            id: newNotification.newnotification._id,
            createdAt: newNotification.newnotification.createdAt,
            groupId: "",
        });
        getUserData();
        getPageGroup();
    };
    const cancelRequestHandler = async (Userid) => {
        await cancelRequest(Userid, user.token);
        getUserData();
        getPageGroup();
    };
    const acceptRequestHanlder = async (Userid) => {
        await acceptRequest(Userid, user.token);
        getUserData();
        getPageGroup();
        const newNotification = await createNotification(
            Userid,
            "acceptRequest",
            null,
            null,
            `/profile/${user.id}`,
            ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
            user.token,
            null
        );

        socket.emit("sendNotification", {
            senderId: user.id,
            sender_first_name: user.first_name,
            sender_last_name: user.last_name,
            sender_picture: user.picture,
            receiverId: Userid,
            type: "acceptRequest",
            postId: "",
            commentId: "",
            link: `/profile/${user.id}`,
            description: ` <b>${user.first_name} ${user.last_name}</b> accepted your friend request.`,
            id: newNotification.newnotification._id,
            createdAt: newNotification.newnotification.createdAt,
            groupId: "",
        });
    };

    setTimeout(() => {
        setLoadingMembers(false);
    }, 2000); // 1000 milliseconds = 1 second

    return (
        <div className="about_card" style={{ width: "750px" }}>
            {loadingMembers ? (
                <>
                    {" "}
                    <div className="profile_menu_wrap">
                        <div className="header_friend" style={{ display: "flex", flexDirection: "column" }}>
                            <>
                                <div className="content_members">
                                    <div className="req_name">
                                        <Skeleton height="20px" width="100px " containerClassName="avatar-skeleton" />
                                    </div>
                                </div>
                                <div className="search search1" style={{ width: "648px" }}>
                                    <Search color={color} />
                                    <input type="text" placeholder="Search Zuino" className="hide_input" ref={input} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={searchHandler} />
                                </div>
                            </>
                        </div>

                        <div className="">
                            <div className="sekelton_loader">
                                <HashLoader color="#1876f2" />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {" "}
                    <div className="profile_menu_wrap">
                        <div className="header_friend" style={{ display: "flex", flexDirection: "column" }}>
                            <>
                                <div className="content_members">
                                    <h4>Members</h4>
                                    <p style={{ color: " var(--color-secondary)" }}>.</p>
                                    <p style={{ color: " var(--color-secondary)" }}>{numMembers}</p>
                                </div>
                                <div className="search search1" style={{ width: "648px" }}>
                                    <Search color={color} />
                                    <input
                                        type="text"
                                        placeholder="Search Zuino"
                                        className="hide_input"
                                        ref={input}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyUp={searchHandler}
                                    />
                                </div>
                            </>
                        </div>

                        <div className="">
                            {searchTerm === "" ? (
                                <>
                                    {" "}
                                    {!visitor ? (
                                        <>
                                            {" "}
                                            <div className="mmenu_splitter" style={{ marginTop: "20px" }}></div>
                                            <div className="user_serach_wrap" style={{ marginTop: "0px" }}>
                                                <div className={"user_serach"} style={{ cursor: "auto" }}>
                                                    <Link to={`/profile/${user?.id}`}>
                                                        <img src={user?.picture} alt="" />
                                                    </Link>

                                                    <Link to={`/profile/${user?.id}`} className="user_serach_name hover6">
                                                        {user?.first_name} {user?.last_name}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="mmenu_splitter" style={{ marginBottom: "20px" }}></div>
                                        </>
                                    ) : (
                                        <>
                                            {" "}
                                            <div className="mmenu_splitter" style={{ marginBottom: "20px", marginTop: "20px" }}></div>
                                        </>
                                    )}
                                    <div className="content_members">
                                        <h4>Admins</h4>
                                        <p style={{ color: " var(--color-secondary)" }}>.</p>
                                        <p style={{ color: " var(--color-secondary)" }}>{admins?.length}</p>
                                    </div>
                                    {admins &&
                                        admins.map((admin, i) => (
                                            <div key={i} className="user_serach_wrap">
                                                <div className={"user_serach"} style={{ marginBottom: "auto", cursor: "auto" }}>
                                                    <Link to={`/profile/${admin.user?._id}`}>
                                                        <img src={admin.user?.picture} alt="" />
                                                    </Link>

                                                    <div>
                                                        <Link to={`/profile/${admin.user?._id}`} className="user_serach_name hover6">
                                                            {admin.user?.first_name} {admin.user?.last_name}
                                                        </Link>
                                                        <div
                                                            className="btn_add_friend_search"
                                                            style={{
                                                                height: "fit-content",
                                                                marginTop: "0px",
                                                                borderRadius: "0px",
                                                                width: "fit-content",
                                                                cursor: "auto",
                                                            }}>
                                                            Admin
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        position: "relative",
                                                        cursor: "auto",
                                                    }}>
                                                    {admin.user?.friends.indexOf(user.id) !== -1 ? (
                                                        <>
                                                            <div style={{ display: "flex" }}>
                                                                <button
                                                                    className="btn_add_friend_search"
                                                                    onClick={() => {
                                                                        openChatWindow({
                                                                            _id: admin?.user?._id,
                                                                            picture: admin?.user?.picture,
                                                                            first_name: admin?.user?.first_name,
                                                                            last_name: admin?.user?.last_name,
                                                                        });
                                                                    }}>
                                                                    <p>Message</p>
                                                                </button>

                                                                {!visitor && !member && (
                                                                    <div
                                                                        className="p10_dots_friend"
                                                                        style={{
                                                                            height: "39px",
                                                                            marginTop: "30px",
                                                                        }}
                                                                        onClick={() =>
                                                                            setShowMenu({
                                                                                id: admin.user._id,
                                                                                type: "admin",
                                                                            })
                                                                        }>
                                                                        <Dots />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {admin.user?.requests.indexOf(user.id) !== -1 ? (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                    }}>
                                                                    <button className="btn_add_friend_search" onClick={() => cancelRequestHandler(admin.user._id)}>
                                                                        <p>Cancel request</p>
                                                                    </button>
                                                                    {!visitor && !member && (
                                                                        <div
                                                                            className="p10_dots_friend"
                                                                            style={{
                                                                                height: "39px",
                                                                                marginTop: "20px",
                                                                            }}
                                                                            onClick={() =>
                                                                                setShowMenu({
                                                                                    id: admin.user._id,
                                                                                    type: "admin",
                                                                                })
                                                                            }>
                                                                            <Dots />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {User?.requests.indexOf(admin.user._id) !== -1 ? (
                                                                        <div style={{ display: "flex" }}>
                                                                            <button className="btn_add_friend_search" onClick={() => acceptRequestHanlder(admin.user._id)}>
                                                                                <p>Confirm request</p>
                                                                            </button>
                                                                            {!visitor && !member && (
                                                                                <div
                                                                                    className="p10_dots_friend"
                                                                                    style={{
                                                                                        height: "39px",
                                                                                        marginTop: "20px",
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        setShowMenu({
                                                                                            id: admin.user._id,
                                                                                            type: "admin",
                                                                                        })
                                                                                    }>
                                                                                    <Dots />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {admin.user._id === User._id ? (
                                                                                <>
                                                                                    {" "}
                                                                                    {!visitor && !member && (
                                                                                        <div
                                                                                            className="p10_dots_friend"
                                                                                            style={{
                                                                                                height: "39px",
                                                                                                marginTop: "30px",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                setShowMenu({
                                                                                                    id: admin.user._id,
                                                                                                    type: "admin",
                                                                                                })
                                                                                            }>
                                                                                            <Dots />
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <div
                                                                                    style={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                    }}>
                                                                                    <button className="btn_add_friend_search" onClick={() => addFriendHandler(admin.user._id)}>
                                                                                        <p>Add Friend</p>
                                                                                    </button>
                                                                                    {!visitor && !member && (
                                                                                        <div
                                                                                            className="p10_dots_friend"
                                                                                            style={{
                                                                                                height: "39px",
                                                                                                marginTop: "20px",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                setShowMenu({
                                                                                                    id: admin.user._id,
                                                                                                    type: "admin",
                                                                                                })
                                                                                            }>
                                                                                            <Dots />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                    {showMenu.id === admin?.user._id && showMenu.type === "admin" && (
                                                        <MemberMenu
                                                            admins={admins}
                                                            groupId={idGroup}
                                                            userId={user.id}
                                                            setShowMenu={setShowMenu}
                                                            token={user.token}
                                                            admin={admin}
                                                            memberId={admin.user._id}
                                                            User={User}
                                                            getPageGroup={getPageGroup}
                                                            requests_admin={requests_admin}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    <div className="mmenu_splitter" style={{ marginBottom: "20px" }}></div>
                                    <div className="content_members">
                                        <h4>Friends</h4>
                                        <p style={{ color: " var(--color-secondary)" }}>.</p>
                                        <p style={{ color: " var(--color-secondary)" }}>{friendMembers?.length}</p>
                                    </div>
                                    {friendMembers &&
                                        friendMembers.map((member, i) => (
                                            <>
                                                <div key={i} className="user_serach_wrap" style={{ cursor: "auto", position: "relative" }}>
                                                    <div className={"user_serach"} style={{ marginBottom: "auto", cursor: "auto" }}>
                                                        <Link to={`/profile/${member.user?._id}`}>
                                                            <img src={member.user?.picture} alt="" />
                                                        </Link>

                                                        <Link to={`/profile/${member.user?._id}`} className="user_serach_name hover6">
                                                            {member.user?.first_name} {member.user?.last_name}
                                                        </Link>
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="btn_add_friend_search"
                                                            onClick={() => {
                                                                openChatWindow({
                                                                    _id: member?.user?._id,
                                                                    picture: member?.user?.picture,
                                                                    first_name: member?.user?.first_name,
                                                                    last_name: member?.user?.last_name,
                                                                });
                                                            }}>
                                                            <p>Message</p>
                                                        </button>
                                                    </div>
                                                    {admin && (
                                                        <div
                                                            className="p10_dots_friend"
                                                            style={{ height: "39px", marginTop: "30px" }}
                                                            onClick={() =>
                                                                setShowMenu({
                                                                    id: member.user?._id,
                                                                    type: "friend",
                                                                })
                                                            }>
                                                            <Dots />
                                                        </div>
                                                    )}

                                                    {showMenu.id === member.user?._id && showMenu.type === "friend" && (
                                                        <MemberMenu
                                                            admins={admins}
                                                            groupId={idGroup}
                                                            userId={user.id}
                                                            setShowMenu={setShowMenu}
                                                            token={user.token}
                                                            admin={admin}
                                                            memberId={member.user?._id}
                                                            User={User}
                                                            getPageGroup={getPageGroup}
                                                            requests_admin={requests_admin}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        ))}
                                    <div className="mmenu_splitter" style={{ marginBottom: "20px" }}></div>
                                    <div className="content_members">
                                        <h4>New to the group</h4>
                                        <p style={{ color: " var(--color-secondary)" }}>.</p>
                                        <p style={{ color: " var(--color-secondary)" }}>{numMembers}</p>
                                    </div>
                                    {members &&
                                        members.map((member, i) => (
                                            <div key={i} className="user_serach_wrap" style={{ position: "relative" }}>
                                                <div className={"user_serach"} style={{ marginBottom: "auto", cursor: "auto" }}>
                                                    <Link to={`/profile/${member.user?._id}`}>
                                                        <img src={member.user?.picture} alt="" />
                                                    </Link>

                                                    <div>
                                                        <Link to={`/profile/${member.user?._id}`} className="user_serach_name hover6">
                                                            {member.user?.first_name} {member.user?.last_name}
                                                        </Link>
                                                        <div className="notification_privacy_date" style={{ gap: "4px", cursor: "auto" }}>
                                                            Joined{" "}
                                                            <Moment fromNow interval={30}>
                                                                {member?.joinedAt}
                                                            </Moment>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    {member.user?.friends.indexOf(user.id) !== -1 ? (
                                                        <>
                                                            <div style={{ display: "flex" }}>
                                                                <button
                                                                    className="btn_add_friend_search"
                                                                    onClick={() => {
                                                                        openChatWindow({
                                                                            _id: member?.user?._id,
                                                                            picture: member?.user?.picture,
                                                                            first_name: member?.user?.first_name,
                                                                            last_name: member?.user?.last_name,
                                                                        });
                                                                    }}>
                                                                    <p>Message</p>
                                                                </button>
                                                                {admin && (
                                                                    <div
                                                                        className="p10_dots_friend"
                                                                        style={{
                                                                            height: "39px",
                                                                            marginTop: "30px",
                                                                        }}
                                                                        onClick={() =>
                                                                            setShowMenu({
                                                                                id: member.user?._id,
                                                                                type: "member",
                                                                            })
                                                                        }>
                                                                        <Dots />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {member.user?.requests.indexOf(user.id) !== -1 ? (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                    }}>
                                                                    <button className="btn_add_friend_search" onClick={() => cancelRequestHandler(member.user._id)}>
                                                                        <p>Cancel request</p>
                                                                    </button>
                                                                    {!visitor && !member && (
                                                                        <div
                                                                            className="p10_dots_friend"
                                                                            style={{
                                                                                height: "39px",
                                                                                marginTop: "30px",
                                                                            }}
                                                                            onClick={() =>
                                                                                setShowMenu({
                                                                                    id: member.user?._id,
                                                                                    type: "member",
                                                                                })
                                                                            }>
                                                                            <Dots />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {User?.requests.indexOf(member.user._id) !== -1 ? (
                                                                        <div style={{ display: "flex" }}>
                                                                            <button className="btn_add_friend_search" onClick={() => acceptRequestHanlder(member.user._id)}>
                                                                                <p>Confirm request</p>
                                                                            </button>
                                                                            {!visitor && !member && (
                                                                                <div
                                                                                    className="p10_dots_friend"
                                                                                    style={{
                                                                                        height: "39px",
                                                                                        marginTop: "30px",
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        setShowMenu({
                                                                                            id: member.user?._id,
                                                                                            type: "member",
                                                                                        })
                                                                                    }>
                                                                                    <Dots />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {member.user._id === User._id ? (
                                                                                admin && (
                                                                                    <div
                                                                                        className="p10_dots_friend"
                                                                                        style={{
                                                                                            height: "39px",
                                                                                            marginTop: "20px",
                                                                                        }}
                                                                                        onClick={() =>
                                                                                            setShowMenu({
                                                                                                id: member.user?._id,
                                                                                                type: "member",
                                                                                            })
                                                                                        }>
                                                                                        <Dots />
                                                                                    </div>
                                                                                )
                                                                            ) : (
                                                                                <div
                                                                                    style={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                    }}>
                                                                                    <button className="btn_add_friend_search" onClick={() => addFriendHandler(member.user._id)}>
                                                                                        <p>Add Friend</p>
                                                                                    </button>
                                                                                    {!visitor && !member && (
                                                                                        <div
                                                                                            className="p10_dots_friend"
                                                                                            style={{
                                                                                                height: "39px",
                                                                                                marginTop: "30px",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                setShowMenu({
                                                                                                    id: member.user?._id,
                                                                                                    type: "member",
                                                                                                })
                                                                                            }>
                                                                                            <Dots />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {showMenu.id === member.user._id && showMenu.type === "member" && (
                                                    <MemberMenu
                                                        admins={admins}
                                                        groupId={idGroup}
                                                        userId={user.id}
                                                        setShowMenu={setShowMenu}
                                                        token={user.token}
                                                        admin={admin}
                                                        memberId={member.user._id}
                                                        User={User}
                                                        getPageGroup={getPageGroup}
                                                        requests_admin={requests_admin}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <div className="mmenu_splitter" style={{ marginTop: "20px", marginBottom: "20px" }}></div>
                                    <div className="content_members">
                                        <h4>Search results</h4>
                                    </div>
                                    {searchs &&
                                        searchs.map((search, i) => (
                                            <div key={i} className="user_serach_wrap" style={{ position: "relative" }}>
                                                <div className={"user_serach"} style={{ marginBottom: "auto", cursor: "auto" }}>
                                                    <Link to={`/profile/${search?._id}`}>
                                                        <img src={search?.picture} alt="" />
                                                    </Link>

                                                    <div>
                                                        <Link to={`/profile/${search?._id}`} className="user_serach_name hover6">
                                                            {search?.first_name} {search?.last_name}
                                                        </Link>
                                                        {userAdminIDs.includes(search?._id) && (
                                                            <>
                                                                {" "}
                                                                <div
                                                                    className="btn_add_friend_search"
                                                                    style={{
                                                                        height: "fit-content",
                                                                        marginTop: "0px",
                                                                        borderRadius: "0px",
                                                                        width: "fit-content",
                                                                        cursor: "auto",
                                                                    }}>
                                                                    Admin
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex" }}>
                                                    {search?.friends.indexOf(user.id) !== -1 ? (
                                                        <>
                                                            <div style={{ display: "flex" }}>
                                                                <button
                                                                    className="btn_add_friend_search"
                                                                    onClick={() => {
                                                                        openChatWindow({
                                                                            _id: search?._id,
                                                                            picture: search?.picture,
                                                                            first_name: search?.first_name,
                                                                            last_name: search?.last_name,
                                                                        });
                                                                    }}>
                                                                    <p>Message</p>
                                                                </button>
                                                            </div>
                                                            {!visitor && !member && (
                                                                <div
                                                                    className="p10_dots_friend"
                                                                    style={{
                                                                        height: "39px",
                                                                        marginTop: "30px",
                                                                        position: "relative",
                                                                    }}
                                                                    onClick={() =>
                                                                        setShowMenu({
                                                                            id: search._id,
                                                                            type: "search",
                                                                        })
                                                                    }>
                                                                    <Dots />
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {search?.requests.indexOf(user.id) !== -1 ? (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                    }}>
                                                                    <button className="btn_add_friend_search" onClick={() => cancelRequestHandler(search._id)}>
                                                                        <p>Cancel request</p>
                                                                    </button>
                                                                    {!visitor && !member && (
                                                                        <div
                                                                            className="p10_dots_friend"
                                                                            style={{
                                                                                height: "39px",
                                                                                marginTop: "30px",
                                                                            }}
                                                                            onClick={() =>
                                                                                setShowMenu({
                                                                                    id: search._id,
                                                                                    type: "search",
                                                                                })
                                                                            }>
                                                                            <Dots />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {User?.requests.indexOf(search._id) !== -1 ? (
                                                                        <div style={{ display: "flex" }}>
                                                                            <button className="btn_add_friend_search" onClick={() => acceptRequestHanlder(search._id)}>
                                                                                <p>Confirm request</p>
                                                                            </button>
                                                                            <div
                                                                                className="p10_dots_friend"
                                                                                style={{
                                                                                    height: "39px",
                                                                                    marginTop: "30px",
                                                                                }}
                                                                                onClick={() =>
                                                                                    setShowMenu({
                                                                                        id: search._id,
                                                                                        type: "search",
                                                                                    })
                                                                                }>
                                                                                <Dots />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {search._id === User._id ? (
                                                                                <></>
                                                                            ) : (
                                                                                <div
                                                                                    style={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                    }}>
                                                                                    <button className="btn_add_friend_search" onClick={() => addFriendHandler(search._id)}>
                                                                                        <p>Add Friend</p>
                                                                                    </button>
                                                                                    {!visitor && !member && (
                                                                                        <div
                                                                                            className="p10_dots_friend"
                                                                                            style={{
                                                                                                height: "39px",
                                                                                                marginTop: "30px",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                setShowMenu({
                                                                                                    id: search._id,
                                                                                                    type: "search",
                                                                                                })
                                                                                            }>
                                                                                            <Dots />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                                {showMenu.id === search._id && showMenu.type === "search" && (
                                                    <MemberMenu
                                                        admins={admins}
                                                        groupId={idGroup}
                                                        userId={user.id}
                                                        setShowMenu={setShowMenu}
                                                        token={user.token}
                                                        admin={admin}
                                                        memberId={search._id}
                                                        User={User}
                                                        getPageGroup={getPageGroup}
                                                        requests_admin={requests_admin}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
