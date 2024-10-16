import { Form, Formik } from "formik";

import GroupInput from "../../components/inputs/createGroupInput";
import * as Yup from "yup";
import DotLoader from "react-spinners/DotLoader";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Search } from "../../svg";
import { useEffect, useReducer, useState } from "react";
import SearchInviteFriends from "../../components/inputs/createGroupInput/searchInviteFriends";
import { getFriendsNotInGroup, searchFriends } from "../../functions/user";
import InviteFriends from "../../components/inputs/createGroupInput/invite_friends";
import { sendRequest } from "../../functions/group";
import { createNotification } from "../../functions/notification";
import ContainFriends from "../../components/inputs/createGroupInput/containFriends";
import ChooseFriends from "../../components/inputs/createGroupInput/chooseFriends";
export default function InviteMembers({
  setVisibleInvite,
  socket,
  dataPageGroup,
}) {
  const { user } = useSelector((user) => ({ ...user }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsAll, setResultsAll] = useState([]);
  const [resultsId, setResultsId] = useState([]);
  const [invite, setInvite] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const searchHandler = async (e) => {
    if (searchTerm === "") {
      setResults(resultsAll);
    } else {
      const res = await searchFriends(searchTerm, resultsId, user.token);
      setResults(res);
    }
  };

  const getFriends = async () => {
    const res = await getFriendsNotInGroup(dataPageGroup?._id, user.token);
    if (res.status === "ok") {
      setResults(res.data.friendsNotInGroup);
      setResultsAll(res.data.friendsNotInGroup);
      setResultsId(res.data.friendIdsNotInGroup);
    }
  };

  const addinvite = (friend) => {
    // Check if the friend is already in the invite list
    if (selectedFriends.includes(friend._id)) {
      // Friend is already selected, remove it
      setInvite(
        invite.filter((invitedFriend) => invitedFriend._id !== friend._id)
      );
      setSelectedFriends(
        selectedFriends.filter(
          (selectedFriend) => selectedFriend !== friend._id
        )
      );
    } else {
      // Friend is not selected, add it
      setInvite([...invite, friend]);
      setSelectedFriends([...selectedFriends, friend._id]);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  const color = "#65676b";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const notification = async (idGroup, receiverId) => {
    await sendRequest(idGroup, user.id, receiverId, user.token);
    const newNotification = await createNotification(
      receiverId,
      "invitejoinGroup",
      null,
      null,
      `/group/${idGroup}`,
      ` <b>${user.first_name} ${user.last_name}</b> has sent you an invitation to the group.`,
      user.token,
      idGroup
    );

    socket.emit("sendNotification", {
      senderId: user.id,
      sender_first_name: user.first_name,
      sender_last_name: user.last_name,
      sender_picture: user.picture,
      receiverId: receiverId,
      type: "invitejoinGroup",
      postId: "",
      commentId: "",
      link: `/group/${idGroup}`,
      description: `<b>${user.first_name} ${user.last_name}</b> has sent you an invitation to the group.`,
      id: newNotification.newnotification._id,
      createdAt: newNotification.newnotification.createdAt,
      groupId: idGroup,
    });
  };

  const invitesSubmit = () => {
    for (const invitee of invite) {
      notification(dataPageGroup?._id, invitee._id);
    }

    setSuccess("Invites complete!");

    setTimeout(() => {
      navigate(`/group/${dataPageGroup?._id}`);
    }, 2000);
  };

  return (
    <div className="blur">
      <div
        className="register"
        style={{ display: "inline-block", width: "800px" }}
      >
        <div className="register_header">
          <i className="exit_icon" onClick={() => setVisibleInvite(false)}></i>
          <span>Invite friends to this group</span>
        </div>

        <div className="register_form">
          <div className="reg_line">
            <div>
              <div className="search search1">
                <Search color={color} />
                <input
                  type="text"
                  placeholder="Search for friends by name"
                  className="hide_input"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={searchHandler}
                  style={{ width: "426px" }}
                />
              </div>
              <ChooseFriends
                results={results}
                addinvite={addinvite}
                selectedFriends={selectedFriends}
              />
            </div>

            <ContainFriends invite={invite} setInvite={setInvite} />
          </div>
          <div className="mmenu_splitter"></div>
          <div className="reg_btn_wrapper">
            <button
              className="blue_btn"
              style={{ marginLeft: "auto" }}
              onClick={() => {
                invitesSubmit();
              }}
            >
              Send invites
            </button>
          </div>
          <DotLoader color="#1876f2" loading={loading} size={30} />
          {error && <div className="error_text">{error}</div>}
          {success && <div className="success_text">{success}</div>}
        </div>
      </div>
    </div>
  );
}
