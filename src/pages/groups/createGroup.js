import { Form, Formik } from "formik";
import ChoosePrivacy from "../../components/inputs/createGroupInput/choosePrivacy";
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
import { searchFriends } from "../../functions/user";
import InviteFriends from "../../components/inputs/createGroupInput/invite_friends";
import { sendRequest } from "../../functions/group";
import { createNotification } from "../../functions/notification";
export default function CreateGroup({ setVisible, dataFriend, socket }) {
  const { user } = useSelector((user) => ({ ...user }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [results, setResults] = useState([]);
  const [invite, setInvite] = useState([]);
  const [inputValue, setInputValue] = useState(""); // Trạng thái để lưu giá trị nhập
  const groupValidation = Yup.object({
    group_name: Yup.string().required("What's your Group name ?"),
  });
  const groupInfos = {
    group_name: "", // Initialize with empty values
    privacy: "", // Initialize with empty values
    inviteFriends: "", // Initialize with empty values
  };
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInputValue(value); // Cập nhật trạng thái với giá trị nhập
    setShowSearchMenu(value.trim() !== "");
    if (value === "") {
      setResults([]);
    } else {
      const res = await searchFriends(value, dataFriend.friends, user.token);
      // Loại bỏ những người dùng đã có trong danh sách mời khỏi danh sách tìm kiếm
      setInvite(invite);
      const filteredResults = res.filter((user) => !invite.includes(user._id));
      setResults(filteredResults);
    }
  };

  const addToInvite = (friend) => {
    const updatedInviteList = [...inviteFriends];
    const updateInvite = invite;
    if (!updatedInviteList.includes(friend)) {
      updatedInviteList.push(friend);
      updateInvite.push(friend._id);
      setInvite(updateInvite);
      setGroup({ ...group, inviteFriends: updatedInviteList });
      const filteredResults = results.filter(
        (user) => !invite.includes(user._id)
      );

      setResults(filteredResults);
    } else {
      console.log("User already invited");
    }
  };
  const removeInvite = (friend) => {
    // Tạo một bản sao của danh sách inviteFriends và loại bỏ userId

    const updatedInviteList = inviteFriends.filter(
      (user) => user._id !== friend._id
    );
    const updateInvite = invite.filter((id) => id !== friend._id);
    setInvite(updateInvite);
    // Cập nhật trạng thái inviteFriends với danh sách mới
    setGroup({ ...group, inviteFriends: updatedInviteList });
    // setResults((prevAddedUsers) => [...prevAddedUsers, friend]);
  };

  const [group, setGroup] = useState(groupInfos);
  const { group_name, privacy, inviteFriends } = group;

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };

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

  const groupSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/creatGroup`,
        {
          group_name,
          privacy,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      for (const receiverId of invite) {
        console.log("notifi");
        notification(data.group._id, receiverId);
      }
      setError("");
      setSuccess(data.message);
      const { message, ...rest } = data;
      setTimeout(() => {
        navigate(`/group/${data.group._id}`);
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };

  return (
    <div className="blur">
      <div className="register">
        <div className="register_header">
          <i className="exit_icon" onClick={() => setVisible(false)}></i>
          <span>Create group</span>
          <span>it's quick and easy</span>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            group_name,
            privacy,
            inviteFriends,
            invite,
          }}
          validationSchema={groupValidation}
          onSubmit={() => {
            groupSubmit();
          }}
        >
          {(formik) => (
            <Form className="register_form">
              <div className="reg_line">
                <GroupInput
                  type="text"
                  placeholder="Group name"
                  name="group_name"
                  onChange={handleGroupChange}
                />
              </div>
              <div className="reg_line">
                <ChoosePrivacy
                  type="text"
                  name="privacy"
                  onChange={handleGroupChange}
                />
              </div>
              <div className="reg_line">
                <InviteFriends
                  removeInvite={removeInvite}
                  inviteFriends={inviteFriends}
                  type="text"
                  placeholder="Invite friends"
                  name="invite_friends"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyUp={handleInputChange}
                />
              </div>
              <div className="reg_line">
                {showSearchMenu && (
                  <SearchInviteFriends
                    results={results}
                    inputValue={inputValue}
                    addToInvite={addToInvite}
                  />
                )}
              </div>
              <div className="reg_btn_wrapper">
                <button className="blue_btn open_signup">Create group</button>
              </div>
              <DotLoader color="#1876f2" loading={loading} size={30} />
              {error && <div className="error_text">{error}</div>}
              {success && <div className="success_text">{success}</div>}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
