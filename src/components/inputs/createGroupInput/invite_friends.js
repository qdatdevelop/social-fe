import "./style.css";
import { useField, ErrorMessage } from "formik";
import { useMediaQuery } from "react-responsive";
export default function InviteFriends({
  removeInvite,
  inviteFriends,
  placeholder,
  bottom,
  ...props
}) {
  const [field, meta] = useField(props);
  const view1 = useMediaQuery({
    query: "(min-width: 539px)",
  });

  // const friendsNotInMembers =
  //   inviteFriends?.friends?.filter(
  //     (friend) =>
  //       !inviteFriends.members?.some((memberId) => memberId === friend._id)
  //   ) || [];

  // console.log(inviteFriends.friends);
  // console.log(inviteFriends.members);
  return (
    <div className="input_wrap register_input_wrap">
      <div
        className={meta.touched && meta.error ? "input_error_border" : ""}
        style={{
          width: `${
            view1 && (field.name === "first_name" || field.name === "last_name")
              ? "100%"
              : view1 && (field.name === "email" || field.name === "password")
              ? "370px"
              : "300px"
          }`,
        }}
      ></div>
      <input
        type={field.type}
        name={field.name}
        placeholder={placeholder}
        {...field}
        {...props}
      />
      {inviteFriends.length > 0 && (
        <div className="invite-friends-list">
          {inviteFriends.map((user) => (
            <div
              className="light_blue_btn "
              style={{ marginTop: "10px", color: "#5496FF", cursor: "auto" }}
              key={user.id}
            >
              <div className="user_invite">
                <img
                  src={user.picture}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt=""
                />
                <span>
                  {user.first_name} {user.last_name}
                </span>
                <div
                  className="search_user_item dots_friends "
                  onClick={() => removeInvite(user)}
                >
                  <i className="exit_icon" style={{}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
