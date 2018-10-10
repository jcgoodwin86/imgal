import React, { Component } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  text-align: center;
`;

const Input2 = styled.input`
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

const Input = styled.input`
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

export default class SubredditForm extends Component {
  subredditRef = React.createRef();
  goToSubreddit = e => {
    e.preventDefault(); // Stop form from submitting
    this.props.setSubreddit(this.subredditRef.value);
  };
  render() {
    return (
      <Form onSubmit={this.goToSubreddit}>
        <Input2 type="text" placeholder="/r/" readOnly="readonly" />
        <Input
          type="text"
          innerRef={e => {
            this.subredditRef = e;
          }}
          id="subreddit"
          name="subreddit"
          placeholder={this.props.defaultSubreddit}
        />
        <button type="submit">Go!</button>
      </Form>
    );
  }
}
