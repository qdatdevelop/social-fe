import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { Call, Close } from "./IconsGroupCall";
import "./index.css";
import { useSelector } from "react-redux";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

export default function CallModalPopup({ socket, receiver }) {
    console.log(receiver);
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(true);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        subtitle.style.color = "#f00";
    }

    function closeModal() {
        setIsOpen(false);
    }

    const handleDeclineCall = () => {
        console.log("decline");
    };
    const { user } = useSelector((state) => ({ ...state }));
    const handleAcceptCall = () => {
        window.open(`http://localhost:3000/groupcall?callee=${receiver}`, "popupWindow", "width=1200,height=700");
    };

    return (
        <Modal isOpen={modalIsOpen} onAfterOpen={afterOpenModal} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
            <div className="con">
                <div className="header">
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Incomming Call</h2>
                </div>
                <button onClick={closeModal} className="close">
                    <Close />
                </button>
                <div className="avatar">
                    <img src="https://images.kienthuc.net.vn/zoom/800/uploaded/thutrang/2021_10_06/7/lo-danh-tinh-gai-xinh-da-nang-noi-nhu-con-nho-buc-o-bien.jpg" alt="" />
                </div>
                <div className="content">
                    <p>Incoming audio call</p>
                    <p className="text-gray">The call will start as soon as you accept</p>
                </div>
                <div className="footer">
                    <button className="decline" onClick={handleDeclineCall}>
                        <Close />
                    </button>
                    <button className="accept" onClick={handleAcceptCall}>
                        <Call />
                    </button>
                </div>
            </div>
        </Modal>
    );
}
