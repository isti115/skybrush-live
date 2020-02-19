import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';

import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import Shuffle from '@material-ui/icons/Shuffle';

import MappingToggleButton from './MappingToggleButton';

import { augmentMappingAutomaticallyFromSpareDrones } from '~/features/mission/actions';
import { isMappingEditable } from '~/features/mission/selectors';
import { isShowingMissionIds } from '~/features/settings/selectors';
import {
  clearMapping,
  startMappingEditorSession
} from '~/features/mission/slice';
import { toggleMissionIds } from '~/features/settings/slice';

/**
 * Button on the UAV toolbar that allows the user to toggle whether the mission
 * mapping is being used. It also adds a dropdown menu to allow the user to
 * clear or edit the mapping.
 */
const MappingButtonGroup = ({
  augmentMappingAutomaticallyFromSpareDrones,
  mappingEditable,
  showMissionIds,
  startMappingEditorSession
}) => (
  <TransitionGroup>
    {showMissionIds && (
      <Zoom key="editMapping">
        <IconButton
          disabled={mappingEditable || !showMissionIds}
          onClick={startMappingEditorSession}
        >
          <Edit />
        </IconButton>
      </Zoom>
    )}
    {showMissionIds && (
      <Zoom key="automap">
        <IconButton onClick={augmentMappingAutomaticallyFromSpareDrones}>
          <Shuffle />
        </IconButton>
      </Zoom>
    )}
    <Zoom key="showMapping">
      <MappingToggleButton />
    </Zoom>
  </TransitionGroup>
);

MappingButtonGroup.propTypes = {
  augmentMappingAutomaticallyFromSpareDrones: PropTypes.func,
  mappingEditable: PropTypes.bool,
  showMissionIds: PropTypes.bool,
  startMappingEditorSession: PropTypes.func
};

export default connect(
  // mapStateToProps
  state => ({
    mappingEditable: isMappingEditable(state),
    showMissionIds: isShowingMissionIds(state)
  }),
  // mapDispatchToProps
  {
    augmentMappingAutomaticallyFromSpareDrones,
    clearMapping,
    startMappingEditorSession,
    toggleMissionIds
  }
)(MappingButtonGroup);
