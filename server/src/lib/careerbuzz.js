const { By, until } = require('selenium-webdriver');

const { TIMEOUT } = require('../config');

async function run(driver, resumePath) {
  try {
    console.log('Starting CareerBuzz...');
    await driver.get('https://gatech-csm.symplicity.com/students/index.php?s=resume&ss=resumes&mode=form&id=fb837993314bae2ccbacc5640da8c33a');

    // login authentication if it shows up
    let locator = By.name('submit');
    const mustLogin = driver.findElements(locator).length > 0;
    if (mustLogin) {
      await driver.findElement(locator).click();
    }

    // upload resume
    locator = By.id('dnf_class_values_student_document__uploaded_file__0__data_');
    await driver.wait(until.elementLocated(locator), TIMEOUT);
    await driver.findElement(locator).sendKeys(resumePath);

    // submit this change
    locator = By.css('[aria-label="Edit about"]');
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
