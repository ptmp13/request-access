import React from 'react';
import Home from '../Pages/Home'
import Settings from '../Pages/Settings'
import { useState } from 'react';
import { 
  EuiIcon,
  EuiSideNav,
  slugify
} from '@elastic/eui';

import { css } from '@emotion/react';
import '@elastic/eui/dist/eui_theme_light.css';
let base64 = require('base-64');

export default function SideNav() {
    const [isSideNavOpenOnMobile, setIsSideNavOpenOnMobile] = useState(false);
    const [selectedItemName, setSelectedItem] = useState(true);
    const [count, setCount] = useState(0);
  
    function testNavHome()
    {
      return <h1>OLOLOL</h1>
    }

    function testNavSettings()
    {
      return <h1>ALAALL</h1>
    }

    const toggleOpenOnMobile = () => {
      setIsSideNavOpenOnMobile(!isSideNavOpenOnMobile);
    };
  
    const selectItem = (name) => {
      setSelectedItem(name);
    };
  
    const createItem = (name, data = {}) => {
      // NOTE: Duplicate `name` values will cause `id` collisions.
      return {
        id: slugify(name),
        name,
        isSelected: selectedItemName === name,
        onClick:  () => selectItem(name),
        ...data,
      };
    };
  
    const sideNav = [
      createItem('ELK', {
        onClick: () => testNavHome,
        icon: <EuiIcon type="logoElasticsearch" />,
        items: [
          createItem('Spaces'),
          createItem('Add Index Pattern'),
        ],
      }),
      createItem('Kibana', {
        onClick: () => testNavSettings,
        icon: <EuiIcon type="logoKibana" />,
        items: [
          createItem('Advanced settings', {
            items: [
              createItem('General', { disabled: true }),
              createItem('Timelion', {
                items: [
                  createItem('Time stuff', {
                    icon: <EuiIcon type="clock" />,
                  }),
                  createItem('Lion stuff', {
                    icon: <EuiIcon type="stats" />,
                  }),
                ],
              }),
              createItem('Visualizations'),
            ],
          }),
          createItem('Index Patterns'),
          createItem('Saved Objects'),
          createItem('Reporting'),
        ],
      }),
      createItem('Logstash', {
        href: '/#/navigation/ololol',
        icon: <EuiIcon type="logoLogstash" />,
        items: [createItem('Pipeline viewer')],
      }),
    ];
  
    return (
      <EuiSideNav
        aria-label="Complex example"
        mobileTitle="Navigate within $APP_NAME"
        toggleOpenOnMobile={toggleOpenOnMobile}
        isOpenOnMobile={isSideNavOpenOnMobile}
        items={sideNav}
        style={{ width: 192 }}
      />
    );  
  }