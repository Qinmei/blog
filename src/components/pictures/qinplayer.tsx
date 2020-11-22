import React from 'react';
import config from '../../../config';

const ReactComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {config.qinplayerPic.map(item => (
        <img src={item} alt="" key={item} style={{ maxWidth: 1200 }} />
      ))}
    </div>
  );
};

export default ReactComponent;
