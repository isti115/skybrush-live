import React from 'react';

import Box from '@material-ui/core/Box';

import BackgroundHint from '@skybrush/mui-components/lib/BackgroundHint';

import WHEPView from '~/features/camera/WHEPView';

const CameraView = () => {
  const url = window.location.hash.slice(1);
  try {
    const cameraURL = new URL('whep', url);
    console.info('camera-url', cameraURL);

    return (
      <Box display='flex' flexDirection='column' height='100%'>
        <WHEPView url={url} />
      </Box>
    );
  } catch (error) {
    console.error('camera-url', error);
    return <BackgroundHint text='Please check the camera URL!' />;
  }
};

export default CameraView;
