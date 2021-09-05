export const environment = {
  authUrl: 'https://lambda-auth-service.herokuapp.com/lambda-auth',
  apiRootUrl: `https://alpha-sound-service.herokuapp.com/alpha-sound`,
  apiUrl: 'https://alpha-sound-service.herokuapp.com/alpha-sound/api',
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: true,
  baseHref: '',
  credMode: 'cookie', // cookie only available in https, otherwise set to header
  pingEndpointConfig: {
    ['0']: {
      'chi-discovery-service': {
        url: 'https://chi-discovery-service.herokuapp.com/'
      }
    },
    ['1']: {
      'phi-config-service': {
        url: 'https://phi-config-service.herokuapp.com/'
      }
    },
    ['2']: {
      'lambda-auth-service': {
        url: 'https://lambda-auth-service.herokuapp.com/lambda-auth/'
      },
      'alpha-sound-service': {
        url: 'https://alpha-sound-service.herokuapp.com/alpha-sound/'
      }
    }
  }
};
