const express = require('express');
const os = require('os');

const app = express();
const yelp = require('yelp-fusion');
const client = yelp.client('nAd8bW1ICXAn7c5TNcK00_I70Qxb7vGaGp49uW1cKl9bY8RnTezTqnI0pdtwhF7KaxwI0071FqYJvm4GZt-TBiP78WTkRL5hmT7OtFXiTLWALbqScwcqGD6dqt5xW3Yx');

app.use(express.static('dist'));

app.get('/api/getBusinessDetails/:name/:location', function(req, res) {
  client.search({
    term: req.params.name,
    location: req.params.location
  }).then(response => {
    business = response.jsonBody.businesses[0];
    businessDetails = {
      name: business.name,
      id: business.id,
      location: business.location.address1 + ', ' +
                business.location.city + ' ' +
                business.location.state + ' ' +
                business.location.zip_code,
      phone: business.phone,
      rating: business.rating,
      price: business.price,
      longitude: business.coordinates.longitude,
      latitude: business.coordinates.latitude,
      review_count: business.review_count
    };
    res.send(businessDetails);
  }).catch(e => {
    res.send({business_not_found:1});
  });
});

app.get('/api/rankBusinesses/:businesses/:criteria', function(req, res) {
    businessList = JSON.parse(req.params.businesses);
    criteria = req.params.criteria;
    if (criteria == 'Price') {
      businessList.sort(function(a,b) {return (a.price.length > b.price.length) ? 1 : ((b.price.length > a.price.length) ? -1 : 0);} );
    } else if (criteria === 'Rating') {
      businessList.sort(function(a,b) {return (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0);} );
    } else if (criteria === 'Popularity') {
      businessList.sort(function(a,b) {return (a.review_count > b.review_count) ? 1 : ((b.review_count > a.review_count) ? -1 : 0);} );
    }
    res.send(businessList)
});
app.listen(8080, () => console.log('Listening on port 8080!'));
