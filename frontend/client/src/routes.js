import React from "react";
import { Route } from "react-router";
import NotFoundPage from "./components/NotFoundPage";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./user/RegisterPage";
import AccountPage from "./user/AccountPage";
import ForgotPasswordPage from "./authentication/ForgotPasswordPage";
import ResetPasswordPage from "./authentication/ResetPasswordPage";
import EnsureLoggedIn from "./authentication/EnsureLoggedIn";
import HomePage from "./app/HomePage";
import ChangePasswordPage from "./user/ChangePasswordPage";

import ShareOverview from "./share/ShareOverview";

const routes = (
    <Route>
        <Route path="/" component={HomePage} />
        <Route path="share/:shareLink" component={ShareOverview} />
        <Route path="login" component={LoginPage} />
        <Route path="register" component={RegisterPage} />
        <Route path="forgot" component={ForgotPasswordPage} />
        <Route path="reset/:email/:token" component={ResetPasswordPage} />

        <Route component={EnsureLoggedIn}>
            <Route path="account" component={AccountPage} />
            <Route path="password" component={ChangePasswordPage} />
        </Route>

        <Route path="*" component={NotFoundPage} />
    </Route>
);

export default routes;
