export const environment = {
  authUrl: 'https://lambda-auth-service.herokuapp.com/lambda-auth-service',
  apiRootUrl: `https://alpha-sound-service.herokuapp.com/alpha-sound-service`,
  apiUrl: 'https://alpha-sound-service.herokuapp.com/alpha-sound-service/api',
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '',
  credMode: 'cookie', // cookie only available in https, otherwise set to header
  pingEndpointConfig: {
    ['0']: {
      'chi-discovery-service': {
        url: 'https://chi-discovery-service.herokuapp.com/chi-discovery-service/'
      }
    },
    ['1']: {
      'phi-config-service': {
        url: 'https://phi-config-service.herokuapp.com/phi-config-service/'
      }
    },
    ['2']: {
      'lambda-auth-service': {
        url: 'https://lambda-auth-service.herokuapp.com/lambda-auth-service/'
      }
    },
    ['3']: {
      'alpha-sound-service': {
        url: 'https://alpha-sound-service.herokuapp.com/alpha-sound-service/'
      }
    }
  }
};
