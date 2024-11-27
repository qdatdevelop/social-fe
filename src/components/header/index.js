import "./style.css";
import { Link } from "react-router-dom";
import { ArrowDown, Friends, FriendsActive, Logo, Market, Menu, Messenger, Notifications, Search, Watch } from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useEffect, useRef, useState } from "react";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./userMenu";
import NotificationMenu from "./notificationMenu";
import HomeHeader from "../../svg/home_header";
import HomeHeaderActive from "../../svg/home_header_active";
import Group from "../../svg/group";
import GroupActive from "../../svg/groupActive";
import MessMenu from "./messMenu";
export default function Header({ page, getAllPosts, notifications, getNotifications, idUser, listMess, onlineUsers, socket, openChatWindow, setOpenChatWindows }) {
    const { user } = useSelector((user) => ({ ...user }));
    const color = "#65676b";
    const [showSearchMenu, setShowSearchMenu] = useState(false);
    const [showAllMenu, setShowAllMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);
    const [showMessMenu, setShowMessMenu] = useState(false);
    let numNotification = 0;
    const unreadNotifications = [];
    notifications?.forEach((notification) => {
        if (!notification.read) {
            unreadNotifications.push(notification);
        }
    });
    numNotification = unreadNotifications.length;
    const allmenu = useRef(null);
    const messmenu = useRef(null);
    const usermenu = useRef(null);
    const notificationmenu = useRef(null);
    useClickOutside(allmenu, () => {
        setShowAllMenu(false);
    });
    useClickOutside(usermenu, () => {
        setShowUserMenu(false);
    });
    useClickOutside(notificationmenu, () => {
        setShowNotificationMenu(false);
    });
    useClickOutside(messmenu, () => {
        setShowMessMenu(false);
    });

    return (
        <header>
            <div className="header_left">
                <Link to="/" className="header_logo">
                    <div className="circle">
                        <img src="./icons/logo 2.png" alt="" />
                    </div>
                </Link>
                <div
                    className="search search1"
                    onClick={() => {
                        setShowSearchMenu(true);
                    }}>
                    <Search color={color} />
                    <input type="text" placeholder="Search Zunio" className="hide_input" />
                </div>
            </div>
            {showSearchMenu && <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} token={user.token} />}
            <div className="header_middle">
                <Link to="/" className={`middle_icon ${page === "home" ? "active" : "hover1"}`} onClick={() => getAllPosts()}>
                    {page === "home" ? <HomeHeaderActive /> : <HomeHeader color={color} />}
                </Link>
                <Link to="/friends" className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}>
                    {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
                </Link>
                <Link to="/" className="middle_icon hover1">
                    <Watch color={color} />
                    <div className="middle_notification">9+</div>
                </Link>
                <Link to="/" className="middle_icon hover1">
                    <Market color={color} />
                </Link>
                <Link to="/groups" className={`middle_icon ${page === "groups" ? "active" : "hover1"}`}>
                    {page === "groups" ? <GroupActive /> : <Group color={color} />}
                </Link>
            </div>
            <div className="header_right">
                <Link to="/profile" className={`profile_link hover1 ${page === "profile" && idUser === user.id ? "active_link" : ""}`}>
                    <img src={user?.picture} alt="" />
                    <span>{user?.last_name}</span>
                </Link>

                <div className={`circle_icon hover1 ${showAllMenu && "active_header"}`} ref={allmenu}>
                    <div
                        onClick={() => {
                            setShowAllMenu((prev) => !prev);
                        }}>
                        <div style={{ transform: "translateY(2px)" }}>
                            <Menu />
                        </div>
                    </div>

                    {showAllMenu && <AllMenu />}
                </div>
                {page !== "messages" && (
                    <>
                        {" "}
                        <div className={`circle_icon hover1 ${showMessMenu && "active_header"}`} ref={messmenu}>
                            <div
                                onClick={() => {
                                    setShowMessMenu((prev) => !prev);
                                }}>
                                <div style={{ transform: "translateY(2px)" }}>
                                    <Messenger />
                                </div>
                            </div>

                            {listMess.numNotifi > 0 && <div className="right_notification">{listMess.numNotifi}</div>}

                            {showMessMenu && (
                                <MessMenu
                                    notifications={notifications}
                                    id={user.id}
                                    token={user.token}
                                    getNotifications={getNotifications}
                                    listMess={listMess}
                                    onlineUsers={onlineUsers}
                                    socket={socket}
                                    setShowMessMenu={setShowMessMenu}
                                    openChatWindow={openChatWindow}
                                />
                            )}
                        </div>
                    </>
                )}

                <div className={`circle_icon hover1 ${showNotificationMenu && "active_header"}`} ref={notificationmenu}>
                    <div
                        onClick={() => {
                            setShowNotificationMenu((prev) => !prev);
                        }}>
                        <div style={{ transform: "translateY(2px)" }}>
                            <Notifications />
                        </div>
                    </div>

                    {unreadNotifications.length > 0 && <div className="right_notification">{numNotification}</div>}

                    {showNotificationMenu && <NotificationMenu notifications={notifications} id={user.id} token={user.token} getNotifications={getNotifications} />}
                </div>

                <div className={`circle_icon hover1 ${showUserMenu && "active_header"}`} ref={usermenu}>
                    <div
                        onClick={() => {
                            setShowUserMenu((prev) => !prev);
                        }}>
                        <div style={{ transform: "translateY(2px)" }}>
                            <ArrowDown />
                        </div>
                    </div>

                    {showUserMenu && <UserMenu user={user} setOpenChatWindows={setOpenChatWindows} />}
                </div>
            </div>
        </header>
    );
}
