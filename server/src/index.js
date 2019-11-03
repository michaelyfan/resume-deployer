const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const path = require('path');
const fs = require('fs-extra');

const linkedin = require('./lib/linkedin');
const careerbuzz = require('./lib/careerbuzz');
const handshake = require('./lib/handshake');

const METHOD_MAP = {
  'linkedin': linkedin.run,
  'careerbuzz': careerbuzz.run,
  'handshake': handshake.run,
};

async function runAll(resumeFile, config) {

  // rename to have pdf
  const newResumePath = path.join(resumeFile.path, '..', 'current.pdf');
  fs.renameSync(resumeFile.path, newResumePath);

  // default Firefox profile for now
  const PROFILE_PATH = path.join(__dirname, 'dw7p47ey.default-release');

  const errors = [];
  const promises = [];
  Object.keys(config).filter((field) => config[field] === true || config[field] === 'true').forEach(async (name) => {
    const thisFunction = METHOD_MAP[name];
    // create driver for use in lib functions
    const options = new firefox.Options()
      .setProfile(PROFILE_PATH);
    const driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
    promises.push(
      thisFunction(driver, newResumePath).catch((err) => {
        errors.push(err);
      })
    );
  });

  await Promise.all(promises);
  return Promise.resolve(errors);
}

module.exports = {
  runAll
};
