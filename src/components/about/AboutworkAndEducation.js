import { useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import Detail from "./Detail";
import axios from "axios";
export default function AboutworkAndEducation({ details, visitor, setOthername, loading, infos, setDetails, setInfos }) {
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
                            <div className="details_header">Work</div>
                            {details?.job && details?.workplace ? (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/job.png" alt="" />
                                    <p>
                                        {" "}
                                        Works as <span style={{ fontWeight: "600" }}>{details?.job}</span> at <span style={{ fontWeight: "600" }}>{details?.workplace}</span>
                                    </p>
                                </div>
                            ) : details?.job && !details?.workplace ? (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/job.png" alt="" />
                                    <p>
                                        {" "}
                                        Works as <span style={{ fontWeight: "600" }}>{details?.job}</span>
                                    </p>
                                </div>
                            ) : details?.workplace && !details?.job ? (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/job.png" alt="" />
                                    <p>
                                        Works at <span tyle={{ fontWeight: "600" }}>{details?.workplace}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/job.png" alt="" />
                                    No workplaces to show
                                </div>
                            )}

                            <div className="details_header">College</div>
                            {details?.college ? (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/studies.png" alt="" />
                                    <p>
                                        Studied at <span style={{ fontWeight: "600" }}>{details?.college}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/studies.png" alt="" />
                                    No schools to show
                                </div>
                            )}

                            <div className="details_header">High School</div>
                            {details?.highSchool ? (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/studies.png" alt="" />
                                    <p>
                                        Went to <span style={{ fontWeight: "600" }}>{details?.highSchool}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="info_profile">
                                    <img width="20px" height="20px" src="../../../icons/studies.png" alt="" />
                                    No schools to show
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="details_header">Work</div>
                            <Detail
                                value={details?.job}
                                img="job"
                                placeholder="Add job title"
                                name="job"
                                text="a job"
                                handleChange={handleChange}
                                updateDetails={updateDetails}
                                infos={infos}
                                des="Works as"
                            />
                            <div className="details_header">Work Place</div>
                            <Detail
                                value={details?.workplace}
                                img="job"
                                placeholder="Add a workplace"
                                name="workplace"
                                text="workplace"
                                handleChange={handleChange}
                                updateDetails={updateDetails}
                                infos={infos}
                                des="Works at"
                            />
                            <div className="details_header">College</div>
                            <Detail
                                value={details?.college}
                                img="studies"
                                placeholder="Add a college"
                                name="college"
                                text="college"
                                handleChange={handleChange}
                                updateDetails={updateDetails}
                                infos={infos}
                                des="Studied at"
                            />
                            <div className="details_header">High School</div>
                            <Detail
                                value={details?.highSchool}
                                img="studies"
                                placeholder="Add a high school"
                                name="highSchool"
                                text="a high school"
                                handleChange={handleChange}
                                updateDetails={updateDetails}
                                infos={infos}
                                des="Went to"
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
}
