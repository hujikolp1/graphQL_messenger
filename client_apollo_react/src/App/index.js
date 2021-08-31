import React from 'react';
import { Router, Route } from 'react-router-dom';

import Navigation from '../components/Navigation';
import MessageBoard from '../components/MessageBoard';
import SignUpPage from '../components/SignUp';
import SignInPage from '../components/SignIn';
import AccountPage from '../components/Account';
import DirectMessages from '../components/DirectMessages';
import AdminPage from '../components/Admin';
import withSession from '../components/Session/withSession';

import * as routes from '../constants/routes';
import history from '../constants/history';

const App = ({ session, refetch }) => (
  <Router history={history}>
    <div>
      <Navigation session={session} />

      <hr />

      <Route
        exact
        path={routes.MESSAGE_BOARD}
        component={() => <MessageBoard />}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUpPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignInPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
      <Route
        exact
        path={routes.DIRECT_MESSAGES}
        component={() => <DirectMessages />}
      />
      <Route
        exact
        path={routes.ADMIN}
        component={() => <AdminPage />}
      />
    </div>
  </Router>
);

export default withSession(App);
