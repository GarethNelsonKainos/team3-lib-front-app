const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

nunjucks.configure(['views', 'node_modules/govuk-frontend/dist'], {
  autoescape: true,
  express: app,
  watch: false
});

app.set('view engine', 'njk');

app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk-frontend.min.css', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css')));
app.use('/govuk-frontend.min.js', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('dashboard', { pageName: 'Dashboard', currentPage: 'dashboard' });
});

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
