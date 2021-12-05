import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<never> {
    return browser.get(browser.baseUrl) as Promise<never>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
