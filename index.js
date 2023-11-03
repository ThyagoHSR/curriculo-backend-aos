const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./database'); // Certifique-se de que seu módulo db esteja configurado corretamente
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

// Rota para exibir um currículo com base no ID
app.get('/curriculos/:id', (request, response) => {
  const id = request.params.id;

  // Chame a função 'getCurriculoById' do módulo 'db' para obter o currículo pelo ID
  const curriculo = db.getCurriculoById(id);

  if (curriculo) {
    response.json(curriculo);
  } else {
    response.status(404).json({ error: 'Currículo não encontrado' });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
