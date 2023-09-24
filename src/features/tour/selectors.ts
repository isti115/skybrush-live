import { type RootState } from '~/store/reducers';

/**
 * Returns whether the tour should be shown to the user after the
 * startup of the application.
 */
export const shouldOfferTourToUser = (state: RootState): boolean =>
  !state.tour.seen && !state.tour.isOpen;
