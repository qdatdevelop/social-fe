import { getUser } from "../../../functions/user";
import { useEffect, useRef, useState } from "react";
export default function RoomMess({
  user,
  dataRoomMess,
  setShowChatRoom,
  setShowChat,
  onlineUsers,
  openChatWindow
}) {
  const offroom = (room) => {
    openChatWindow(room);
  };

  return (
    <>
      {dataRoomMess &&
        dataRoomMess.roomMess?.map((room) => (
          <>
            <div
              className="contact hover3"
              onClick={() => {
                offroom(room);
              }}
            >
              <div className="contact_img">
                <img
                  src="https://scontent.xx.fbcdn.net/v/t1.15752-9/311070626_1205014643680530_1668259112361737223_n.png?stp=dst-png_p206x206&_nc_cat=1&ccb=1-7&_nc_sid=61f064&_nc_eui2=AeHfBBLA5FlKKmGPuagiNTCojrnsystYOW6OuezKy1g5bpHeCc5WAkItMMppJAXcH7ie72ft81ZTeWwLzZeck5Rs&_nc_ohc=KYklkO2PBPEAX81938B&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdT74-ubXg7-mnF7yFEQfZ0Y4WXQfcDacUYeZFqq-QE_7g&oe=65DE9B87"
                  alt=""
                />
              </div>
              {room?.groupRef?.members?.map((member) => {
                const isUserOnline = onlineUsers.some(
                  (userOnline) =>
                    userOnline.userId === member?.user &&
                    userOnline.userId !== user.id &&
                    member?.user !== user.id
                );

                return isUserOnline ? (
                  <div key={member.user} className="state_active_user" />
                ) : null;
              })}

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{room?.room_name}</span>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#65676B",
                    fontWeight: "400",
                  }}
                >
                  {room?.groupRef.group_name}
                </p>
              </div>
            </div>
          </>
        ))}
    </>
  );
}
