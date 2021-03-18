// This audioFiles can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of audioFiles replacements can be found in `angular.json`.

export const environment = {
  authUrl: `https://${window.location.hostname}:8082/lambda-auth`,
  apiUrl: `https://${window.location.hostname}:8086/alpha-sound/api`,
  clientId: 'alpha_sound',
  clientSecret: '@lph@123',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following audioFiles
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
