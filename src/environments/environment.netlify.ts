const BACKEND_TUNNEL = 'https://vengeance.loca.lt';

export const environment = {
  authUrl: `${BACKEND_TUNNEL}/service/lambda-auth`,
  apiRootUrl: `${BACKEND_TUNNEL}/service/alpha-sound`,
  apiUrl: `${BACKEND_TUNNEL}/service/alpha-sound/api`,
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '/',
  credMode: 'header', // cookie only available in https, otherwise set to header
  pingEndpointConfig: {
    ['0']: {
      'chi-discovery-service': {
        url: `${BACKEND_TUNNEL}/service/chi-discovery/`
      }
    },
    ['1']: {
      'phi-config-service': {
        url: `${BACKEND_TUNNEL}/service/phi-config/`
      }
    },
    ['2']: {
      'lambda-auth-service': {
        url: `${BACKEND_TUNNEL}/service/lambda-auth/`
      }
    },
    ['3']: {
      'alpha-sound-service': {
        url: `${BACKEND_TUNNEL}/service/alpha-sound/`
      }
    }
  }
};
