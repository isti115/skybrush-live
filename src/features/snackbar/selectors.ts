/*
 * Selectors related to the snackbar of the application.
 */

import { type RootSelector } from '~/store/reducers';

import { type Notification } from './types';

/**
 * Selects the most recent fire-and-forget type of notification that was added
 * to the snackbar.
 */
// export const selectActiveNotification = (state: RootState): Notification =>
export const selectActiveNotification: RootSelector<Notification> = (state) =>
  state.snackbar.notification;
