import "@hackoregon/component-library/assets/global.styles.css";

import PropTypes from "prop-types";

/* eslint-disable import/no-extraneous-dependencies */
// This should probably be the core component, containing, nav etc
import React from "react";
import styled from "styled-components";
import { StoryCard } from "@hackoregon/component-library";
import ConstructionViews from "../ConstructionViews";
import CrashData from "../CrashData/CrashData";

const Container = styled.div`
  min-height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

function App(props) {
  return (
    <Container>
      <StoryCard
        title="Portland Road Works Explorer"
        collectionId="transportation"
        cardId="trans-construction-maps"
      >
        <ConstructionViews />
      </StoryCard>
      <CrashData />

      {React.Children.toArray(props.children)}
    </Container>
  );
}

App.displayName = "App";
App.defaultProps = {
  children: <div />
};

App.propTypes = {
  children: PropTypes.node
};

export default App;
