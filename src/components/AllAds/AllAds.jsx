import React from 'react';
import PropTypes from 'prop-types';
// import itemLogo from '../../assets/img/listing-image.jpg';
import { Link } from "react-router-dom";
import { API_URL } from '../../constants/constants';
// import DeleteIcon from '@material-ui/icons/Delete';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import EditIcon from '@material-ui/icons/Edit';
import DeleteAd from '../Common/DeleteAd';

const AllAds = (props) => {
  const { allAds, filterCategory, title, userId } = props;
  const pageTitle = (title && title.length > 0) ? title : `Displaying ${filterCategory ? filterCategory : `All`} ads`;
  const adsListings = allAds.slice(0, 10).map((ad, index) => {
    let owner = false;
    if(userId && userId == ad.uploader._id) {
      owner = true;
    }
    return (
      <div key={index} className="all-listings-single-listing border">
        <div className="row mr-0 ml-0">
          <div className="col-12 col-sm-3 single-listing-img-container">
            <Link to={`/item/${ad._id}`}><img className="img-fluid" src={`${API_URL}image/${ad.images[0]}`} alt={ad.title} /></Link>
          </div>
          <div className="col-12 col-sm-9 single-listing-description-container">
            <div className="item-title">
              <h3><Link to={`/item/${ad._id}`}>{ad.title}</Link></h3>
              <p>
                Category: <Link to={`/category/${ad.category}`}>{ad.category}</Link>
              </p>
              <div className="row bottom">
                <div className="col-6">
                  <span className="price">Rs. {ad.price}</span>
                </div>
                <div className="col-6 text-right">
                  <a href="javascript:void(0)" title="Save to view later"><WatchLaterIcon /></a>
                  {owner && <Link title="Edit" to={`/my-account/ads/edit/${ad._id}`} ><EditIcon /></Link>}
                  {owner && <DeleteAd adId={ad._id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })

  return (
    <div className="block all-ads">
      <h2 className="mb-0">{pageTitle}</h2>
      <span className="text-muted">We found {allAds.length} items</span>
      <div className="all-listings">
        {adsListings}
      </div>
    </div>
  );
};
AllAds.propTypes = {
  allAds: PropTypes.array.isRequired,
  title: PropTypes.string,
  filterCategory: PropTypes.string,
  userId: PropTypes.string
}
export default AllAds;
