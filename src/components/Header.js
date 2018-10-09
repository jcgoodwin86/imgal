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
  subredditRef = React.createRef();
  goToSubreddit = e => {
    e.preventDefault(); // Stop form from submitting
    this.props.setSubreddit(this.subredditRef.value);
  };

  render() {
    return (
      <header>
        <Logo>imgal</Logo>
        <SubredditForm onSubmit={this.goToSubreddit}>
          <SubredditInput2 type="text" placeholder="/r/" readOnly="readonly" />
          <SubredditInput
            type="text"
            innerRef={e => {
              this.subredditRef = e;
            }}
            id="subreddit"
            name="subreddit"
            placeholder={this.props.defaultSubreddit}
          />
          <button type="submit">Go!</button>
        </SubredditForm>
      </header>
    );
  }
}
