/* eslint-env jest */

//source : https://hackernoon.com/api-testing-with-jest-d1ab74005c0a

import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("Connect user", () => {
  return App.responseGoogle('Hamid.benoumaizina@decathlon.com')
  .then(data => {
    expect(data).toBeDefined()
    expect(data.givenName).toEqual('Hamid Benoumaizina')
  })
});

test("Deconnect user", () => {
  return App.logOut()
  .then(data => {
    expect(data).toBeDefined()
    expect(data.givenName).toEqual("")
  })
});
