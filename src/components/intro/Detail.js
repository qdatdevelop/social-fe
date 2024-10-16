import { useState } from "react";
import Bio from "./Bio";
import { Link } from "react-router-dom";
export default function Detail({
  img,
  value,
  placeholder,
  name,
  handleChange,
  updateDetails,
  infos,
  text,
  rel,
  link,
  des,
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Link to={`/profile&sk=${link}`} className="add_details_flex ">
        {value ? (
          <div className="info_profile ">
            <img
              width="20px"
              height="20px"
              src={`../../../icons/${img}.png`}
              alt=""
            />
            <p>
              {" "}
              {des} <span style={{ fontWeight: "600" }}>{value}</span>
            </p>
            <i className="edit_icon"></i>
          </div>
        ) : (
          <>
            <i className="rounded_plus_icon"></i>
            <span className="underline">Add {text}</span>
          </>
        )}
      </Link>
      {show && (
        <Bio
          placeholder={placeholder}
          name={name}
          handleChange={handleChange}
          updateDetails={updateDetails}
          infos={infos}
          detail
          setShow={setShow}
          rel={rel}
        />
      )}
    </div>
  );
}
