import "./style.css";

export default function ChooseFriends({ results, addinvite, selectedFriends }) {
  return (
    <div className="container_choose_friends">
      <div className="head_choose_friends">
        <p>Suggested</p>
      </div>
      <div className="bottom_invite_friends scrollbar">
        {results &&
          results?.map((friend) => (
            <>
              <div
                className={`contact hover3 ${
                  selectedFriends.includes(friend._id) ? "selected" : ""
                }`}
                key={friend._id} // Add a unique key for each friend
                onClick={() => {
                  addinvite(friend);
                }}
              >
                <div className="contact_img">
                  <img src={friend?.picture} alt="" />
                </div>
                <span>
                  {friend?.first_name} {friend?.last_name}
                </span>
                <div className="check_choose">
                  {selectedFriends.includes(friend._id) ? (
                    <>
                      {" "}
                      <i className="choose_square_icon"></i>
                    </>
                  ) : (
                    <>
                      {" "}
                      <i className="square_icon"></i>
                    </>
                  )}
                </div>
              </div>
            </>
          ))}
          
      </div>
    </div>
  );
}
