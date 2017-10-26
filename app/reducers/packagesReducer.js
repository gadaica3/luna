import initialState from './initialState';
import {
  TOGGLE_MAIN_LOADER,
  SET_PACKAGES,
  SET_ACTIVE,
  SET_PACKAGES_OUTDATED
} from '../constants/ActionTypes';

const packagesReducer = (state = initialState.packages, action) => {
  switch (action.type) {
    case SET_PACKAGES_OUTDATED:
      return Object.assign({}, state, {
        packagesOutdated: action.packagesOutdated,
        loading: false
      })
    case TOGGLE_MAIN_LOADER:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });
    case SET_PACKAGES:
      return Object.assign({}, state, {
        packages: action.packages,
        loading: false
      });
    case SET_PACKAGES_OUTDATED:
      return Object.assign({}, state, {
        packagesOutdated: action.packages,
        loading: false
      });
    case SET_ACTIVE:
      return Object.assign({}, state, {
        active: action.active,
        loading: false,
        isLoading: false
      });
    default:
      return state;
  }
}

export default packagesReducer