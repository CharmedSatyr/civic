import PropTypes from "prop-types";
import React from "react";
import { css } from "emotion";
import CivicVictoryTheme from "../VictoryTheme/VictoryThemeIndex";

const SimpleLegend = ({ colorScale, legendData }) => {
  const legendStyle = css`
    font-family: "Roboto Condensed", "Helvetica Neue", Helvetica, sans-serif;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    margin: 10px 0 0 0;

    @media (max-width: 640px) {
      text-align: left;
    }
  `;

  const colorMap = colorScale || CivicVictoryTheme.civic.group.colorScale;

  if (legendData.length) {
    return (
      <div className={legendStyle}>
        {legendData.map((group, idx) => (
          <span
            key={group.name}
            className={css`
              margin-left: 10px;
            `}
          >
            <svg viewBox="0 0 10 10" width="10px">
              <circle cx="5" cy="5" r="5" fill={colorMap[idx]} />
            </svg>
            <span
              className={css`
                margin-left: 5px;
              `}
            >
              {group.name}
            </span>
          </span>
        ))}
      </div>
    );
  }
  return null;
};

SimpleLegend.propTypes = {
  colorScale: PropTypes.arrayOf(PropTypes.string),
  legendData: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
};

SimpleLegend.defaultProps = {
  colorScale: null,
  legendData: null
};

export default SimpleLegend;
