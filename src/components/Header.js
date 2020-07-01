import React, { Component } from 'react';
import styled from 'styled-components';
import SubredditForm from './SubredditForm';

const Logo = styled.h1`
  margin: 30px 0 0 30px;
  color: #474554;
  font-weight: 600;
  font-size: 48px;
`;

export default class Header extends Component {
  render() {
    return (
      <header>
        <Logo>imgal</Logo>
        <SubredditForm
          currentSubreddit={this.props.currentSubreddit}
          setSubreddit={this.props.setSubreddit}
        />
      </header>
    );
  }
}
