const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./database');
const port = 3000;

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'API para manipular informações de currículo' });
});

app.get('/curriculos', db.getCurriculos);
app.get('/curriculos/pessoa/:nome', db.getCurriculoByNome);
app.post('/curriculos', db.createCurriculo);
app.put('/curriculos/:id', db.updateCurriculo);
app.delete('/curriculos/:id', db.deleteCurriculo);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
  }
);