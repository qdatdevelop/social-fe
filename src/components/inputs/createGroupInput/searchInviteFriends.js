import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
export default function SearchInviteFriends({
  results,
  inputValue,
  addToInvite,
}) {
  return (
    <>
      <div className="reg_grid_privacy">
        <div className=" search_area_invite_friends ">
          <div className="search_results scrollbar">
            {results.length > 0 ? (
              results.map((friend) => (
                <div
                  className="search_user_item hover1"
                  key={friend._id}
                  onClick={() => addToInvite(friend)}
                >
                  <img src={friend.picture} alt="" />
                  <span>
                    {friend.first_name} {friend.last_name}
                  </span>
                </div>
              ))
            ) : (
              <div
                className="No_results"
                style={{ marginLeft: "0", fontSize: "15px" }}
              >
                <p>No results for: {inputValue}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
