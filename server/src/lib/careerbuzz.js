const { By, until } = require('selenium-webdriver');

const { TIMEOUT } = require('../config');

require('dotenv').config();

async function run(driver, resumePath) {
  try {
    console.log('Starting CareerBuzz...');
    await driver.get('https://gatech-csm.symplicity.com/students/index.php?s=resume&ss=resumes&mode=form&id=fb837993314bae2ccbacc5640da8c33a');

    // login authentication if it shows up
    let locator = By.name('submit');
    try {
      // error if element does not show up within 2 seconds
      await driver.wait(until.elementLocated(locator), 2000);

      // enter user and pass
      await driver.findElement(By.id('username')).sendKeys(process.env.GT_USERNAME || '');
      await driver.findElement(By.id('password')).sendKeys(process.env.GT_PASSWORD || '');
      // press enter
      await driver.findElement(locator).click();
    } catch (e) {
      console.log('CareerBuzz: no login detected.');
    }

    // upload resume
    locator = By.id('dnf_class_values_student_document__uploaded_file__0__data_');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).sendKeys(resumePath);

    // submit this change
    locator = By.css('.buttonbar-bottom > [name=dnf_opt_submit]');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).click();

    console.log('CareerBuzz succeeded!');
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
