import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { CallEnd, MicOff, MicOn, PersonAdd, ShareScreen, VideoCamOff, VideoCamOn } from "./IconsGroupCall";
export default function GroupCall() {
    const screenVideoRef = useRef(null);
    const backgroundRef = useRef(null);
    const [mic, setMic] = useState(true);
    const [cam, setCam] = useState(true);
    const [disableButton, setDisableButton] = useState(true); // người dùng nghe máy thì false bật lên
    const [called, setCalled] = useState(false); // mặc định người nhận chưa nghe máy là false
    const audio = new Audio("/sound/FacebookCallingSound.mp3");

    const handlePlaySound = () => {
        audio.loop = true;

        audio.play().catch((error) => {
            console.error("Error playing audio: ", error);
        });

        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.loop = false;
            setDisableButton(false);
            if (backgroundRef.current) {
                backgroundRef.current.style.backgroundImage = `url(https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg)`;
                backgroundRef.current.style.backgroundSize = "cover";
                backgroundRef.current.style.backgroundPosition = "center";
                backgroundRef.current.style.filter = "blur(250px)";
            }
        }, 5000);
    };

    const handleEndCall = () => {
        audio.pause();
        audio.currentTime = 0;

        if (window.opener) {
            window.close();
        } else {
            alert("Cửa sổ không thể đóng vì nó không được mở bởi window.open()");
        }
    };

    useEffect(() => {
        document.title = "Messenger Call";
        handlePlaySound();
        return () => {
            audio.pause();
            audio.currentTime = 0;
            audio.loop = false;
        };
    }, []);

    const handleShareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });
            // Gán stream video vào video element bằng ref
            if (screenVideoRef.current) {
                screenVideoRef.current.srcObject = screenStream;
                screenVideoRef.current.style.display = "block";

                // Lắng nghe sự kiện "ended" để biết khi nào người dùng tắt chia sẻ màn hình
                screenStream.getVideoTracks()[0].addEventListener("ended", () => {
                    screenVideoRef.current.style.display = "none";
                });
            }
        } catch (error) {
            console.error("Error sharing screen: ", error);
        }
    };
    return (
        <div className="container">
            {!called && (
                <div className="call-overlay">
                    <div className="call-img">
                        <img
                            src="https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474014bom/anh-gai-xinh-cute-de-thuong-hot-girl-2.jpg"
                            alt=""
                        />
                    </div>
                    <div className="call-content">
                        <h1>Trong An</h1>
                        <p>Calling...</p>
                    </div>
                </div>
            )}
            <video className="video-container" ref={screenVideoRef} autoPlay></video>

            <div className="tool-overlay">
                <div className="tool">
                    <button onClick={() => handleShareScreen()} disabled={disableButton}>
                        <ShareScreen />
                    </button>
                    <button onClick={handlePlaySound} disabled={disableButton}>
                        <PersonAdd />
                    </button>
                    <button onClick={() => setCam(!cam)}>{cam ? <VideoCamOn /> : <VideoCamOff />}</button>

                    <button onClick={() => setMic(!mic)}>{mic ? <MicOn /> : <MicOff />}</button>
                    <button className="callend" onClick={handleEndCall}>
                        <CallEnd />
                    </button>
                </div>
            </div>
            <div className="bg-back" ref={backgroundRef}></div>
        </div>
    );
}
