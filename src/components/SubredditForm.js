import React, { useRef } from 'react';
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

function SubredditForm(props) {
  let subredditRef = useRef(null);
  const goToSubreddit = (e) => {
    e.preventDefault(); // Stop form from submitting
    props.setSubreddit(subredditRef.current.value);
  };

  return (
    <Form onSubmit={goToSubreddit}>
      <Input2 type="text" placeholder="/r/" readOnly="readonly" />
      <Input
        type="text"
        ref={subredditRef}
        id="subreddit"
        name="subreddit"
        placeholder={props.currentSubreddit}
      />
      <button type="submit">Go!</button>
    </Form>
  );
}

export default SubredditForm;
