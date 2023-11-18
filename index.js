const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./curriculo-firebase-aos-firebase-adminsdk-ms8g6-c7d93bb924.json');
const db = require('./database'); // Importe as funções do database.js

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://curriculo-firebase-aos.firebaseio.com',
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para verificar a autenticação
const isAuthenticated = (request, response, next) => {
  const idToken = request.header('Authorization');

  if (!idToken) {
    return response.status(401).json({ error: 'Não autorizado' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      request.user = decodedToken;
      next();
    })
    .catch(() => {
      return response.status(401).json({ error: 'Não autorizado' });
    });
};

// Rotas públicas
app.get('/', (request, response) => {
  response.json({ info: 'API para manipular informações de currículo' });
});

// Rota de login usando Firebase Authentication (E-mail/senha)
app.post('/login', async (request, response) => {
  const { email, password } = request.body;

  try {
    const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
    const idToken = await userCredential.user.getIdToken();
    response.json({ idToken });
  } catch (error) {
    response.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rotas protegidas
app.use(isAuthenticated);

app.get('/curriculos', db.getCurriculos);
app.get('/curriculos/pessoa/:nome', db.getCurriculoByNome);
app.post('/curriculos', db.createCurriculo);
app.put('/curriculos/:id', db.updateCurriculo);
app.delete('/curriculos/:id', db.deleteCurriculo);

// Rota protegida para exibir um currículo com base no ID
app.get('/curriculos/:id', (request, response) => {
  const id = request.params.id;
  const curriculo = db.getCurriculoById(id); // Certifique-se de que essa função está implementada em database.js

  if (curriculo) {
    response.json(curriculo);
  } else {
    response.status(404).json({ error: 'Currículo não encontrado' });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
