import React, { Component } from 'react';
import styled from 'styled-components';

export default class Header extends Component {
  render() {
    return (
      <header>
        <h1>IMGAL</h1>
        <form action="">
          <label htmlFor="subreddit">/r/</label>
          <input type="text" id="subreddit" name="subreddit" />
        </form>
      </header>
    );
  }
}
