const API_URL = 'http://localhost:3000/tarefas';

document.getElementById('filtro').value = sessionStorage.getItem('filtro') || 'todas';
document.getElementById('filtro').addEventListener('change', () => {
  sessionStorage.setItem('filtro', document.getElementById('filtro').value);
  listarTarefas();
});

async function adicionarTarefa() {
  const titulo = document.getElementById('titulo').value;
  const descricao = document.getElementById('descricao').value;

  const tarefa = { titulo, descricao, concluida: false };

  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas.push(tarefa);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tarefa)
  });

  listarTarefas();
}

async function listarTarefas() {
  let tarefas = JSON.parse(localStorage.getItem('tarefas'));

  if (!tarefas || tarefas.length === 0) {
    const resposta = await fetch(API_URL);
    tarefas = await resposta.json();
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  const filtro = sessionStorage.getItem('filtro') || 'todas';
  const tarefasFiltradas = tarefas.filter(t => {
    if (filtro === 'pendentes') return !t.concluida;
    if (filtro === 'concluidas') return t.concluida;
    return true;
  });

  const ul = document.getElementById('lista-tarefas');
  ul.innerHTML = '';
  tarefasFiltradas.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${t.titulo}</strong> - ${t.descricao} 
      [${t.concluida ? '✔️' : '❌'}]
      <button onclick="marcarConcluida(${i})">Concluir</button>
      <button onclick="excluirTarefa(${i})">Excluir</button>
    `;
    ul.appendChild(li);
  });
}

async function marcarConcluida(index) {
  let tarefas = JSON.parse(localStorage.getItem('tarefas'));
  tarefas[index].concluida = true;
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  await fetch(`${API_URL}/${tarefas[index]._id}/concluir`, { method: 'PATCH' });
  listarTarefas();
}

async function excluirTarefa(index) {
  let tarefas = JSON.parse(localStorage.getItem('tarefas'));
  const id = tarefas[index]._id;
  tarefas.splice(index, 1);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  listarTarefas();
}

listarTarefas();