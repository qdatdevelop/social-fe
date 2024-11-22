import LeftLink from "./LeftLink";
import "./style.css";
import { left } from "../../../data/home";
import { Link } from "react-router-dom";
import { ArrowDown1 } from "../../../svg";
import { useState } from "react";
import Shortcut from "./Shortcut";
export default function LeftHome({ user }) {
    return (
        <div className="left_home scrollbar">
            <Link to="/profile" className="left_link hover2">
                <img src={user?.picture} alt="" />
                <span>
                    {user?.first_name} {user.last_name}
                </span>
            </Link>

            {left.slice(0, 8).map((link, i) => (
                <LeftLink key={i} img={link.img} text={link.text} notification={link.notification} to={link.to} />
            ))}

            <div className="splitter"></div>
            <div className="shortcut">
                <div className="heading">Your Shortcuts</div>
                <div className="edit_shortcut">Edit</div>
            </div>
            <div className={`fb_copyright `}>
                <Link to="/">Privacy </Link>
                <span>. </span>
                <Link to="/">Terms </Link>
                <span>. </span>
                <Link to="/">Advertising </Link>
                <span>. </span>
                <Link to="/">
                    Ad Choices <i className="ad_choices_icon"></i>{" "}
                </Link>
                <span>. </span>
                <Link to="/"></Link>Cookies <span>. </span>
                <Link to="/">More </Link>
                <span>. </span> <br />
                Zunio © 2024
            </div>
        </div>
    );
}
