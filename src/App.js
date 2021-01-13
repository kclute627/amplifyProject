import React, { useState, useEffect, createContext } from "react";
import { Authenticator } from "aws-amplify-react";
import { Menu as Nav, Icon, Button } from "element-react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifyGreetings,
  AmplifySignIn,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import myTheme from "./pages/myTheme";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import "./App.css";
import HomePage from "./pages/HomePage";
import MarketPage from "./pages/MarketPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";

// import '@aws-amplify/ui/dist/style.css';

export const UserContext = createContext();

const App = () => {
  const [user, userHandler] = useState();
  const [authState, authStateHandler] = useState();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      authStateHandler(nextAuthState);

      userHandler(authData);
    });
  }, []);

  // const getUser = async () => {
  //   const user = await Auth.currentUserInfo();
  //   return user;
  // };

  const MyTheme = {};

  return authState === AuthState.SignedIn && user ? (
    <UserContext.Provider value={{ user}}>
      <Router>
        <>
          {/* navbar */}
          <Navbar user={user} />

          {/* Routes */}
          <div className='app-container'>
            <Route exact path='/' component={HomePage} />
            <Route path='/profile' component={ProfilePage} />
            <Route
              path='/markets/:marketId'
              component={({ match }) => (
                <MarketPage marketId={match.params.marketId} />
              )}
            />
          </div>
        </>
      </Router>
    </UserContext.Provider>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot='sign-up'
        usernameAlias='email'
        formFields={[
          {
            type: "email",
            label: "Email",
            placeholder: "Enter Email Address",
            required: true,
          },
          {
            type: "password",
            label: "Password",
            placeholder: "Password",
            required: true,
          },
          {
            type: "name",
            label: "Name",
            placeholder: "Enter Your NameName",
            required: true,
          },
        ]}
      />
      <AmplifySignIn slot='sign-in' usernameAlias='email' />
    </AmplifyAuthenticator>
  );
};

export default App;
