# End to end testing with Selenium, mocha and chai

```sh
npm install --save-dev chai chai-as-promised mocha selenium-webdriver
```

Created the simplest ever express.js application so we can perform some tests on it

Added below to package.json

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "./node_modules/mocha/bin/mocha e2e/tests.js"
  }
}
```

now ready to do tests

> npm test