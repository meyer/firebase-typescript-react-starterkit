import { Block } from 'jsxstyle';
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { customHistory } from '~/customHistory';

export const App: React.FC = () => (
  <Block padding={20} fontSize={16}>
    <Router history={customHistory}>
      <Switch>
        <Route exact path="/" render={() => <Block>Hello!</Block>} />
        <Route path="*" render={() => <Block>404: Page not found</Block>} />
      </Switch>
    </Router>
  </Block>
);
