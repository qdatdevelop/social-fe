import { Link } from "react-router-dom";
export default function Friends({ friends, idUser }) {
  return (
    <>
      <div className="profile_card">
        <div className="profile_card_header">
          Friends
          <Link
            to={
              idUser ? `/profile/${idUser}&sk=friends` : "/profile&sk=friends"
            }
            className="profile_header_link"
          >
            See all friends
          </Link>
        </div>
        {friends && (
          <div className="profile_card_count">
            {friends.length === 0
              ? ""
              : friends.length === 1
              ? "1 Friend"
              : `${friends.length} Friends`}
          </div>
        )}
        <div className="profile_card_grid">
          {friends &&
            friends.slice(0, 9).map((friend, i) => (
              <Link
                to={`/profile/${friend._id}`}
                className="profile_photo_card"
                key={i}
              >
                <img src={friend.picture} alt="" />
                <span className="hover6" style={{fontSize: "14px" , fontWeight: "600"}}>
                  {friend.first_name} {friend.last_name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
