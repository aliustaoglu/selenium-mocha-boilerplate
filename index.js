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
