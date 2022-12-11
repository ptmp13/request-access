import React from 'react';
import { useState } from 'react';

import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import {
  EuiText,
  EuiProvider,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiIcon,
  EuiTextColor,
  EuiButtonIcon,
  EuiSpacer
} from '@elastic/eui';

export default function SideNav() {
	return (
		<div>
        <EuiSpacer size="xxl" />
        <EuiIcon type="logoElastic" />
        <Link to='/request-access/spaces'> Request Access </Link>        
        <EuiSpacer size="m" />
				<EuiIcon type="indexOpen" />
        <Link to='/request-access/addIdxPattern'> Add Index Pattern</Link>
		</div>
	)
}