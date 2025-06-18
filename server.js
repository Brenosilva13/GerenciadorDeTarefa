const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost/tarefas_db');

const Tarefa = mongoose.model('Tarefa', {
  titulo: String,
  descricao: String,
  concluida: Boolean
});

app.use(cors());
app.use(express.json());

app.post('/tarefas', async (req, res) => {
  const tarefa = await Tarefa.create(req.body);
  res.json(tarefa);
});

app.get('/tarefas', async (req, res) => {
  const tarefas = await Tarefa.find();
  res.json(tarefas);
});

app.patch('/tarefas/:id/concluir', async (req, res) => {
  await Tarefa.findByIdAndUpdate(req.params.id, { concluida: true });
  res.sendStatus(200);
});

app.delete('/tarefas/:id', async (req, res) => {
  await Tarefa.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
