const { By, until } = require('selenium-webdriver');

const { TIMEOUT } = require('../config');

async function run(driver, resumePath) {
  try {
    console.log('Starting LinkedIn...');
    await driver.get('https://www.linkedin.com/in/');

    // click on about
    let locator = By.css('[aria-label="Edit about"]');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).click();
    // click on existing document
    locator = By.css('[data-control-name=edit_treasury]');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).click();
    // delete this preexisting document
    locator = By.css('[data-control-name=delete_media]');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).click();
    // upload document
    locator = By.id('pe-treasury-view__media-upload');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).sendKeys(resumePath);
    // change title to "Resume"
    locator = By.id('media-title-input');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).clear();
    await driver.findElement(locator).sendKeys('Resume');
    // hit apply and save to finish
    locator = By.className('pe-form-footer__action--submit form-submit-action ml3 artdeco-button artdeco-button--2 artdeco-button--primary ember-view'); // apply button
    let element = await driver.findElement(locator);
    await driver.wait(until.elementIsEnabled(element), TIMEOUT);
    await driver.findElement(locator).click();
    locator = By.css('[class="pe-form-footer__actions display-flex justify-space-between"] > [class="pe-form-footer__action--submit artdeco-button form-submit-action t-14 t-white t-normal"]'); // save button
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).click();
    console.log('LinkedIn succeeded!');
  } catch (e) {
    console.log(e);
    await driver.quit();
    return Promise.reject(e);
  } finally {
    await driver.quit();
    return Promise.resolve();
  }
}

module.exports = {
  run
};
