import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { CallEnd, MicOff, MicOn, PersonAdd, ShareScreen, VideoCamOff, VideoCamOn } from "./IconsGroupCall";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { StringeeUtil, StringeeClient, StringeeCall, StringeeCall2 } from "stringee";
export default function GroupCall({ socket }) {
    const location = useLocation();

    const screenVideoRef = useRef(null);
    const backgroundRef = useRef(null);
    const videoRef = useRef(null);
    const [mic, setMic] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [disableButton, setDisableButton] = useState(true); // người dùng nghe máy thì false bật lên
    const [called, setCalled] = useState(false); // mặc định người nhận chưa nghe máy là false
    const audio = new Audio("/sound/ZuinoCallingSound.mp3");
    const { user } = useSelector((state) => ({ ...state }));
    const [userCall, setUserCall] = useState({});
    const [tokenCall, setTokenCall] = useState();
    const handlePlaySound = () => {
        audio.loop = true;

        audio.play().catch((error) => {
            console.error("Error playing audio: ", error);
        });
    };

    const handleAcceptCall = () => {
        audio.pause();
        audio.currentTime = 0;
        audio.loop = false;
        setCalled(true);
        setDisableButton(false);
        if (backgroundRef.current) {
            backgroundRef.current.style.backgroundImage = `url(${
                userCall?.picture || "https://images.kienthuc.net.vn/zoom/800/uploaded/thutrang/2021_10_06/7/lo-danh-tinh-gai-xinh-da-nang-noi-nhu-con-nho-buc-o-bien.jpg"
            })`;
            backgroundRef.current.style.backgroundSize = "cover";
            backgroundRef.current.style.backgroundPosition = "center";
            backgroundRef.current.style.filter = "blur(250px)";
        }
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

    const fetchUser = async (userId) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getProfile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setUserCall(data);
        } catch (error) {
            return error.response.data.message;
        }
    };

    const fetchToken = async (userId) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/call/${userId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setTokenCall(data);
        } catch (error) {
            return error.response.data.message;
        }
    };
    const queryParams = new URLSearchParams(location.search);
    const callee = queryParams.get("callee");

    useEffect(() => {
        document.title = "Messenger Call";
        fetchUser(callee);
        handlePlaySound();

        return () => {
            audio.pause();
            audio.currentTime = 0;
            audio.loop = false;
        };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.emit("acceptCall", { caller: user.id, receiver: callee });
        return () => {
            socket.off("acceptCall");
        };
    }, [socket, user, callee]);

    useEffect(() => {
        if (socket === null) return;
        socket.on("startCall", (data) => {
            console.log("startCall", data);
            handleAcceptCall();
        });

        return () => {
            socket.off("startCall");
        };
    }, [socket, user, callee]);

    useEffect(() => {
        fetchToken(user.id);

        if (tokenCall) {
            const client = new StringeeClient();
            client.connect(tokenCall);
            client.on("connect", function () {
                console.log("connected");
            });
            client.on("authen", function (res) {
                console.log("authen", res);
            });
            client.on("disconnect", function () {
                console.log("disconnected");
            });
            client.on("requestnewtoken", function () {
                console.log("++++++++++++++ requestnewtoken; please get new access_token from YourServer and call client.connect(new_access_token)+++++++++");
                //please get new access_token from YourServer and call:
                //client.connect(new_access_token);
            });
            var call = new StringeeCall(client, user.id, callee);

            call.on("error", (info) => {
                // on error
            });

            //hiển thị  video từ người gọi
            call.on("addlocalstream", (stream) => {
                videoRef.current.srcObject = stream;
            });
            //hiển thị video từ người bắt cuộc gọi
            call.on("addremotestream", (stream) => {
                screenVideoRef.current.srcObject = stream;
            });
            call.on("signalingstate", function (state) {
                console.log("signalingstate ", state);

                if (state.code === 6 || state.code === 5) {
                    //end call or callee rejected
                    // callButton.show();
                    // endCallButton.hide();
                    // rejectCallButton.hide();
                    // answerCallButton.hide();
                    videoRef.srcObject = null;
                    screenVideoRef.srcObject = null;
                    // $("#incoming-call-notice").hide();
                }
            });
            call.on("mediastate", (state) => {
                // mediastate
            });
            call.on("info", (info) => {
                // on info
            });
            call.on("otherdevice", (data) => {
                // "on otherdevice
            });

            // // AFTER THEN
            // call.hangup((res) => {
            //     // hangup res
            //     // and remove source remote video
            //     screenVideoRef.srcObject = null;
            // });
        }
    }, [tokenCall]);

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!called) {
            return;
        }

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [called]);

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;

    useEffect(() => {
        if (seconds >= 3600) {
            handleEndCall();
            clearInterval();
        } else {
        }
    }, [seconds]);

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
    const handleCameraToggle = async () => {
        if (!isCameraOn) {
            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = videoStream;
                    videoRef.current.style.display = "block";
                }
                setIsCameraOn(true);
            } catch (error) {
                console.error("Error accessing camera: ", error);
            }
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();

                tracks.forEach((track) => track.stop());

                videoRef.current.srcObject = null;
                videoRef.current.style.display = "none";
            }
            setIsCameraOn(false);
        }
    };

    return (
        <div className="container">
            <div className="call-overlay">
                <div className="call-img">
                    <img src={userCall?.picture || "Đang tải..."} alt="" />
                </div>
                <div className="call-content">
                    <h1>{userCall.first_name + userCall.last_name}</h1>
                    <div>
                        {called ? (
                            <p>
                                {minutes.toString().padStart(2, "0")}:{displaySeconds.toString().padStart(2, "0")}
                            </p>
                        ) : (
                            "Calling..."
                        )}
                    </div>
                </div>
            </div>
            <video className="video-container" ref={screenVideoRef} autoPlay></video>
            <div className="camera-overlay">
                <video className="" ref={videoRef} autoPlay></video>
            </div>

            <div className="tool-overlay">
                <div className="tool">
                    <button onClick={() => handleShareScreen()} disabled={disableButton}>
                        <ShareScreen />
                    </button>
                    <button onClick={handlePlaySound} disabled={disableButton}>
                        <PersonAdd />
                    </button>
                    <button
                        onClick={() => {
                            handleCameraToggle();
                        }}>
                        {isCameraOn ? <VideoCamOn /> : <VideoCamOff />}
                    </button>

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
