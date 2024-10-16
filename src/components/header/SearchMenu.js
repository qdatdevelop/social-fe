import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import useClickOutside from "../../helpers/clickOutside";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
import { Link } from "react-router-dom";
export default function SearchMenu({ color, setShowSearchMenu, token }) {
  const [iconVisible, setIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const menu = useRef(null);
  const input = useRef(null);
  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });
  useEffect(() => {
    getHistory();
  }, []);
  const getHistory = async () => {
    const res = await getSearchHistory(token);
    setSearchHistory(res);
  };
  useEffect(() => {
    input.current.focus();
  }, []);
  const searchHandler = async (e) => {
    if (searchTerm === "") {
      setResults("");
    } else {
      const res = await search(searchTerm, token);
      setResults(res);
      if (e.key === "Enter") {
        window.location.href = `/search/searchTerm=${searchTerm}`;
      }
    }
  };
  const addToSearchHistoryHandler = async (searchUser, type) => {
    const res = await addToSearchHistory(searchUser, type, token);
    getHistory();
  };
  const handleRemove = async (searchId , type) => {
    removeFromSearch(searchId, type , token);
    getHistory();
  };
  console.log(searchHistory);
  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div
          className="search"
          onClick={() => {
            input.current.focus();
          }}
        >
          {iconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => {
              setIconVisible(false);
            }}
            onBlur={() => {
              setIconVisible(true);
            }}
          />
        </div>
      </div>
      {results == "" && (
        <div className="search_history_header">
          <span>Recent searches</span>
          <a>Edit</a>
        </div>
      )}
      <div className="search_history scrollbar">
        {searchHistory &&
          results == "" &&
          searchHistory
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((result) =>
              result?.type === "group" ? (
                <>
                  <div
                    className="search_group_item hover1"
                    key={result?.group?._id}
                  >
                    <Link
                      className="flex"
                      to={`/group/${result?.group?._id}`}
                      onClick={() =>
                        addToSearchHistoryHandler(result?.group?._id, "group")
                      }
                    >
                      <img src={result?.group?.cover} alt="" />
                      <span>{result?.group?.group_name}</span>
                    </Link>
                    <i
                      className="exit_icon"
                      onClick={() => {
                        handleRemove(result?.group?._id , "group");
                      }}
                    ></i>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div className="search_user_item hover1" key={result._id}>
                    <Link
                      className="flex"
                      to={`/profile/${result?.user?._id}`}
                      onClick={() =>
                        addToSearchHistoryHandler(result?.user?._id, "user")
                      }
                    >
                      <img src={result?.user?.picture} alt="" />
                      <span>
                        {result?.user?.first_name} {result?.user?.last_name}
                      </span>
                    </Link>
                    <i
                      className="exit_icon"
                      onClick={() => {
                        handleRemove(result?.user?._id , "user");
                      }}
                    ></i>
                  </div>
                </>
              )
            )}
      </div>
      <div className="search_results scrollbar">
        {results.combinedResults  &&
          results.combinedResults.map((result) =>
            result?.group_name ? (
              <>
                {" "}
                <Link
                  to={`/group/${result._id}`}
                  className="search_group_item hover1"
                  onClick={() => addToSearchHistoryHandler(result._id, "group")}
                  key={result._id}
                >
                  <img src={result.cover} alt="" />
                  <span>{result.group_name}</span>
                </Link>
              </>
            ) : (
              <>
                {" "}
                <Link
                  to={`/profile/${result._id}`}
                  className="search_user_item hover1"
                  onClick={() => addToSearchHistoryHandler(result._id, "user")}
                  key={result._id}
                >
                  <img src={result.picture} alt="" />
                  <span>
                    {result.first_name} {result.last_name}
                  </span>
                </Link>
              </>
            )
          )}
      </div>
    </div>
  );
}
