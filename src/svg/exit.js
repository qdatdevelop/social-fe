import React from "react";

function Exit({color}) {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24">
      <g stroke={color} stroke-linecap="round" stroke-width="2">
        <line x1="6" x2="18" y1="6" y2="18"></line>
        <line x1="6" x2="18" y1="18" y2="6"></line>
      </g>
    </svg>
  );
}

export default Exit;
