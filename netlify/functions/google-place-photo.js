'use strict';

var PLACE_PHOTO_URL = 'https://maps.googleapis.com/maps/api/place/photo';

function clampInt(input, min, max, fallback) {
  var value = parseInt(String(input || ''), 10);
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

exports.handler = async function (event) {
  if (event.httpMethod && event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed. Use GET.' });
  }

  var apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  if (!apiKey) {
    return jsonResponse(500, { error: 'Server is missing GOOGLE_MAPS_API_KEY.' });
  }

  var query = event.queryStringParameters || {};
  var photoRef = String(query.photoRef || query.photo_reference || '').trim();
  if (!photoRef) {
    return jsonResponse(400, { error: 'Missing required query parameter: photoRef' });
  }

  var maxWidth = clampInt(query.maxwidth || query.maxWidth, 320, 1600, 1200);
  var params = new URLSearchParams({
    photo_reference: photoRef,
    maxwidth: String(maxWidth),
    key: apiKey
  });

  try {
    var upstreamResponse = await fetch(PLACE_PHOTO_URL + '?' + params.toString(), {
      method: 'GET',
      redirect: 'follow'
    });

    if (!upstreamResponse.ok) {
      return jsonResponse(502, {
        error: 'Google Place Photo request failed.',
        status: upstreamResponse.status
      });
    }

    var contentType = upstreamResponse.headers.get('content-type') || 'image/jpeg';
    var cacheControl = upstreamResponse.headers.get('cache-control') || 'public, max-age=86400';
    var imageBuffer = Buffer.from(await upstreamResponse.arrayBuffer());

    return {
      statusCode: 200,
      headers: {
        'content-type': contentType,
        'cache-control': cacheControl
      },
      isBase64Encoded: true,
      body: imageBuffer.toString('base64')
    };
  } catch (error) {
    return jsonResponse(500, {
      error: 'Unexpected photo proxy failure.',
      message: error && error.message ? error.message : 'Unknown error'
    });
  }
};
