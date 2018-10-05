import React, { Component } from 'react';
import styled from 'styled-components';

const Logo = styled.h1`
  margin: 30px 0 0 30px;
  color: #474554;
  font-weight: 600;
  font-size: 48px;
`;

const SubredditForm = styled.form`
  text-align: center;
`;

const SubredditInput2 = styled.input`
  height: 84px;
  width: 100px;
  border: 4px solid #aca9bb;
  border-right: 0;
  font-size: 48px;
  text-align: right;

  &::placeholder {
    color: #5f5c6d;
  }
`;

const SubredditInput = styled.input`
  color: #474554;
  height: 84px;
  width: 300px;
  border: 4px solid #aca9bb;
  border-left: 0px;
  font-size: 48px;

  &:focus {
    outline: none;
  }
`;

export default class Header extends Component {
  render() {
    return (
      <header>
        <Logo>imgal</Logo>
        <SubredditForm action="">
          <SubredditInput2 type="text" placeholder="/r/" readOnly="readonly" />
          <SubredditInput
            type="text"
            id="subreddit"
            name="subreddit"
            placeholder="pictures"
          />
        </SubredditForm>
      </header>
    );
  }
}
