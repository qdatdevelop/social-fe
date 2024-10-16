import { useRef, useState } from "react";
import MenuItem from "../../components/post/MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
import { removememberingroup } from "../../functions/group";
import {
  leavegroup,
  removeasadmin,
  inviteasadmin,
  cancelinviteasadmin, 
  acceptinviteasadmin
} from "../../functions/group";
export default function MemberMenu({
  userId,
  setShowMenu,
  token,
  admin,
  memberId,
  User,
  groupId,
  getPageGroup,
  admins,
  requests_admin,
}) {
  const [test, setTest] = useState(true);
  const menu = useRef(null);
  useOnClickOutside(menu, () => setShowMenu(false));
  const foundAdminInGroup = admins.some(
    (admin) => admin.user._id.toString() === memberId
  );
  const setmemberleavegroup = async () => {
    const res = await removememberingroup(memberId, groupId, token);
    if (res == "ok") {
      getPageGroup();
    }
  };
  const setleavegroup = async () => {
    const res = await leavegroup(groupId, token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const sendinviteasadmin = async () => {
    const res = await inviteasadmin(memberId, groupId, token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const setremoveasadmin = async () => {
    const res = await removeasadmin(memberId, groupId, token);
    if (res == "ok") {
      getPageGroup();
    }
  };

  const setcancelinviteasadmin = async () => {
    const res = await cancelinviteasadmin(memberId, groupId, token);
    if (res == "ok") {
      getPageGroup();
    }
  };


  return (
    <ul className="post_menu" ref={menu} style={{border:"1px solid rgb(204, 204, 204)"}}>
      {admin && User._id === memberId && (
        <>
          {" "}
          <div onClick={() => setremoveasadmin()}>
            <MenuItem title="Remove as admin" />
          </div>
          <div className="mmenu_splitter"></div>
          <div onClick={() => setleavegroup()}>
            <MenuItem title="Leave group" />
          </div>
        </>
      )}
      {admin && User._id !== memberId && (
        <>
          {" "}
          {foundAdminInGroup ? (
            <div onClick={() => setremoveasadmin()}>
              <MenuItem title="Remove as admin" />
            </div>
          ) : requests_admin?.includes(memberId) ? (
            <>
              {" "}
              <div onClick={() => setcancelinviteasadmin()}>
                <MenuItem title="Cancel invite as admin" />
              </div>
            </>
          ) : (
            <>
              {" "}
              <div onClick={() => sendinviteasadmin()}>
                <MenuItem title="Invite as admin" />
              </div>
            </>
          )}
           <div className="mmenu_splitter"></div>
          <div onClick={() => setmemberleavegroup()}>
            <MenuItem title="Remove member" />
          </div>
        </>
      )}
    </ul>
  );
}
