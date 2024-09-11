const NodeGeocoder = require("node-geocoder");
console.log(process.env.GEOCODER_PROVIDER,process.env.GEOCODER_API_KEY)
GEOCODER_API_KEY="eAoRsUXwL9vuMvk0FesPUfGNKAXM8UVI"
const options = {
  provider: 'mapquest',
  // Optional depending on the providers
  httpAdapter: "https",
  apiKey:GEOCODER_API_KEY,
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
module.exports = geocoder;
