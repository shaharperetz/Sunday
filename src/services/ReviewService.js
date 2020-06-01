import HttpService from './HttpService';

export default {
  add,
  query,
  remove
};


// return axios.get('api/toy/?id=1223&balance=13');
// return axios.get('api/toy/?', {params: {id: 1223, balanse:13}});


function query(filterBy) {
  var queryStr = `?name=${filterBy.name}&sort=anaAref`;
  return HttpService.get(`review${queryStr}`);
}

function remove(reviewId) {
  return HttpService.delete(`review/${reviewId}`);
}
async function add(review) {
  const addedReview  = await HttpService.post(`review`, review);
  return  addedReview
}
