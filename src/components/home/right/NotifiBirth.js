import { acceptRequest, deleteRequest } from "../../../functions/user";
import { Link } from "react-router-dom";
import { createNotification } from "../../../functions/notification";
export default function NotifiBirth({
  user,
  dataFriend,
  getDataFriend,
  socket,
  dataByBirthday,
}) {
  return (
    <>
      {dataByBirthday.upcomingBirthdays?.length > 0 && (
        <div className="contact hover3">
          <i className="birth_icon"></i>
          <p>
            {dataByBirthday.upcomingBirthdays[0]?.first_name} {dataByBirthday.upcomingBirthdays[0]?.last_name}{" "}
            {dataByBirthday.upcomingBirthdays[0]?.daysToBirthdayMessage}.
          </p>
        </div>
      )}
    </>
  );
}
