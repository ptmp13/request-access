import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Spaces from './Pages/Spaces'
import SideNav from './Components/Sidenav'
import AddIdxPattern from './Pages/AddIndexPattern'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { useState, useEffect, useRef } from 'react';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import {
  EuiText,
  EuiProvider,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiIcon,
  EuiTextColor,
  EuiButtonIcon
} from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';

// import Home from "./Pages/Home";
// import Settings from "./Pages/HomeSpace";

// export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <EuiProvider colorMode="light">
    {/* <button onClick={() => window.location.reload(false)}>Click to reload!</button> */}
    <Router>
    <EuiPageTemplate>
        <EuiPageTemplate.Sidebar paddingSize="l" minWidth={200} sticky={true}>
          <EuiTitle size="xxs">
            <SideNav />
          </EuiTitle>
        </EuiPageTemplate.Sidebar>
        {/* <EuiPageTemplate.Sidebar sticky="sticky">
          <SideNav />
          <EuiText >
            <p>
              <EuiTextColor color="subdued">
                support email: WeblogicAdmin@sportmaster.ru
              </EuiTextColor>
            </p>
          </EuiText>          
        </EuiPageTemplate.Sidebar>         */}
        <EuiPageTemplate.Section>
        <Routes>
              <Route path="/request-access/spaces" element={<Spaces />} />
              <Route path="/request-access/addIdxPattern" element={<AddIdxPattern />} />
        </Routes>
        </EuiPageTemplate.Section>
    </EuiPageTemplate>
    </Router>
  </EuiProvider>
);