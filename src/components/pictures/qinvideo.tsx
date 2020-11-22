import React from 'react';
import config from '../../../config';

const ReactComponent = () => {
  return (
    <>
      {config.qinvideoPic.map(item => (
        <img src={item} alt="" key={item} />
      ))}
    </>
  );
};

export default ReactComponent;
