import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "axios";
export default function DetailAdd({
  img,
  values,
  placeholder,
  name,
  infos,
  text,
  rel,
  setInfos,
  newWebsites,
  setNewWebsites,
  updateWebsites,
  addNewWebsiteInput,
  updateWebsiteAtIndex,
  handleChangeWeb,
  setOthername,
  setDetails,
  updateDetails,
  updateDetails2,
  turnOff,
  on,
  setOn,
}) {
  const [show, setShow] = useState(false);

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
      {!show && (
        <div className="add_details_flex_list">
          {values?.length === 0 ? (
            <>
              <div
                className="add"
                onClick={() => {
                  setShow(true);
                  addNewWebsiteInput();
                }}
              >
                <i className="rounded_plus_icon"></i>
                <span className="underline">Add {text}</span>
              </div>
            </>
          ) : (
            <>
              <i className="edit_icon" onClick={() => setShow(true)}></i>
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
      )}

      {show && (
        <div className="add_bio_wrap">
          {values?.length === 0 ? (
            <></>
          ) : (
            <>
              {infos?.websites.map((data, index) => (
                <>
                  <textarea
                    key={data._id}
                    placeholder={placeholder}
                    name="link"
                    value={data.link}
                    className="textarea_blue details_input"
                    onChange={(e) => handleChangeWeb(e, index)}
                  ></textarea>
                  <select
                    key={data._id}
                    className="select_rel"
                    name="type"
                    value={data.type}
                    onChange={(e) => handleChangeWeb(e, index)}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Youtube">Youtube</option>
                    <option value="Tiktok">Tiktok</option>
                    <option value="Web">Web</option>
                  </select>
                </>
              ))}
            </>
          )}

          <div>
            <div>
              {newWebsites.map((data, index) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <textarea
                      key={index}
                      placeholder={placeholder}
                      name="link"
                      value={data.link}
                      className="textarea_blue details_input"
                      onChange={(e) => updateWebsiteAtIndex(e, index)}
                    ></textarea>
                    <select
                      className="select_rel"
                      name="type"
                      value={data.type}
                      onChange={(e) => updateWebsiteAtIndex(e, index)}
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="Youtube">Youtube</option>
                      <option value="Tiktok">Tiktok</option>
                      <option value="Web">Web</option>
                    </select>
                  </div>
                </>
              ))}

              <div
                className="light_blue_btn hover5"
                style={{ marginTop: "10px", width: "180px" }}
                onClick={addNewWebsiteInput}
              >
                <img
                  src="../../../icons/add.png"
                  alt=""
                  className="filter_blue"
                />
                <p style={{ color: "#0567D2" }}>Add a social link</p>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex_left">
              <i className="public_icon"></i>Public
            </div>
            <div className="flex flex_right">
              <button
                className="gray_btn"
                onClick={() => {
                  setShow(false);
                  setnew();
                }}
              >
                Cancel
              </button>
              <button
                className="blue_btn"
                onClick={() => {
                  updateWebsites();
                  setOn(true);
                  setShow(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
