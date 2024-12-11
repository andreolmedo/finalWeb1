const scrollDownBtn = document.getElementById('scrollDownBtn');
const cadastroSection = document.getElementById('cadastro');

// Função para rolar suavemente para a seção de cadastro
scrollDownBtn.addEventListener('click', () => {
  cadastroSection.scrollIntoView({ behavior: 'smooth' });
});

const formularioLivro = document.getElementById('formulario-livro');
const listaLivros = document.getElementById('lista-livros');

// Função para buscar livros
async function buscarLivros() {
  const response = await fetch('/api/livros');
  const livros = await response.json();

  listaLivros.innerHTML = '';
  livros.forEach((livro) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${livro.titulo} de ${livro.autor} (${livro.ano})</span>
      <div>
        <button class="editar" onclick="editarLivro(${livro.id})">Editar</button>
        <button class="deletar" onclick="deletarLivro(${livro.id})">Deletar</button>
      </div>
    `;
    listaLivros.appendChild(li);
  });
}

// Função para adicionar livro
async function adicionarLivro(livro) {
  const response = await fetch('/api/livros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(livro),
  });

  if (response.ok) {
    buscarLivros();
  } else {
    console.error('Erro ao adicionar livro');
  }
}

// Função para deletar livro
async function deletarLivro(id) {
  await fetch(`/api/livros/${id}`, { method: 'DELETE' });
  buscarLivros();
}

let livroEditando = null;

// Função para editar livro
async function editarLivro(id) {
  const response = await fetch('/api/livros');
  const livros = await response.json();
  const livro = livros.find((b) => b.id === id);

  if (livro) {
    document.getElementById('titulo').value = livro.titulo;
    document.getElementById('autor').value = livro.autor;
    document.getElementById('ano').value = livro.ano;
    livroEditando = id;
  }
}

// Evento de submit do formulário
formularioLivro.addEventListener('submit', async (e) => {
  e.preventDefault();

  const livro = {
    titulo: document.getElementById('titulo').value,
    autor: document.getElementById('autor').value,
    ano: document.getElementById('ano').value,
  };

  if (livroEditando) {
    await fetch(`/api/livros/${livroEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    });
    livroEditando = null;
  } else {
    await adicionarLivro(livro);
  }

  formularioLivro.reset();
  buscarLivros();
});

// Chama a função para buscar livros ao iniciar
buscarLivros();
