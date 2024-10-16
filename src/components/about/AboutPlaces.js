import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import Bio from "../intro/Bio";
import { Link } from "react-router-dom";
import Detail from "./Detail";
import axios from "axios";
export default function AboutPlaces({
  sk,
  details,
  visitor,
  setOthername,
  loading,
  infos,
  setDetails,
  setInfos,
}) {
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const [showBio, setShowBio] = useState(false);
  const [max, setMax] = useState(infos?.bio ? 100 - infos?.bio.length : 100);

  const updateDetails = async () => {
    try {
      console.log("sent");
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
      setDetails(data);
      setOthername(data.otherName);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
    setMax(100 - e.target.value.length);
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
              <div className="details_header">Places lived</div>
              {details?.hometown && details?.currentCity ? (
                <>
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/home.png"
                      alt=""
                    />
                    <p>
                      Lives in{" "}
                      <span style={{ fontWeight: "600" }}>
                        {details?.currentCity}
                      </span>
                    </p>
                  </div>
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/hometown.png"
                      alt=""
                    />
                    <p>
                      From{" "}
                      <span style={{ fontWeight: "600" }}>
                        {details?.hometown}
                      </span>
                    </p>
                  </div>
                </>
              ) : details?.hometown && !details?.currentCity ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/hometown.png"
                    alt=""
                  />
                  <p>
                    From{" "}
                    <span style={{ fontWeight: "600" }}>
                      {details?.hometown}
                    </span>
                  </p>
                </div>
              ) : details?.currentCity && !details?.hometown ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/home.png"
                    alt=""
                  />
                  <p>
                    Lives in{" "}
                    <span style={{ fontWeight: "600" }}>
                      {details?.currentCity}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/hometown.png"
                    alt=""
                  />
                  No places to show
                </div>
              )}
            </>
          ) : (
            <>
              <div className="details_header">Places lived</div>
              <Detail
                value={details?.currentCity}
                img="home"
                placeholder="Add current city"
                name="currentCity"
                text="current city"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                des="Lives in"
              />
              <Detail
                value={details?.hometown}
                img="hometown"
                placeholder="Add hometown"
                name="hometown"
                text="hometown"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                des="From"
              />
            </>
          )}
        </>
      )}
    </>
  );
}
