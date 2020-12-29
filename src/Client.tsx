/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as React from 'react';
import { render, hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import App from './app/App';

const entry: HTMLElement | null = document.getElementById('root');

entry?.hasChildNodes() ?
  loadableReady(() =>
    hydrate(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('root'),
    ),
  ) :
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('root'),
  );
