import { createSelector } from '@reduxjs/toolkit';

import { getMapViewRotationAngle } from '~/selectors/map';
import { type RootSelector } from '~/store/reducers';
import { Collection, selectOrdered } from '~/utils/collections';
import { SavedLocation } from './types';
import { MapViewSliceState } from '../map/view';

/**
 * Selector that calculates and caches the list of all the saved locations
 * in the state object, in exactly the same order as they should appear on
 * the UI.
 */
export const getSavedLocationsInOrder = createSelector(
  ((state) => state.savedLocations) satisfies RootSelector<
    Collection<SavedLocation>
  >,
  ({ byId, order }) => selectOrdered({ byId, order })
);

/**
 * Selector that returns a fake location that can be used in the
 * saved location editor dialog when the user wants to save the current
 * state of the map view as a new location.
 */
export const getCurrentMapViewAsSavedLocation: RootSelector<{
  center: {
    lon: string;
    lat: string;
  };
  rotation: number;
  zoom: number;
}> = // Pick<SavedLocation, 'center' | 'rotation' | 'zoom'>
  createSelector(
    ((state) => state.map.view) as RootSelector<MapViewSliceState>,
    getMapViewRotationAngle,
    (view, rotation) => ({
      center: {
        lon: view.position[0].toFixed(6),
        lat: view.position[1].toFixed(6),
      },
      rotation,
      zoom: Math.round(view.zoom),
    })
  );

/**
 * Selector that returns the id of the saved location currently being edited.
 */
export const getEditedLocationId: RootSelector<string | undefined> = (state) =>
  state.dialogs.savedLocationEditor.editedLocationId;

/**
 * Selector that determines whether the saved location editor dialog is open.
 */
export const getEditorDialogVisibility: RootSelector<boolean> = (state) =>
  state.dialogs.savedLocationEditor.dialogVisible;
