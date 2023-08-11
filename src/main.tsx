import React from 'react';
import ReactDOM from 'react-dom/client';
import './tree.css';
import App from './App';
import init, { NBT } from 'nbtrock';
init().then();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App
    nbt={
      new NBT({
        name: 'nbtrock',
        data: {
          Compound: new Map([['String', { String: 'Hello World!' }]])
        }
      })
    }
  />
);
