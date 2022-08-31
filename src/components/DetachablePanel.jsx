import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import InsertLink from '@material-ui/icons/InsertLink';
import LinkOff from '@material-ui/icons/LinkOff';

import ExternalWindow from '~/components/ExternalWindow';

const DetachablePanel = ({ children, title }) => {
  const [detached, setDetached] = useState(false);

  const toggleButton = (
    <Button
      variant='outlined'
      startIcon={detached ? <InsertLink /> : <LinkOff />}
      onClick={() => setDetached(!detached)}
    >
      {detached ? 'Attach' : 'Detach'}
    </Button>
  );

  const toggleDiv = (
    <div
      style={{
        textAlign: 'center',
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translate(-50%)',
        zIndex: '100',
      }}
    >
      {toggleButton}
    </div>
  );

  return detached ? (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '100%',
          textAlign: 'center',
        }}
      >
        <div>
          {title} panel has been detached.
          <br />
          {toggleButton}
        </div>
      </div>
      <ExternalWindow title={title} onClose={() => setDetached(false)}>
        <div>{children}</div>
        {toggleDiv}
      </ExternalWindow>
    </>
  ) : (
    <>
      <div>{children}</div>
      {toggleDiv}
    </>
  );
};

DetachablePanel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

DetachablePanel.defaultProps = {};

export const makeDetachable = (Component, title) =>
  class extends React.Component {
    render() {
      return (
        <DetachablePanel title={title}>
          <Component {...this.props} />
        </DetachablePanel>
      );
    }
  };

export default DetachablePanel;
