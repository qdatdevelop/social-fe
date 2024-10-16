import { Link, useParams } from "react-router-dom";
import "./style.css";
import { useEffect, useState } from "react";
import OverView from "../../../components/about/OverView";
import AboutworkAndEducation from "../../../components/about/AboutworkAndEducation";
import AboutPlaces from "../../../components/about/AboutPlaces";
import AboutContactAndBasicInfo from "../../../components/about/AboutContactAndBasicInfo";
export default function About({
  sk,
  profile,
  loading,
  visitor,
  setOthername,
  idUser,
  setVisible,
  profileTop,
}) {
  useEffect(() => {
    setDetails(profile.details);
    setInfos(profile.details);
  }, [profile.details]);

  const [details, setDetails] = useState();

  const initial = {
    bio: details?.bio ? details.bio : "",
    otherName: details?.otherName ? details.otherName : "",
    job: details?.job ? details.job : "",
    workplace: details?.workplace ? details.workplace : "",
    highSchool: details?.highSchool ? details.highSchool : "",
    college: details?.college ? details.college : "",
    currentCity: details?.currentCity ? details.currentCity : "",
    hometown: details?.hometown ? details.hometown : "",
    relationship: details?.relationship ? details.relationship : "",
    instagram: details?.instagram ? details.instagram : "",
    phoneNumber: details?.phoneNumber ? details?.phoneNumber : "",
    websites: details?.websites
      ? details.websites.map((website) => ({
          link: website.link || "",
          type: website.type || "Instagram",
          _id: website._id || "",
        }))
      : [],
  };

  const [infos, setInfos] = useState(initial);

  return (
    <div className="about_card">
      <div className="about_left_wrap">
        <h1>About</h1>
        <Link
          to={
            idUser
              ? `/profile/${idUser}&sk=about_overview`
              : "/profile&sk=about_overview"
          }
          className={
            sk === "about_overview" || sk === "about"
              ? "active_about"
              : "mmenu_item_about hover3"
          }
        >
          <span>Overview</span>
        </Link>
        <Link
          to={
            idUser
              ? `/profile/${idUser}&sk=about_work_and_education`
              : "/profile&sk=about_work_and_education"
          }
          className={
            sk === "about_work_and_education"
              ? "active_about"
              : "mmenu_item_about hover3"
          }
        >
          <span>Work and education</span>
        </Link>
        <Link
          to={
            idUser
              ? `/profile/${idUser}&sk=about_places`
              : "/profile&sk=about_places"
          }
          className={
            sk === "about_places" ? "active_about" : "mmenu_item_about hover3"
          }
        >
          <span>Places lived</span>
        </Link>
        <Link
          to={
            idUser
              ? `/profile/${idUser}&sk=about_contact_and_basic_info`
              : "/profile&sk=about_contact_and_basic_info"
          }
          className={
            sk === "about_contact_and_basic_info"
              ? "active_about"
              : "mmenu_item_about hover3"
          }
        >
          <span>Contact and basic info</span>
        </Link>
      </div>

      <div className="about_right_wrap">
        {sk === "about" || sk === "about_overview" ? (
          <OverView
            infos={infos}
            detailss={profile.details}
            visitor={visitor}
            setOthername={setOthername}
            loading={loading}
            setDetails={setDetails}
            setInfos={setInfos}
            details={details}
          />
        ) : (
          ""
        )}
        {sk === "about_work_and_education" && (
          <AboutworkAndEducation
            infos={infos}
            detailss={profile.details}
            visitor={visitor}
            setOthername={setOthername}
            loading={loading}
            setDetails={setDetails}
            setInfos={setInfos}
            details={details}
          />
        )}
        {sk === "about_places" && (
          <AboutPlaces
            infos={infos}
            detailss={profile.details}
            visitor={visitor}
            setOthername={setOthername}
            loading={loading}
            setDetails={setDetails}
            setInfos={setInfos}
            details={details}
          />
        )}
        {sk === "about_contact_and_basic_info" && (
          <AboutContactAndBasicInfo
            infos={infos}
            detailss={profile.details}
            visitor={visitor}
            setOthername={setOthername}
            loading={loading}
            setDetails={setDetails}
            setInfos={setInfos}
            details={details}
            email={profile.email}
            gender={profile.gender}
            bYear={profile.bYear}
            bMonth={profile.bMonth}
            bDay={profile.bDay}
          />
        )}
      </div>
    </div>
  );
}
