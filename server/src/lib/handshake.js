const { By, until } = require('selenium-webdriver');

const { TIMEOUT } = require('../config');

require('dotenv').config();

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
    try {
      await driver.wait(until.elementLocated(locator), 2500);
      await driver.findElement(locator).click();
    } catch (e) {
      // assume that login authentication since the button didn't show up
      console.log('Handshake: no Handshake login page detected.');
    }

    // login if needed for a second time (this time, GT's auth page)
    locator = By.name('submit');
    try {
      // error if element does not show up within 2 seconds
      await driver.wait(until.elementLocated(locator), 2000);

      console.log('Handshake: login detected');
      // enter user and pass
      await driver.findElement(By.id('username')).sendKeys(process.env.GT_USERNAME || '');
      await driver.findElement(By.id('password')).sendKeys(process.env.GT_PASSWORD || '');
      // press enter
      await driver.findElement(locator).click();
    } catch (e) {
      console.log('Handshake: no GT login detected.');
    }

    // send resume to file upload
    locator = By.id('document_document');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).sendKeys(resumePath);

    await sleep(500);

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
