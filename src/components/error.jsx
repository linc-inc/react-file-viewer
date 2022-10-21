// Copyright (c) 2017 PlanGrid, Inc.

import React from 'react';

import 'styles/error.scss';

const Error = props => (
  <div className="react-file-viewer-error-message">
    {props.errorComponent
      ? <props.errorComponent {...props} />
      : <p className="alert">Unable to preview file</p>}
  </div>
);

export default Error;
