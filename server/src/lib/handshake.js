const { By, until } = require('selenium-webdriver');

const { TIMEOUT } = require('../config');

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve, ms);
  });
}

async function run(driver, resumePath) {
  try {
    console.log('Starting Handshake...');
    await driver.get('https://gatech.joinhandshake.com/documents/14047249/edit');

    // login if needed
    // login authentication if it shows up
    let locator = By.className('sso-button');
    let mustLogin = driver.findElements(locator).length > 0;
    if (mustLogin) {
      await driver.findElement(locator).click();
    }

    await sleep(1000);

    // login authentication if it shows up, again
    locator = By.name('submit');
    mustLogin = driver.findElements(locator).length > 0;
    if (mustLogin) {
      await driver.findElement(locator).click();
    }

    // // bring the resume in focus
    // locator = By.css('[data-tooltip=MichaelFan_Resume.pdf][aria-label=MichaelFan_Resume.pdf]');
    // await driver.wait(until.elementLocated(locator), TIMEOUT);
    // await driver.findElement(locator).click();

    // // click elipses to bring up menu
    // locator = By.css('[aria-label="More actions"]');
    // await driver.wait(until.elementLocated(locator), TIMEOUT);
    // await driver.findElement(locator).click();

    locator = By.id('document_document');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).sendKeys(resumePath);

    // submit this change
    locator = By.name('commit');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).click();

    console.log('Handshake succeeded!');
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
