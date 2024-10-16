import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import Bio from "../intro/Bio";
import { Link } from "react-router-dom";
import Detail from "./Detail";
import axios from "axios";
export default function Overview({
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
              {details?.job && details?.workplace ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/job.png"
                    alt=""
                  />
                  <p>
                    {" "}
                    Works as{" "}
                    <span style={{ fontWeight: "600" }}>{details?.job}</span>
                  </p>
                </div>
              ) : details?.job && !details?.workplace ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/job.png"
                    alt=""
                  />
                  <p>
                    Works as{" "}
                    <span style={{ fontWeight: "600" }}>{details?.job}</span>
                  </p>
                </div>
              ) : details?.workplace && !details?.job ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/job.png"
                    alt=""
                  />
                  <p>
                    Works at{" "}
                    <span style={{ fontWeight: "600" }}>
                      {details?.workplace}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/job.png"
                    alt=""
                  />
                  No workplaces to show
                </div>
              )}

              {details?.college && details?.highSchool ? (
                <>
                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/studies.png"
                      alt=""
                    />
                    <p>
                      Studied at{" "}
                      <span style={{ fontWeight: "600" }}>
                        {details?.college}
                      </span>
                    </p>
                  </div>

                  <div className="info_profile">
                    <img
                      width="20px"
                      height="20px"
                      src="../../../icons/studies.png"
                      alt=""
                    />
                    <p>
                      Went to{" "}
                      <span style={{ fontWeight: "600" }}>
                        {details?.highSchool}
                      </span>
                    </p>
                  </div>
                </>
              ) : details?.college && !details?.highSchool ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/studies.png"
                    alt=""
                  />
                  <p>
                    Studied at{" "}
                    <span style={{ fontWeight: "600" }}>
                      {details?.college}
                    </span>
                  </p>
                </div>
              ) : details?.highSchool && !details?.college ? (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/studies.png"
                    alt=""
                  />
                  <p>
                    Studied at{" "}
                    <span style={{ fontWeight: "600" }}>
                      {details?.college}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="info_profile">
                  <img
                    width="20px"
                    height="20px"
                    src="../../../icons/studies.png"
                    alt=""
                  />
                  No schools to show
                </div>
              )}

              {details?.currentCity && (
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
              )}
              {details?.hometown && (
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
            </>
          ) : (
            <>
              <Detail
                value={details?.job}
                img="job"
                placeholder="Add job title"
                name="job"
                text="a job"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                link="about_details"
                des="Works as"
              />
              <Detail
                value={details?.workplace}
                img="job"
                placeholder="Add a workplace"
                name="workplace"
                text="workplace"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                link="about_details"
                des="Works at"
              />
              <Detail
                value={details?.highSchool}
                img="studies"
                placeholder="Add a high school"
                name="highSchool"
                text="a high school"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                link="about_details"
                des="Went to"
              />
              <Detail
                value={details?.college}
                img="studies"
                placeholder="Add a college"
                name="college"
                text="college"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                link="about_details"
                des="Studied at"
              />
              <Detail
                value={details?.currentCity}
                img="home"
                placeholder="Add a current city"
                name="currentCity"
                text="a current city"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                link="about_details"
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
                link="about_details"
                des="From"
              />
              <Detail
                value={details?.relationship}
                img="relationship"
                placeholder="Add relationship"
                name="relationship"
                text="relationship"
                handleChange={handleChange}
                updateDetails={updateDetails}
                infos={infos}
                link="about_details"
                rel
              />
            </>
          )}
        </>
      )}
    </>
  );
}
