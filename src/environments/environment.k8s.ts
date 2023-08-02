export const environment = {
  authUrl: `https://${window.location.host}/lambda-auth-service`,
  apiRootUrl: `https://${window.location.host}/alpha-sound-service`,
  apiUrl: `https://${window.location.host}/alpha-sound-service/api`,
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '/alpha-sound-client',
  credMode: 'header', // cookie only available in https, otherwise set to header
  pingEndpointConfig: {
    ['0']: {
      'chi-discovery-service': {
        url: `https://${window.location.host}/chi-discovery-service/`
      }
    },
    ['1']: {
      'phi-config-service': {
        url: `https://${window.location.host}/phi-config-service/`
      }
    },
    ['2']: {
      'lambda-auth-service': {
        url: `https://${window.location.host}/lambda-auth-service/`
      }
    },
    ['3']: {
      'alpha-sound-service': {
        url: `https://${window.location.host}/alpha-sound-service/`
      }
    }
  }
};
