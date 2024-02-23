import React from "react";
import { Browser } from "./router/Browser";
import { APICall } from "./contexts/APICall";
import { FirebaseConfig } from "./contexts/FireBaseConfig";
import { UserCartProducts } from "./contexts/UserCartProducts";
import { GoogleAuth } from "./contexts/GoogleAuth";
export function App() {
  return (
    <APICall>
      <FirebaseConfig>
        <GoogleAuth>
          <UserCartProducts>
          
            <Browser>
            </Browser>
          </UserCartProducts>
        </GoogleAuth>
      </FirebaseConfig>
    </APICall>
  );
}
