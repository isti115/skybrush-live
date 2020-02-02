import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Edit from '@material-ui/icons/Edit';
import ToggleButton from '@material-ui/lab/ToggleButton';

import { isMappingEditable } from '~/features/mission/selectors';
import { isShowingMissionIds } from '~/features/settings/selectors';
import {
  clearMapping,
  startMappingEditorSession
} from '~/features/mission/slice';
import { toggleMissionIds } from '~/features/settings/slice';

const useStyles = makeStyles(
  () => ({
    toggleButton: {
      border: 0
    }
  }),
  { name: 'MappingButton' }
);

/**
 * Button on the UAV toolbar that allows the user to toggle whether the mission
 * mapping is being used. It also adds a dropdown menu to allow the user to
 * clear or edit the mapping.
 */
const MappingButtonGroup = ({
  mappingEditable,
  showMissionIds,
  startMappingEditorSession,
  toggleMissionIds
}) => {
  const classes = useStyles();

  return (
    <>
      <ToggleButton
        className={classes.toggleButton}
        size="small"
        value="missionIds"
        selected={showMissionIds}
        onChange={toggleMissionIds}
      >
        Mapping
      </ToggleButton>
      <IconButton
        className={classes.toggleButton}
        disabled={mappingEditable || !showMissionIds}
        onClick={startMappingEditorSession}
      >
        <Edit />
      </IconButton>
    </>
  );
};

MappingButtonGroup.propTypes = {
  mappingEditable: PropTypes.bool,
  showMissionIds: PropTypes.bool,
  startMappingEditorSession: PropTypes.func,
  toggleMissionIds: PropTypes.func
};

export default connect(
  // mapStateToProps
  state => ({
    mappingEditable: isMappingEditable(state),
    showMissionIds: isShowingMissionIds(state)
  }),
  // mapDispatchToProps
  { clearMapping, startMappingEditorSession, toggleMissionIds }
)(MappingButtonGroup);