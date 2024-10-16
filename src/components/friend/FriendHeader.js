import { Link, useNavigate, useParams } from "react-router-dom";
import { Dots } from "../../svg";
import { useEffect, useState } from "react";
export default function FriendMenu({ sk, userName }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="profile_menu_wrap">
    
    </div>
  );
}
