import "./style.css";
import { useEffect, useReducer, useState } from "react";
export default function ContainFriends({
  results,
  inputValue,
  addToInvite,
  invite,
  setInvite
}) {
  useEffect(() => {
    setInvite(invite);
  }, [invite, setInvite]);

  return (
    <div className="container_invite_friends ">
      <div className="head_invite_friends">
        <p>{invite?.length} friends selected</p>
      </div>
      <div className="bottom_invite_friends scrollbar">
        {invite &&
          invite.map((friend) => (
            <>
              <div className="contact hover3" key={friend._id}>
                <div className="contact_img">
                  <img src={friend?.picture} alt="" />
                </div>
                <span>
                  {friend?.first_name} {friend?.last_name}
                </span>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
