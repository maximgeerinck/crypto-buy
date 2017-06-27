import React from 'react';
import { Route } from 'react-router';
import NotFoundPage from './components/NotFoundPage';
import HomePage from './app/HomePage';
import LoginPage from './authentication/LoginPage';
import RegisterPage from './user/RegisterPage';
import AccountPage from './user/AccountPage';
import ForgotPasswordPage from './authentication/ForgotPasswordPage';
import ResetPasswordPage from './authentication/ResetPasswordPage';
import EnsureLoggedIn from './authentication/EnsureLoggedIn';
import PortfolioPage from './portfolio/Portfolio';

const routes = (
  <Route path="/" component={PortfolioPage}>

    <Route path="login" component={LoginPage} />
    <Route path="register" component={RegisterPage} />
    <Route path="forgot" component={ForgotPasswordPage} />
    <Route path="reset/:email/:token" component={ResetPasswordPage} />

    <Route component={EnsureLoggedIn}>
      <Route path="account" component={AccountPage} />
    </Route>

    <Route path="*" component={NotFoundPage} />
  </Route>
);

export default routes;
