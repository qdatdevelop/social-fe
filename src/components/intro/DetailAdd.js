import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "axios";
export default function DetailAdd({
  values,
  infos,
  text,
  setNewWebsites,
  addNewWebsiteInput,
  updateDetails2,
  turnOff,
  on,
  link,
}) {
  const { user } = useSelector((state) => ({ ...state }));
  const setnew = () => {
    setNewWebsites([]);
  };

  useEffect(() => {
    if (on) {
      updateDetails2();
      turnOff(); // Đặt on thành false từ một nơi khác
    }
  }, [on]);

  console.log(infos);
  return (
    <div>
      <div className="add_details_flex_list">
        {values?.length === 0 ? (
          <>
            <div className="add" onClick={addNewWebsiteInput}>
              <i className="rounded_plus_icon"></i>
              <span className="underline">Add {text}</span>
            </div>
          </>
        ) : (
          <>
            <Link to={`/profile&sk=${link}`}>
              <i className="edit_icon"></i>
            </Link>

            {values?.map((data, i) => (
              <div
                className="info_profile"
                style={{ alignItems: "unset", flexDirection: "column" }}
                key={i}
              >
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover6"
                  style={{ display: "flex" }}
                >
                  <img
                    style={{ paddingRight: "5px" }}
                    width="22px"
                    height="20px"
                    src={`../../../icons/${
                      data.type === undefined ? "Instagram" : data.type
                    }.png`}
                    alt=""
                  />
                  {data.link}
                </a>
                <div className="link_type">
                  {data.type === undefined ? "Instagram" : data.type}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
