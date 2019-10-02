// tslint:disable: ordered-imports
import './reset.css';

import React from 'react';
import { render } from 'react-dom';

import { App } from './App';

const domID = document.getElementById('.react-root');
render(<App />, domID);
