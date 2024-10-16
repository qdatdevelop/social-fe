import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";
import FriendRequests from "./FriendRequests";
import NotifiBirth from "./NotifiBirth";
import InviteGroup from "./InviteGroup";
import "./style.css";
import RoomMess from "./RoomMess";
export default function RightHome({
  user,
  dataFriend,
  getDataFriend,
  setShowChat,
  socket,
  dataByBirthday,
  getDatafriendsByBirthday,
  dataRoomMess,
  setShowChatRoom,
  onlineUsers,
  getListMess,
  openChatWindow,
  listMess
}) {
  const color = "#65676b";

  return (
    <div className="right_home scrollbar" style={{width:"313px"}}>
      <div className="heading">Friend requests</div>
      <FriendRequests
        user={user}
        dataFriend={dataFriend}
        getDataFriend={getDataFriend}
        socket={socket}
      />
      <div className="splitter1"></div>

      <div className="heading">Invitations to join the group</div>
      <InviteGroup
        user={user}
        dataFriend={dataFriend}
        getDataFriend={getDataFriend}
        socket={socket}
      />
      <div className="splitter1"></div>

      <div className="heading">Birthdays</div>
      <NotifiBirth
        user={user}
        dataFriend={dataFriend}
        getDataFriend={getDataFriend}
        socket={socket}
        dataByBirthday={dataByBirthday}
        getDatafriendsByBirthday={getDatafriendsByBirthday}
      />
      <div className="splitter1"></div>

      <div className="contacts_wrap">
        <div className="contacts_header">
          <div className="contacts_header_left">Contacts</div>
          <div className="contacts_header_right">
            <div className="contact_circle hover1">
              <NewRoom color={color} />
            </div>
            <div className="contact_circle hover1">
              <Search color={color} />
            </div>
            <div className="contact_circle hover1">
              <Dots color={color} />
            </div>
          </div>
        </div>
        <div className="contacts_list">
          <Contact
            user={user}
            dataFriend={dataFriend}
            setShowChat={setShowChat}
            setShowChatRoom={setShowChatRoom}
            onlineUsers={onlineUsers}
            getListMess={getListMess}
            openChatWindow={openChatWindow}
            listMess={listMess}
          />
        </div>
        <div className="splitter1"></div>
        <div className="contacts_header">
          <div className="contacts_header_left">Your community chats</div>
        </div>
        <div className="contacts_list">
          <RoomMess
            user={user}
            dataRoomMess={dataRoomMess}
            setShowChatRoom={setShowChatRoom}
            setShowChat={setShowChat}
            onlineUsers={onlineUsers}
            openChatWindow={openChatWindow}
            getListMess={getListMess}
          />
        </div>
      </div>
    </div>
  );
}
