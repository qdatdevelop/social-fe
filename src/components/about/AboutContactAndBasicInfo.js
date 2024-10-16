import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import Bio from "../intro/Bio";
import { Link } from "react-router-dom";
import Detail from "./Detail";
import axios from "axios";
import DetailAdd from "./DetailAdd";
export default function AboutContactAndBasicInfo({
  details,
  visitor,
  setOthername,
  loading,
  infos,
  setDetails,
  setInfos,
  email,
  gender,
  bYear,
  bMonth,
  bDay,
}) {
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const [newWebsites, setNewWebsites] = useState([]);
  const [infos2, setInfos2] = useState();
  const [showBio, setShowBio] = useState(false);
  const [showBioAdd, setShowBioAdd] = useState(false);
  const [max, setMax] = useState(infos?.bio ? 100 - infos?.bio.length : 100);
  const [on, setOn] = useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[bMonth - 1];
  const updateDetails = async () => {
    try {
      console.log(infos);

      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
        {
          infos,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setShowBio(false);
      setShowBioAdd(false);
      setDetails(data);
      setOthername(data.otherName);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const updateDetails2 = async () => {
    try {
      console.log(infos);

      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
        {
          infos,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setShowBio(false);
      setShowBioAdd(false);
      setDetails(data);
      setOthername(data.otherName);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const addNewWebsiteInput = () => {
    setNewWebsites([...newWebsites, ""]);
  };

  // Hàm xử lý khi bạn muốn cập nhật giá trị của một ô nhập
  const updateWebsiteAtIndex = (e, index) => {
    const { name, value } = e.target;
    const updatedWebsites = [...newWebsites];
    if (name === "link") {
      updatedWebsites[index] = {
        ...updatedWebsites[index],
        link: value,
      };
    } else if (name === "type") {
      updatedWebsites[index] = {
        ...updatedWebsites[index],
        type: value,
      };
    }
    setNewWebsites(updatedWebsites);
  };

  const handleChangeWeb = (e, index) => {
    const { name, value } = e.target;
    const updatedWebsites = [...infos.websites]; // Tạo một bản sao mới của mảng websites

    if (value === "") {
      updatedWebsites.splice(index, 1);
    } else {
      if (name === "link") {
        updatedWebsites[index] = {
          ...updatedWebsites[index],
          link: value,
        };
      } else if (name === "type") {
        updatedWebsites[index] = {
          ...updatedWebsites[index],
          type: value,
        };
      }
    }

    setInfos({ ...infos, websites: updatedWebsites });
  };

  // Hàm xử lý khi bạn muốn cập nhật trường websites trong details
  const updateWebsites = () => {
    const UpdateWebsite = [...infos?.websites, ...newWebsites];
    console.log(UpdateWebsite);
    setInfos({
      ...infos,
      websites: UpdateWebsite,
    });
    setNewWebsites([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
    setMax(100 - e.target.value.length);
  };

  const turnOff = () => {
    setOn(false);
  };

  return (
    <>
      {loading ? (
        <div className="sekelton_loader">
          <HashLoader color="#1876f2" />
        </div>
      ) : (
        <>
          {visitor ? (
            <>
              <div className="details_header">Contact info</div>
              {details?.phoneNumber && email ? (
                <>
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/phoneNumber.png"
                      alt=""
                    />
                    <span style={{ fontWeight: "600" }}>
                      {details?.phoneNumber}
                    </span>
                  </div>
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/email.png"
                      alt=""
                    />
                    <span style={{ fontWeight: "600" }}>{email}</span>
                  </div>
                </>
              ) : details?.phoneNumber && !email ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/phoneNumber.png"
                    alt=""
                  />
                  <span style={{ fontWeight: "600" }}>
                    {details?.phoneNumber}
                  </span>
                </div>
              ) : email && !details?.phoneNumber ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/email.png"
                    alt=""
                  />
                  <span style={{ fontWeight: "600" }}>{email}</span>
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/contact.png"
                    alt=""
                  />
                  No contact info to show
                </div>
              )}
              <div className="details_header">Websites</div>
              {details?.websites.length > 0 ? (
                <>
                  {details?.websites.map((data, index) => (
                    <div
                      className="info_profile"
                      style={{ alignItems: "unset", flexDirection: "column" }}
                      key={index}
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
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/web.png"
                    alt=""
                  />
                  No links to show
                </div>
              )}
              <div className="details_header">Basic info</div>
              {details?.otherName ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/ortherName.png"
                    alt=""
                  />
                  <p>
                    {" "}
                    Nickname is{" "}
                    <span style={{ fontWeight: "600" }}>
                      {details?.otherName}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/ortherName.png"
                    alt=""
                  />
                  No other names to show
                </div>
              )}
              {details?.relationship ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/relationship.png"
                    alt=""
                  />
                  {details?.relationship}
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/relation.png"
                    alt=""
                  />
                  No relationship info to show
                </div>
              )}
              {gender === "male" ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/male.png"
                    alt=""
                  />
                  Male
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/female.png"
                    alt=""
                  />
                  Female
                </div>
              )}

              <div className="info_profile">
                <img
                  width="20px"
                  height="20px"
                  src="../../../icons/birth.png"
                  alt=""
                />

                <div className="birth">
                  <div className="date-info">
                    <div className="month">{monthName}</div>
                    <div className="day">{bDay}</div>
                  </div>
                  <div className="year">{bYear}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="details_header">Contact info</div>
              <Detail
                value={details?.phoneNumber}
                img="phoneNumber"
                placeholder="Add a mobile phone"
                name="phoneNumber"
                text="phoneNumber"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
              />
              <Detail
                value={email}
                img="email"
                placeholder="Add email"
                name="email"
                text="email"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
              />
              <div className="details_header">Social links</div>
              <DetailAdd
                values={details?.websites}
                img="link"
                placeholder="Add a social link"
                name="websites"
                text="a social link"
                infos={infos}
                newWebsites={newWebsites}
                setNewWebsites={setNewWebsites}
                updateDetails={updateDetails}
                addNewWebsiteInput={addNewWebsiteInput}
                updateWebsiteAtIndex={updateWebsiteAtIndex}
                handleChangeWeb={handleChangeWeb}
                updateWebsites={updateWebsites}
                setDetails={setDetails}
                setOthername={setOthername}
                updateDetails2={updateDetails2}
                turnOff={turnOff}
                on={on}
                setOn={setOn}
              />
              <div className="details_header">Basic info</div>
              <Detail
                value={details?.otherName}
                img="ortherName"
                placeholder="Add other name"
                name="otherName"
                text="other Name"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                des="Nickname is"
              />
              <div className="add_details_flex ">
                {gender === "male" ? (
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/male.png"
                      alt=""
                    />
                    Male
                  </div>
                ) : (
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/female.png"
                      alt=""
                    />
                    Female
                  </div>
                )}
              </div>
              <Detail
                value={details?.relationship}
                img="relationship"
                placeholder="Add a relationship status"
                name="relationship"
                text="relationship"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                rel
              />
              <div className="add_details_flex ">
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/birth.png"
                    alt=""
                  />

                  <div className="birth">
                    <div className="date-info">
                      <div className="month">{monthName}</div>
                      <div className="day">{bDay}</div>
                    </div>
                    <div className="year">{bYear}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
