export const environment = {
  authUrl: `http://${window.location.host}/service/lambda-auth`,
  apiRootUrl: `http://${window.location.host}/service/alpha-sound`,
  apiUrl: `http://${window.location.host}/service/alpha-sound/api`,
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '/',
  credMode: 'header', // cookie only available in https, otherwise set to header
  pingEndpointConfig: {
    ['0']: {
      'chi-discovery-service': {
        url: `http://${window.location.host}/service/chi-discovery/`
      }
    },
    ['1']: {
      'phi-config-service': {
        url: `http://${window.location.host}/service/phi-config/`
      }
    },
    ['2']: {
      'lambda-auth-service': {
        url: `http://${window.location.host}/service/lambda-auth/`
      }
    },
    ['3']: {
      'alpha-sound-service': {
        url: `http://${window.location.host}/service/alpha-sound/`
      }
    }
  }
};
