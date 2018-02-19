import PropTypes from 'prop-types'
import React from 'react'

import IconButton from 'material-ui/IconButton'
import withTheme from 'material-ui/styles/withTheme'
import ActionPanTool from 'material-ui-icons/PanTool'
import ActionZoomIn from 'material-ui-icons/ZoomIn'
import ContentSelectAll from 'material-ui-icons/SelectAll'

import MapRotationTextBox from './MapRotationTextBox'
import FitAllFeaturesButton from './FitAllFeaturesButton'

import partial from 'lodash/partial'
import { connect } from 'react-redux'

import { selectMapTool } from '../../actions/map'
import { Tool } from './tools'

/**
 * Separator component for the toolbar
 *
 * @returns {Object} the rendered component
 */
const MapToolbarSeparator = () => {
  return (
    <div style={{
      display: 'inline-block',
      height: '48px',
      borderLeft: '1px solid rgba(0, 0, 0,  0.172549)',
      verticalAlign: 'top'
    }} />
  )
}

/**
 * Presentation component for the map toolbar.
 *
 * @returns {React.Element} the rendered component
 */
const MapToolbarPresentation = ({ onToolSelected, selectedTool, theme }) => {
  const colorForTool = (tool) => (
    selectedTool === tool ? 'primary' : undefined
  )

  return (
    <div>
      <IconButton onClick={partial(onToolSelected, Tool.SELECT)} tooltip='Select'>
        <ContentSelectAll color={colorForTool(Tool.SELECT)} />
      </IconButton>
      <IconButton onClick={partial(onToolSelected, Tool.PAN)} tooltip='Pan'>
        <ActionPanTool color={colorForTool(Tool.PAN)} />
      </IconButton>
      <IconButton onClick={partial(onToolSelected, Tool.ZOOM)} tooltip='Zoom'>
        <ActionZoomIn color={colorForTool(Tool.ZOOM)} />
      </IconButton>

      <MapToolbarSeparator />

      <MapRotationTextBox resetDuration={500} fieldWidth='75px'
        style={{
          display: 'inline-block',
          marginRight: '12px',
          verticalAlign: 'top'
        }} />

      <MapToolbarSeparator />

      <FitAllFeaturesButton duration={500} margin={64} />
    </div>
  )
}

MapToolbarPresentation.propTypes = {
  onToolSelected: PropTypes.func,
  selectedTool: PropTypes.string,
  theme: PropTypes.object.isRequired
}

/**
 * Main toolbar on the map.
 */
const MapToolbar = connect(
  // mapStateToProps
  state => Object.assign({}, state.map.tools),
  // mapDispatchToProps
  dispatch => ({
    onToolSelected (tool) {
      dispatch(selectMapTool(tool))
    }
  })
)(withTheme()(MapToolbarPresentation))

export default MapToolbar