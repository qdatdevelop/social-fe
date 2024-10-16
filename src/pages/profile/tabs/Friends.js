import { Link, useParams } from "react-router-dom";
import "./style.css";
import FriendMenu from "../../../components/friend/FriendMenu";
export default function Friends({
  sk,
  idUser,
  loading,
  dataFriend,
  getDataFriend,
  getDatafriendsByBirthday,
  dataByBirthday,
  user,
  visitor,
  profile,
  User,
  getUser,
  socket,
  getProfile
}) {
  return (
    <div className="about_card">
      <FriendMenu
        sk={sk}
        profile={profile}
        idUser={idUser}
        loading={loading}
        dataFriend={dataFriend}
        dataByBirthday={dataByBirthday}
        getDataFriend={getDataFriend}
        getDatafriendsByBirthday={getDatafriendsByBirthday}
        user={user}
        visitor={visitor}
        User={User}
        getUser={getUser}
        socket={socket}
        getProfile={getProfile}
      />
    </div>
  );
}
