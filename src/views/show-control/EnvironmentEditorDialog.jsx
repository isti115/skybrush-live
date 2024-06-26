import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import DraggableDialog from '@skybrush/mui-components/lib/DraggableDialog';

import { getShowEnvironmentType } from '~/features/show/selectors';
import { closeEnvironmentEditorDialog } from '~/features/show/slice';

import IndoorEnvironmentEditor from './IndoorEnvironmentEditor';
import OutdoorEnvironmentEditor from './OutdoorEnvironmentEditor';

const instructionsByType = {
  indoor: 'environmentEditorDialog.indoor',
  outdoor: 'environmentEditorDialog.outdoor',
};

const Instructions = withTranslation()(({ type, t }) => (
  <Typography variant='body1'>{t(instructionsByType[type])}</Typography>
));

Instructions.propTypes = {
  type: PropTypes.oneOf(Object.keys(instructionsByType)),
};

/**
 * Presentation component for the dialog that shows the form that the user
 * can use to edit the environment settings of a drone show.
 */
const EnvironmentEditorDialog = ({ editing, onClose, type, t }) => (
  <DraggableDialog
    fullWidth
    open={editing}
    maxWidth='sm'
    title={t('environmentEditorDialog.environmentSettings')}
    onClose={onClose}
  >
    <DialogContent>
      <Box my={2}>
        <Instructions type={type} />
        {type === 'outdoor' && <OutdoorEnvironmentEditor />}
        {type === 'indoor' && <IndoorEnvironmentEditor />}
      </Box>
    </DialogContent>
  </DraggableDialog>
);

EnvironmentEditorDialog.propTypes = {
  editing: PropTypes.bool,
  onClose: PropTypes.func,
  type: PropTypes.oneOf(['indoor', 'outdoor']),
  t: PropTypes.func,
};

EnvironmentEditorDialog.defaultProps = {
  editing: false,
};

export default connect(
  // mapStateToProps
  (state) => ({
    editing: state.show.environment.editing,
    type: getShowEnvironmentType(state),
  }),

  // mapDispatchToProps
  {
    onClose: closeEnvironmentEditorDialog,
  }
)(withTranslation()(EnvironmentEditorDialog));
