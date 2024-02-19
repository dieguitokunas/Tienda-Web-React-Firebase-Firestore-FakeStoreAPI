import React from "react";
import { Index } from "./pages/Index";
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
              <Index />
            </Browser>
          </UserCartProducts>
        </GoogleAuth>
      </FirebaseConfig>
    </APICall>
  );
}
