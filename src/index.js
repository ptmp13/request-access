import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Spaces from './Components/Spaces'
import SideNav from './Components/Sidenav'
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
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
  <EuiPageTemplate>
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
        <EuiPageTemplate.Header>
        <EuiFlexGroup>
          <EuiFlexItem>        
            <EuiTitle size="l">
              <h1><EuiIcon type="logoElastic" size="xl" /> Spaces</h1>
            </EuiTitle> 
          </EuiFlexItem>
          <EuiTextColor color="subdued">
          <EuiButtonIcon iconType="email"></EuiButtonIcon>  WeblogicAdmin@sportmaster.ru
          </EuiTextColor>          
        </EuiFlexGroup>
        </EuiPageTemplate.Header>
        <EuiPageTemplate.Section>
          <Spaces/>
        </EuiPageTemplate.Section>
  </EuiPageTemplate>
  </EuiProvider>        
);