const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const driver = new webdriver.Builder().forBrowser('chrome').build();
const expect = chai.expect;

describe('End to End Test Suite', done => {
  before(done => {
    console.log('Before everything login to the page');
    driver.get('http://localhost:3003').then(function(res) {
      driver
        .findElement(By.id('username'))
        .sendKeys('cuneyt')
        .then(() => driver.findElement(By.id('password')).sendKeys('sifre123'))
        .then(() => driver.findElement(By.id('btn')).click())
        .then(() => {
          driver.wait(until.elementLocated(By.id('message'))).then(() => {
            done();
          });
        });
    });
  });

  it('can read welcome message', () => {
    console.log('Ready to read welcome message');
    return expect(driver.findElement(By.id('message')).getAttribute('innerHTML')).to.eventually.contain(
      'Welcome to my page!'
    );
  });
});
