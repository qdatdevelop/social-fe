import React from "react";

function Circle({color}) {
  return (
    <svg viewBox="0 0 20 20" fill={color} height="20" width="20">
      <defs>
        <linearGradient gradientTransform="rotate(90)" id=":r926:">
          <stop offset="0%" stop-color="#4992ee"></stop>
          <stop offset="50%" stop-color="#3481e4"></stop>
          <stop offset="100%" stop-color="#1f71da"></stop>
        </linearGradient>
      </defs>
      <defs>
        <mask id=":r925:">
          <rect fill="white" height="100%" width="100%"></rect>
          <circle cx="10" cy="10" r="3" fill="black"></circle>;
        </mask>
      </defs>
      <circle cx="10" cy="10" r="10" mask="url(#:r925:)"></circle>;
    </svg>
  );
}

export default Circle;
