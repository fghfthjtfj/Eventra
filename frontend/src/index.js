import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { CategoryProvider } from "./context/categoryContext";
import { UserProvider } from "./context/userContext";
import { ArtistProvider } from "./context/artistContext";
import { CitiesProvider } from "./context/citiesContext";
import { SubscriptionProvider } from "./context/subscriptionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SubscriptionProvider>
        <CitiesProvider>
          <ArtistProvider>
            <CategoryProvider>
              <UserProvider>
                <App />
              </UserProvider>
            </CategoryProvider>
          </ArtistProvider>
        </CitiesProvider>
      </SubscriptionProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
