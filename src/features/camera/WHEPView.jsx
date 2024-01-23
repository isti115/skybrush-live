import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import Box from '@material-ui/core/Box';

import { initVideoElement, WHEPClient } from './mediamtx-whep';

// const WHEPView = ({ url }) => {
//   const container = useRef();
//
//   useEffect(() => {
//     if (container.current) {
//       initVideoElement((video) => new WHEPClient(video), container.current)();
//     }
//   }, []);
//
//   return <Box ref={container} width='100%' height='100%'></Box>;
// };

const WHEPView = ({ url }) => {
  const video = useRef();

  useEffect(() => {
    if (video.current) {
      const wc = new WHEPClient(url, video.current);
      return () => {
        wc.stop();
      };
    }
  }, [url]);

  return <video ref={video} autoPlay width='100%' height='100%' />;
};

WHEPView.propTypes = {
  url: PropTypes.string,
};

export default WHEPView;
