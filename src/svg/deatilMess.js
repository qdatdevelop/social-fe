import React from "react";

function DeatilMess({ color }) {
  return (
    <svg width="24px" height="24px" viewBox="0 0 36 36" name="icon" role="presentation" >
      <g transform="translate(18,18)scale(1.2)translate(-18,-18)">
        <path
          d="M 18 10 C 16.6195 10 15.5 11.119 15.5 12.5 C 15.5 13.881 16.6195 15 18 15 C 19.381 15 20.5 13.881 20.5 12.5 C 20.5 11.119 19.381 10 18 10 Z M 16 25 C 16 25.552 16.448 26 17 26 L 19 26 C 19.552 26 20 25.552 20 25 L 20 18 C 20 17.448 19.552 17 19 17 L 17 17 C 16.448 17 16 17.448 16 18 L 16 25 Z M 18 30 C 11.3725 30 6 24.6275 6 18 C 6 11.3725 11.3725 6 18 6 C 24.6275 6 30 11.3725 30 18 C 30 24.6275 24.6275 30 18 30 Z"
          fill={color}
          stroke={color}
        ></path>
      </g>
    </svg>
  );
}

export default DeatilMess;
