import * as React from "react";
import Button from 'react-bootstrap/Button'
import {
  AzureAD,
  AuthenticationState,
  IAzureADFunctionProps
} from "react-aad-msal";

// Import the authentication provider which holds the default settings
import { authProvider } from "./lib/authProvider";

export const LoginButton = () => {
    console.log(authProvider)
  
  return (
    <AzureAD provider={authProvider}>
      {({ login, logout, authenticationState }: IAzureADFunctionProps) => {
        const isInProgress =
          authenticationState === AuthenticationState.InProgress;
        const isAuthenticated =
          authenticationState === AuthenticationState.Authenticated;
        const isUnauthenticated =
          authenticationState === AuthenticationState.Unauthenticated;

        if (isAuthenticated) {
          return (
            <React.Fragment>
              <Button variant="outline-light" onClick={logout}>
                Sign out
              </Button>
            </React.Fragment>
          );
        } else if (isUnauthenticated || isInProgress) {
          return (
            <Button variant="outline-light" onClick={login} disabled={isInProgress}>
              Sign in
            </Button>
          );
        }
      }}
    </AzureAD>
  );
};
