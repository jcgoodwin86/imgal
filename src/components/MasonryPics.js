// TODO: Handle broken links
// TODO: Work on comments to make it easier to understand how the grid is created
// TODO: Try to refactor and clean up code
// ! What I used to figure out how to do masonry layout https://codeburst.io/how-to-the-masonry-layout-56f0fe0b19df
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
const imagesLoaded = require('imagesloaded');

const masonryConfig = {
  breakpoints: {
    sm: 430,
    md: 768,
    lg: 992,
    xl: 1500,
  },
  cols: {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
};

/**
 * Generate the order value for nth-child panels
 * based on the number of items and the current number
 * of columns for the current media query
 */
const getOrderString = (numberOfItems, columns) => {
  let orderString = '';

  for (let p = 1; p < numberOfItems + 1; p++) {
    const order = p % columns === 0 ? columns : p % columns;
    orderString += `
        &:nth-child(${p}) {
          order: ${order};
        }
      `;
  }
  return orderString;
};

/**
 * Generate media queries for configuration breakpoints
 * This entails setting the width of Panels at different viewport width
 */
const generateMedia = (numberOfItems, config) => {
  let mediaString = '';
  for (let breakpoint of Object.keys(config.breakpoints)) {
    const value = config.breakpoints[breakpoint];
    const columns = config.cols[breakpoint];
    mediaString += `
      @media (min-width: ${value}px) {
        .masonry-panel {
          width: ${100 / columns}%;
          ${css`
            ${getOrderString(numberOfItems, columns)};
          `}
        }
      }
    `;
  }
  return mediaString;
};

const Masonry = styled.div`
  display: flex;
  flex-flow: column wrap;
  max-width: 100%;
  height: ${p => (p.height === 0 ? '100vh' : `${p.height}px`)};
  width: ${p => (p.width ? `${p.width}px` : `${window.innerWidth}px`)};
  ${p =>
    p.itemCount &&
    css`
      ${generateMedia(p.itemCount, masonryConfig)};
    `};
`;

const MasonryPanel = styled.div`
  overflow: hidden;
`;

const MasonryContent = styled.div`
  /*padding: 10px;*/
`;

/**
 * Padding elements that aid with making the container flow correctly
 * It also aids in making every column of equal height
 */
const MasonryPad = styled.div`
  height: ${p => p.height}px;
  order: ${p => p.order};
`;

/**
 * className reference
 */
const CLASSES = {
  CONTAINER: 'masonry',
  PANEL: 'masonry-panel',
};

export default class MasonryPics extends Component {
  state = {
    heights: [],
    loading: true,
    maxHeight: 0,
    pads: [],
  };

  componentDidMount = () => {
    const imgLoad = imagesLoaded(this.container, instance => {
      this.layout();
      this.setState({
        loading: false,
      });
    });
    imgLoad.on('progress', (instance, image) => {
      // This trick allows us to avoid any floating pixel sizes 👍
      image.img.style.height = image.img.height;
      image.img.setAttribute('height', image.img.height);
      // image.img.classList.remove('loading')
      // NOTE: Not the cleanest thing to do here but this is a demo 😅
      const parentPanel = image.img.parentNode.parentNode;
      parentPanel.setAttribute('style', `height: ${image.img.height}px`);
      this.layout();
    });
  };

  /**
   * Trick here is to populate an array of column heights based on the panels
   * Referencing the panel order, the column heights are generated
   */ populateHeights = () => {
    const { container } = this;
    const heights = [];
    const panels = container.querySelectorAll(`.${CLASSES.PANEL}`);

    for (let p = 0; p < panels.length; p++) {
      let panel = panels[p];
      const { order: cssOrder, msFlexOrder, height } = getComputedStyle(panel);
      const order = cssOrder || msFlexOrder;
      if (!heights[order - 1]) heights[order - 1] = 0;
      heights[order - 1] = heights[order - 1] + parseInt(height, 10);
    }
    this.setState({ heights });
  };

  /**
   * Set the layout height based on referencing the content cumulative height
   * This probably doesn't need its own function but felt right to be nice
   * and neat
   */ setLayout = () => {
    const { state } = this;
    const { heights } = state;
    // It's tricky to get everything right just down to the pixel with random dynamic height images
    // Sometimes it doesn't play nice 😢
    // So add some leniency to the height of the layout
    const leniency = 0;
    const maxHeight = Math.max(...heights) + leniency;
    this.setState({ maxHeight });
  };

  /**
   * Pad out layout columns with padding elements that make heights equal
   */ pad = () => {
    const { state } = this;
    const { heights, maxHeight } = state;
    const pads = [];
    heights.map((height, idx) => {
      if (height < maxHeight && height > 0) {
        pads.push({
          height: maxHeight - height,
          order: idx + 1,
        });
      }
    });
    this.setState({ pads });
  };

  /**
   * Resets and lays out elements
   */ layout = () => {
    const { populateHeights, setLayout, pad } = this;
    populateHeights();
    setLayout();
    pad();
  };

  render() {
    return (
      <Masonry
        className={`${CLASSES.CONTAINER}`}
        innerRef={container => (this.container = container)}
        itemCount={this.props.links.length}
        loadingContent={this.props.loading}
        height={this.state.loading ? window.innerHeight : this.state.maxHeight}
      >
        {this.props.links.map((link, key) => (
          <MasonryPanel key={key} className={`${CLASSES.PANEL}`}>
            <MasonryContent>{link}</MasonryContent>
          </MasonryPanel>
        ))}
        {this.state.pads.map((pad, idx) => (
          <MasonryPad
            order={pad.order}
            height={pad.height}
            key={`masonry-pad--${idx}`}
          />
        ))}
      </Masonry>
    );
  }
}
