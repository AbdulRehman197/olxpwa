import { createLogic } from 'redux-logic';
// import { sessionService } from 'redux-react-session';
import * as types from '../constants/constants';
import * as adActions from '../actions/AdActions';
import axios from 'axios';
import toastr from 'toastr';
const url = types.API_URL;

const submitAdLogic = createLogic({
  type: types.SUBMIT_AD, // only apply this logic to this type
  // debounce: 250,
  latest: true,
  validate({ getState, action }, allow) {
    let state = getState();
    if (!state.session.authenticated) {
      toastr.error('Unauthorized request');
    }
    if (!state.session.user.id) {
      toastr.error("Please login to submit your ad.");
    } else {
      allow(action);
    }
  },
  process: function ({ getState, action }, dispatch, done) {
    var fd = action.payload;
    // since action.payload is already a FormData instance, so need to append uploader user here
    var state = getState();
    fd.append('user', state.session.user.id);

    axios.post(url + 'ads/submitAd', fd)
      .then(resp => {
        toastr.info(resp.data.message);
        // dispatch(adActions.adSubmittedSuccessful());
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
});

const loadAllAdsLogic = createLogic({
  type: types.LOAD_ALL_ADS, // only apply this logic to this type

  process: function ({getState, action}, dispatch, done) { // eslint-disable-line no-unused-vars
    axios.get(url + 'ads/getAllAds')
      .then(resp => {
        dispatch(adActions.loadAllAdsSuccess(resp.data));
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
});

const filterAdsLogic = createLogic({
  type: types.FILTER_ADS, // only apply this logic to this type

  process: function ({ action }, dispatch, done) {
    axios.get(url + 'ads/filterAds', {
      params: {filters: JSON.stringify(action.payload)}
    })
      .then(resp => {
        dispatch(adActions.loadAllAdsSuccess(resp.data)); //to update the filtered ads in ui
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
});

const loadMyAdsLogic = createLogic({
  type: types.LOAD_MY_ADS, // only apply this logic to this type
  process: function ({ getState }, dispatch, done) {
    let state = getState();
    let filters = {uploader: state.session.user.id};
    axios.get(url + 'ads/filterAds', {
      params: { filters: JSON.stringify(filters) }
    })
      .then(resp => {
        dispatch(adActions.loadMyAdsSuccess(resp.data)); //to update the filtered ads in ui
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
});

const searchAdsLogic = createLogic({
  type: types.SEARCH_ADS, // only apply this logic to this type

  process: function ({ action }, dispatch, done) {
    axios.get(url + 'ads/searchAdsListings', {
      params: {searchQuery: JSON.stringify(action.payload)}
    })
      .then(resp => {
        dispatch(adActions.loadAllAdsSuccess(resp.data)); //to update the filtered ads in ui
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
})

// deleting an Ad listing
const deleteAdListingLogic = createLogic({
  type: types.DELETE_AD,
  latest: true,
  validate({ getState, action }, allow) {
    let state = getState();
    if (!state.session.authenticated) {
      toastr.error('Unauthorized request');
    } else {
      allow(action);
    }
  },

  process: function ({ action }, dispatch, done) {
    axios.post(url + 'ads/deleteAdListing', {
      adId: action.payload,
    })
      .then(response => {
        // if (response.data.status == "ok") {
        // }
        toastr.success(response.data.message);
        dispatch(adActions.loadMyAds());
        // load listings again,
        // if (getState().session.user.userType == "seeker") {
        //   dispatch(listingActions.loadMyListings(getState().session.user));
        // } else if (getState().session.user.userType == "admin") {
        //   dispatch(listingActions.loadAllListings());
        // }
      }).catch(error => {
        toastr.error(error);
      }).then(() => done());
  }
});

const updateAdListingLogic = createLogic({
  type: types.UPDATE_AD, // only apply this logic to this type

  validate({ getState, action }, allow) {
    let state = getState();
    if (!state.session.authenticated) {
      toastr.error('Unauthorized request');
    } else {
      allow(action);
    }
  },

  process({ getState, action }, dispatch, done) {
    let state = getState();
    // action.payload is already an instance of FormData(), so just appended new user field
    let fd = action.payload;
    fd.append('user', state.session.user.id);
    axios.post(url + 'ads/updateAdListing', fd)
      .then(resp => {
        toastr.info(resp.data.message);
        dispatch(adActions.loadMyAds());
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
});

const getCategorisCountsLogic = createLogic({
  type: types.LOAD_CATEGORIES_COUNTS, // only apply this logic to this type

  process: function ({ action }, dispatch, done) { // eslint-disable-line no-unused-vars
    axios.get(url + 'ads/getCategorisCounts')
      .then(resp => {
        dispatch(adActions.loadCategoriesCountsSuccess(resp.data));
      })
      .catch(err => {
        toastr.error(err);
      })
      .then(() => done());
  }
});

// pollsLogic
export default [
  submitAdLogic,
  loadAllAdsLogic,
  filterAdsLogic,
  loadMyAdsLogic,
  searchAdsLogic,
  updateAdListingLogic,
  deleteAdListingLogic,
  getCategorisCountsLogic,
];