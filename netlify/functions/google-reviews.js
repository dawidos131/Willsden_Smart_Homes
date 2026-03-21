'use strict';

var PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
var PHOTO_PROXY_PATH = '/api/place-photo';

function clampInt(input, min, max, fallback) {
  var value = parseInt(String(input || ''), 10);
  if (!isFinite(value)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, value));
}

function clampFloat(input, min, max, fallback) {
  var value = parseFloat(String(input || ''));
  if (!isFinite(value)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, value));
}

function jsonResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    },
    body: JSON.stringify(body)
  };
}

function buildPhotoProxyUrl(photoReference, maxWidth) {
  return (
    PHOTO_PROXY_PATH +
    '?photoRef=' +
    encodeURIComponent(String(photoReference || '')) +
    '&maxwidth=' +
    encodeURIComponent(String(maxWidth))
  );
}

exports.handler = async function (event) {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed. Use GET.' });
  }

  var apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  if (!apiKey) {
    return jsonResponse(500, { error: 'Server is missing GOOGLE_MAPS_API_KEY.' });
  }

  var query = event.queryStringParameters || {};
  var placeId = String(query.placeId || '').trim();
  if (!placeId) {
    return jsonResponse(400, { error: 'Missing required query parameter: placeId' });
  }

  var maxReviews = clampInt(query.max, 1, 10, 6);
  var minRating = clampFloat(query.minRating, 0, 5, 0);
  var maxPhotos = clampInt(query.maxPhotos, 0, 50, 30);
  var photoMaxWidth = clampInt(query.photoMaxWidth || query.maxwidth, 320, 1600, 1200);

  var params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,rating,user_ratings_total,url,reviews,photos',
    reviews_sort: 'newest',
    reviews_no_translations: 'true',
    key: apiKey
  });

  try {
    var upstreamResponse = await fetch(PLACE_DETAILS_URL + '?' + params.toString());
    if (!upstreamResponse.ok) {
      return jsonResponse(502, {
        error: 'Google Places request failed.',
        status: upstreamResponse.status
      });
    }

    var payload = await upstreamResponse.json();
    if (payload.status !== 'OK' && payload.status !== 'ZERO_RESULTS') {
      return jsonResponse(502, {
        error: 'Google Places returned an error status.',
        status: payload.status,
        message: payload.error_message || ''
      });
    }

    var place = payload.result || {};
    var reviews = Array.isArray(place.reviews) ? place.reviews.slice() : [];
    reviews = reviews
      .filter(function (review) {
        return (Number(review.rating) || 0) >= minRating;
      })
      .sort(function (a, b) {
        return (Number(b.time) || 0) - (Number(a.time) || 0);
      })
      .slice(0, maxReviews)
      .map(function (review) {
        return {
          author_name: review.author_name || '',
          rating: Number(review.rating) || 0,
          text: review.text || '',
          relative_time_description: review.relative_time_description || '',
          time: Number(review.time) || 0,
          profile_photo_url: review.profile_photo_url || '',
          author_url: review.author_url || ''
        };
      });

    var photos = Array.isArray(place.photos) ? place.photos.slice() : [];
    if (maxPhotos > 0) {
      photos = photos
        .slice(0, maxPhotos)
        .map(function (photo) {
          var reference = photo && photo.photo_reference ? String(photo.photo_reference) : '';
          return {
            photo_reference: reference,
            width: Number(photo && photo.width) || null,
            height: Number(photo && photo.height) || null,
            html_attributions: Array.isArray(photo && photo.html_attributions) ? photo.html_attributions : [],
            url: reference ? buildPhotoProxyUrl(reference, photoMaxWidth) : ''
          };
        })
        .filter(function (photo) {
          return Boolean(photo.url);
        });
    } else {
      photos = [];
    }

    return jsonResponse(200, {
      name: place.name || '',
      rating: typeof place.rating === 'number' ? place.rating : Number(place.rating) || null,
      user_ratings_total: Number(place.user_ratings_total) || 0,
      url: place.url || '',
      reviews: reviews,
      photos: photos
    });
  } catch (error) {
    return jsonResponse(500, {
      error: 'Unexpected proxy failure.',
      message: error && error.message ? error.message : 'Unknown error'
    });
  }
};
