import { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
export default function ModerationAlerts({
  dataPageGroup,
  idGroup,
  reports,
  setTab,
}) {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <div className="No_results">
        <p>No alerts to show</p>
      </div>
    </>
  );
}
