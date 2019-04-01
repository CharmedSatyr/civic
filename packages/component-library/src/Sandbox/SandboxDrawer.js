import React from 'react';
import { css } from 'emotion';
import Dropdown from '../Dropdown/Dropdown';
import SandboxDateSelector from './SandboxDateSelector';
import SandboxToggleSwitch from './SandboxToggleSwitch';
import SandboxMapLegend from './SandboxMapLegend';

const menuOpen = css(`
  position: absolute;
  top: 4.3%;
  right: 0;
  width: 33%;
  z-index: 5;
  transition: 0.5s;
  @media (max-width: 850px) {
    top: 4%;
    width: 90%;
  }
  @media (max-width: 500px) {
    top: 4.9%;
    right: 1px;
    width: 100%;
  }
`);

const menuClosed = css(`
  position: absolute;
  top: 4.3%;
  right: 0;
  width: 7%;
  z-index: 5;
  transition: 0.5s;
  @media (max-width: 850px) {
    top: 4%;
    width: 15%;
  }
  @media (max-width: 500px) {
    top: 4.9%;
    right: 1px;
    width: 25%;
  }
`);

const SandboxDrawer = ({
  data,
  onChange,
  selectedSlide,
  selectedPackage,
  toggleDrawer,
  drawerVisible,
  defaultSlides,
  slideData,
  fetchSlideByDate,
  foundationData,
  defaultFoundation,
  allSlides,
  updatePackage,
  selectedFoundation,
  updateFoundation,
  foundationMapProps
}) => {
  return (
    <div
      className={drawerVisible ? menuOpen : menuClosed}
    >
      <div onClick={toggleDrawer}>
        <div className={css(`
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-transform: uppercase;
          font-size: 1rem;
          cursor: pointer;
          background: #EE495C;
          color: #F3F2F3;
          height: auto;
        `)}>
          <div className={css(`
            font-size: 1.4rem;
            color: #F3F2F3;
            line-height: 1.5;
            padding-left: 5px;
            @media (max-width: 850px) {
              font-size: 1.3rem;
            }
          `)}>
            {drawerVisible ? 'Close Menu' : 'Open Menu'}
          </div>
        </div>
      </div>
      {drawerVisible && (
        <div className={css(`
          position: absolute;
          display: block;
          width: 100%;
          z-index: 100;
          background: #EEE;
          height: 74vh;
          overflow-y: auto;
          background: #F3F2F3;
          @media (max-width: 850px) {
            height: 74vh;
          }
          @media (max-width: 500px) {
            height: 88vh;
          }
          .Select.is-open { position: relative; z-index: 1000; }
          .Select-menu-outer { z-index: 9999; }
        `)}>
          <div className={css(`
            position: relative;
            z-index: 900;
          `)}
          >
            <h2 className={css(`
              color: #555;
              text-transform: uppercase;
              margin: 0 10px;
            `)}>
              Data Collections
            </h2>
            <Dropdown
              value={selectedPackage}
              options={Object.keys(data.packages).map(p => ({
                value: p,
                label: p,
              }))}
              onChange={updatePackage}
              simpleValue
            />
          </div>
          <div className={css(`
            position: relative;
            z-index: 400;
          `)}>
            <h2 className={css(`
              color: #555;
              text-transform: uppercase;
              margin: 0 10px;
            `)}>
              Base Layers
            </h2>
            <Dropdown
              value={selectedFoundation}
              options={data.packages[selectedPackage].foundations.map(
                foundation => ({
                  value: foundation,
                  label: data.foundations[foundation].name,
                })
              )}
              onChange={updateFoundation}
              simpleValue
            />
          </div>
          {foundationData && (
            <div>
              <div className={css(`
                padding: .5rem;
                font-size: .75rem;
                color: #333;
                position: relative;
                z-index: 300;
              `)}>
                <SandboxDateSelector
                  slide={defaultFoundation}
                  selectedSlideData={foundationData}
                  fetchSlideByDate={fetchSlideByDate}
                  type='foundation'
                />
              </div>
              {!!foundationData.slide_data && !!foundationMapProps && (
                  <SandboxMapLegend data={foundationData} mapProps={foundationMapProps}/>
              )}
            </div>
          )}
          <div className={css(`
            position: relative;
            z-index: 200;
          `)}>
            <h2 className={css(`
              color: #555;
              text-transform: uppercase;
              margin: 0 10px;
            `)}>
              Slide Layers
            </h2>
          </div>
          {allSlides.map((slide, index) => {
            const selectedSlideData = !!slideData.find(slideDatum => slideDatum[slide.label])
              ? slideData.find(slideDatum => slideDatum[slide.label])[slide.label]
              : {};
            const defaultGray = [238, 238, 238, 255];
            const backgroundSlideColor = slide.color;
            const formatBackgroundColor = arr => arr.reduce((acc,cur,i) => i < 3 ? acc + cur +',' : acc +'1)', 'rgba(');
            const slideBackGroundColor = formatBackgroundColor(backgroundSlideColor);
            const blackTextColor = 'rgba(0,0,0,1)';
            const whiteTextColor = 'rgba(255,255,255,1)';
            const textColor = slideBackGroundColor === defaultGray ? blackTextColor : whiteTextColor;
            return (
              <div key={'slide-selector' + index}>
                <div className={css(`
                  border-top: 1px solid #ddd;
                  padding: .3rem .5rem;
                  text-transform: capitalize;
                  font-weight: bold;
                  background: ${slideBackGroundColor};
                  color:${textColor}
                `)}>
                  <SandboxToggleSwitch
                    name={slide.slideNumber}
                    checked={slide.checked}
                    onChange={onChange}
                    label={slide.label}
                    mapType={slide.mapType}
                  />
                </div>
                <div className={css(`
                  padding: .5rem;
                  font-size: .75rem;
                  color: #333;
                  position: relative;
                  z-index: ${10 - index};
                `)}>
                  {selectedSlideData.slide_meta && selectedSlideData.slide_meta.dates.date_granularity
                    ? <SandboxDateSelector
                        selectedSlideData={selectedSlideData}
                        slide={slide}
                        fetchSlideByDate={fetchSlideByDate}
                        type='slide'
                      />
                    : selectedSlideData.slide_meta && selectedSlideData.slide_meta.dates.default_date_filter
                    ? <span className={css(`
                        font-size: 17px;
                        font-weight: 400;
                        padding: 0 0 0 15px;
                        margin: 0;
                      `)}>
                        {selectedSlideData.slide_meta.dates.default_date_filter}
                      </span>
                    : null
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SandboxDrawer;
