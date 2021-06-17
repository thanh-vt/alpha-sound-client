export const environment = {
  authUrl: `https://${window.location.hostname}/service/lambda-auth`,
  apiUrl: `https://${window.location.hostname}/service/alpha-sound/api`,
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '/client/alpha-sound',
  credMode: 'cookie' // cookie only available in https, otherwise set to header
};
