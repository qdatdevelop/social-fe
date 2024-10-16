import { Link, useNavigate, useParams } from "react-router-dom";

import { useEffect, useReducer, useState, useRef } from "react";
import { getFriendsPageInfos } from "../../functions/user";
import { friendspage } from "../../functions/reducers";
import { HashLoader } from "react-spinners";
import FriendCard from "./FriendCard";
import SearchMenuFriend from "./SearchMenuFriend";
import { Search } from "../../svg";
import { searchFriends, searchFriendsByBirthday } from "../../functions/user";
export default function FriendMenu({
  sk,
  idUser,
  loading,
  dataFriend,
  getDataFriend,
  user,
  getDatafriendsByBirthday,
  dataByBirthday,
  visitor,
  profile,
  User,
  getUser,
  socket,
  getProfile
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const searchHandler = async () => {
    if (searchTerm === "") {
      setResults("");
    } else if (sk === "friends" || sk === "friends_all") {
      const res = await searchFriends(searchTerm, profile.friends, user.token);
      setResults(res);
    } else if (sk === "friends_with_upcoming_birthdays") {
      const res = await searchFriendsByBirthday(
        searchTerm,
        dataByBirthday.upcomingBirthdays,
        user.token
      );
      setResults(res);
    } else if (sk === "friends_mutual") {
      const res = await searchFriendsByBirthday(
        searchTerm,
        profile.mutualFriends,
        user.token
      );
      setResults(res);
    }
  };
  const input = useRef(null);

  const color = "#65676b";
  return (
    <div className="profile_menu_wrap">
      <div className="header_friend" style={{width: "1029.21px"}}>
        {visitor ? (
          <>
            <h1>Friends</h1>
            <div className="search_vistor search1">
              <Search color={color} />
              <input
                type="text"
                placeholder="Search Facebook"
                className="hide_input"
                ref={input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={searchHandler}
              />
            </div>
          </>
        ) : (
          <>
            <h1 style={{ marginRight: "420px" }}>Friends</h1>
            <div className="search search1">
              <Search color={color} />
              <input
                type="text"
                placeholder="Search Facebook"
                className="hide_input"
                ref={input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={searchHandler}
              />
            </div>
            <div className="menu_friend" style={{right:"0" , position: "absolute"}}>
              <Link to={"/friends/requests"} className={"hover1"}>
                Friend requests
              </Link>
              <Link to={"/friends/sent"} className={"hover1"}>
                Find Friends
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="profile_menu_friend">
        <Link
          onClick={() => {
            setSearchTerm("");
            setResults("");
          }}
          to={
            idUser
              ? `/profile/${idUser}&sk=friends_all`
              : "/profile&sk=friends_all"
          }
          className={
            sk === "friends" || sk === "friends_all"
              ? "profile_menu_active"
              : "hover1"
          }
        >
          All friends
        </Link>
        {!visitor && (
          <>
            {" "}
            <Link
              onClick={() => {
                setSearchTerm("");
                setResults("");
              }}
              to={
                idUser
                  ? `/profile/${idUser}&sk=friends_with_upcoming_birthdays`
                  : "/profile&sk=friends_with_upcoming_birthdays"
              }
              className={
                sk === "friends_with_upcoming_birthdays"
                  ? "profile_menu_active"
                  : "hover1"
              }
            >
              Birthdays
            </Link>
          </>
        )}
        {profile.mutualFriends?.length > 0 && visitor && (
          <>
            {" "}
            <Link
              onClick={() => {
                setSearchTerm("");
                setResults("");
              }}
              to={
                idUser
                  ? `/profile/${idUser}&sk=friends_mutual`
                  : "/profile&sk=friends_mutual"
              }
              style={{ width: "100px" }}
              className={
                sk === "friends_mutual"
                  ? "profile_menu_active_content "
                  : "hover1"
              }
            >
              Mutual Friends
            </Link>
          </>
        )}
      </div>
      <div
        className="bottom-content"
        style={{
          justifyContent:
            (profile.friends?.length > 0 &&
              searchTerm === "" &&
              (sk === "friends" || sk === "friends_all")) ||
            (dataByBirthday.upcomingBirthdays?.length &&
              searchTerm === "" &&
              sk === "friends_with_upcoming_birthdays" > 0) ||
            (profile.mutualFriends?.length > 0 &&
              searchTerm === "" &&
              sk === "friends_mutual")
              ? "flex-start"
              : "center",
        }}
      >
        <>
          {loading ? (
            <div className="sekelton_loader_friends">
              <HashLoader color="#1876f2" />
            </div>
          ) : (
            <>
              {(sk === "friends" && profile.friends) ||
              (sk === "friends_all" && profile.friends) ? (
                <>
                  <div className="friend-cards-container">
                    {results === "" || searchTerm === "" ? (
                      <>
                        {profile.friends.length > 0 ? (
                          profile.friends
                            .reduce((rows, user, index) => {
                              if (index % 2 === 0) {
                                // Bắt đầu một hàng mới nếu là thẻ chẵn đầu tiên
                                rows.push([user]);
                              } else {
                                // Thêm thẻ chẵn thứ hai vào hàng hiện tại
                                rows[rows.length - 1].push(user);
                              }
                              return rows;
                            }, [])
                            .map((row, rowIndex) => (
                              <div className="friend-card-row" key={rowIndex}>
                                {row.map((user, cardIndex) => (
                                  <FriendCard
                                    userr={user}
                                    key={cardIndex}
                                    type="friends"
                                    getDataFriend={getDataFriend}
                                    sk={sk}
                                    User={User}
                                    getUser={getUser}
                                    socket={socket}
                                    getProfile={getProfile}
                                  />
                                ))}
                              </div>
                            ))
                        ) : (
                          <div className="No_results">
                            <p>No user to show</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {results.length > 0 ? (
                          results
                            .reduce((rows, user, index) => {
                              if (index % 2 === 0) {
                                // Bắt đầu một hàng mới nếu là thẻ chẵn đầu tiên
                                rows.push([user]);
                              } else {
                                // Thêm thẻ chẵn thứ hai vào hàng hiện tại
                                rows[rows.length - 1].push(user);
                              }
                              return rows;
                            }, [])
                            .map((row, rowIndex) => (
                              <div className="friend-card-row" key={rowIndex}>
                                {row.map((user, cardIndex) => (
                                  <FriendCard
                                    userr={user}
                                    key={cardIndex}
                                    type="friends"
                                    getDataFriend={getDataFriend}
                                    sk={sk}
                                    User={User}
                                    getUser={getUser}
                                    socket={socket}
                                    getProfile={getProfile}
                                  />
                                ))}
                              </div>
                            ))
                        ) : (
                          <div className="No_results">
                            <p>No results for: {searchTerm}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                ""
              )}
              {sk === "friends_with_upcoming_birthdays" && (
                <div className="friend-cards-container">
                  <>
                    {results === "" || searchTerm === "" ? (
                      <>
                        {" "}
                        {dataByBirthday.upcomingBirthdays?.length > 0 ? (
                          dataByBirthday.upcomingBirthdays
                            .reduce((rows, user, index) => {
                              if (index % 2 === 0) {
                                // Bắt đầu một hàng mới nếu là thẻ chẵn đầu tiên
                                rows.push([user]);
                              } else {
                                // Thêm thẻ chẵn thứ hai vào hàng hiện tại
                                rows[rows.length - 1].push(user);
                              }
                              return rows;
                            }, [])
                            .map((row, rowIndex) => (
                              <div className="friend-card-row" key={rowIndex}>
                                {row.map((user, cardIndex) => (
                                  <FriendCard
                                    userr={user}
                                    key={cardIndex}
                                    type="friends"
                                    getData={getDatafriendsByBirthday}
                                    sk={sk}
                                    User={User}
                                    getUser={getUser}
                                    socket={socket}
                                    getProfile={getProfile}
                                  />
                                ))}
                              </div>
                            ))
                        ) : (
                          <div className="No_results">
                            <p>No user to show</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {results?.length > 0 ? (
                          results
                            .reduce((rows, user, index) => {
                              if (index % 2 === 0) {
                                // Bắt đầu một hàng mới nếu là thẻ chẵn đầu tiên
                                rows.push([user]);
                              } else {
                                // Thêm thẻ chẵn thứ hai vào hàng hiện tại
                                rows[rows.length - 1].push(user);
                              }
                              return rows;
                            }, [])
                            .map((row, rowIndex) => (
                              <div className="friend-card-row" key={rowIndex}>
                                {row.map((user, cardIndex) => (
                                  <FriendCard
                                    userr={user}
                                    key={cardIndex}
                                    type="friends"
                                    getData={getDatafriendsByBirthday}
                                    sk={sk}
                                    User={User}
                                    getUser={getUser}
                                    socket={socket}
                                    getProfile={getProfile}
                                  />
                                ))}
                              </div>
                            ))
                        ) : (
                          <div className="No_results">
                            <p>No results for: {searchTerm}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                </div>
              )}
              {sk === "friends_mutual" && (
                <>
                  {" "}
                  <div className="friend-cards-container">
                    {results === "" || searchTerm === "" ? (
                      <>
                        {profile?.mutualFriends?.length > 0 ? (
                          profile?.mutualFriends
                            .reduce((rows, user, index) => {
                              if (index % 2 === 0) {
                                // Bắt đầu một hàng mới nếu là thẻ chẵn đầu tiên
                                rows.push([user]);
                              } else {
                                // Thêm thẻ chẵn thứ hai vào hàng hiện tại
                                rows[rows.length - 1].push(user);
                              }
                              return rows;
                            }, [])
                            .map((row, rowIndex) => (
                              <div className="friend-card-row" key={rowIndex}>
                                {row.map((user, cardIndex) => (
                                  <FriendCard
                                    userr={user}
                                    key={cardIndex}
                                    type="friends"
                                    getDataFriend={getDataFriend}
                                    sk={sk}
                                    User={User}
                                    getUser={getUser}
                                    socket={socket}
                                    getProfile={getProfile}
                                  />
                                ))}
                              </div>
                            ))
                        ) : (
                          <div className="No_results">
                            <p>No user to show</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {results.length > 0 ? (
                          results
                            .reduce((rows, user, index) => {
                              if (index % 2 === 0) {
                                // Bắt đầu một hàng mới nếu là thẻ chẵn đầu tiên
                                rows.push([user]);
                              } else {
                                // Thêm thẻ chẵn thứ hai vào hàng hiện tại
                                rows[rows.length - 1].push(user);
                              }
                              return rows;
                            }, [])
                            .map((row, rowIndex) => (
                              <div className="friend-card-row" key={rowIndex}>
                                {row.map((user, cardIndex) => (
                                  <FriendCard
                                    userr={user}
                                    key={cardIndex}
                                    type="friends"
                                    getDataFriend={getDataFriend}
                                    sk={sk}
                                    User={User}
                                    getUser={getUser}
                                    socket={socket}
                                    getProfile={getProfile}
                                  />
                                ))}
                              </div>
                            ))
                        ) : (
                          <div className="No_results">
                            <p>No results for: {searchTerm}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}
