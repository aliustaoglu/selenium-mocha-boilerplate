# End to end testing with Selenium, mocha and chai

Setting up the environment for automation testing is actually not that hard. I'm not going to tell how useful TDD approach is. I'll cut it short and tell you how to set up the a simple boilerplate that could be extended for everyone's needs.

### Components

*chromedriver* : We won't be using this library directly but selenium-webdriver will.

*selenium-webdriver* : We need this to open up the Chrome browser, send some keys to input elements (eg. '#username') and send clicks to buttons etc.

*mocha* : This is the testing framework for TDD. We need it to describe and execute tests.

*chai* : This is our assertion library. We will execute some code manipulating selenium-webdriver. Selenium will execute these and send us the result. We will check if this result matches our result with `chai`. Chai will signal `mocha` if the tests passed or failed.

*chai-as-expected* : Chai is not pretty good for asyncronous requests. You might be thinking that reading a value from a DOM element is not asyncronous. For example $('#username') in jQuery is syncronous but the similar request in selenium-webdriver is not syncronous. Webdriver returns a promise, not the actual response. This plugin will help us to use assertion commands on promises.

So let's install these libraries and save as dev dependencies.

```sh
npm install --save-dev chromedriver selenium-webdriver mocha chai chai-as-promised
```

### Sample App

We need a simple web app to execute some tests on. I don't want to setup a whole React App that will install lots of dependencies. I'll create the simples express.js app using node.

```sh
npm install --save express
```


and create below application. The application starts with login page. When you enter your username and password (there is no verification for the sake of simplicity) it will take you to the main page. 

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
    <form action="/main">
      username: <input type="text" id="username" /><br />
      password: <input type="text" id="password" />
      <input id="btn" type="submit" />
    </form>
    </html>
  `);
});

app.get('/main', (req, res) => {
  res.send(`
    <html>
    <title>
      My awesome page
    </title>
    <body>
    <div id="message">
      Welcome to my page!
    </div>
    </body>
    </html>
  `);
});

app.listen(3003, () => console.log('Example app listening on port 3003!'));
```

Added below to package.json

```json
{
  "scripts": {
    "start": "node index.js",
    "test:e2e": "./node_modules/mocha/bin/mocha e2e/tests.js"
  }
}
```

and run `npm start`

Now we will write our tests. Like express app, our tests are also an node application.

```javascript
const webdriver = require('selenium-webdriver');
const { By, until } = webdriver;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const driver = new webdriver.Builder().forBrowser('chrome').build();

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

```

I want to make sure that I have logged into the system so I can test main page. So before I run any test I am using mocha's `before` function to handle this.

Code is pretty self explanatory. Selenium webdriver works similar to jquery. But it does not return the value or function of a DOM element. It returns a promise. That's why I used chai-as-expected plugin.

Also I want to make sure that my DOM element <div id="message" /> is loaded. So I make Selenium to wait until this element is located in the DOM.

Now ready to do assertion test. Now we've extended `expect` function of chai. So this point is SUPER SUPER important. Notice that we RETURN the `expect` command we do not just execute it as we normally do in our unit tests. If you don't return it. Your testing software will fail, not your test case. 