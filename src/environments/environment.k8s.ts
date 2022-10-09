export const environment = {
  authUrl: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/lambda-auth`,
  apiRootUrl: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/alpha-sound`,
  apiUrl: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/alpha-sound/api`,
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '/api/v1/namespaces/vengeance/services/vengeance:80/proxy/',
  credMode: 'header', // cookie only available in https, otherwise set to header
  pingEndpointConfig: {
    ['0']: {
      'chi-discovery-service': {
        url: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/chi-discovery`
      }
    },
    ['1']: {
      'phi-config-service': {
        url: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/phi-config`
      }
    },
    ['2']: {
      'lambda-auth-service': {
        url: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/proxy`
      }
    },
    ['3']: {
      'alpha-sound-service': {
        url: `http://${window.location.host}/api/v1/namespaces/vengeance/services/vengeance:80/proxy/alpha-sound`
      }
    }
  }
};
