import React from "react";

function SimpleLoader({ width, height, fill }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={width}
      height={height}
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "transparent",
      }}
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <g transform="rotate(0 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.5952380952380952s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(45 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.5102040816326531s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(90 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.4251700680272109s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(135 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.3401360544217687s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(180 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.25510204081632654s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(225 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.17006802721088435s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(270 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="-0.08503401360544217s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g transform="rotate(315 50 50)">
          <rect
            fill={fill}
            height="14"
            width="6"
            ry="4.0600000000000005"
            rx="3"
            y="21"
            x="47"
          >
            <animate
              repeatCount="indefinite"
              begin="0s"
              dur="0.6802721088435374s"
              keyTimes="0;1"
              values="1;0"
              attributeName="opacity"
            ></animate>
          </rect>
        </g>
        <g></g>
      </g>
    </svg>
  );
}

export default SimpleLoader;
