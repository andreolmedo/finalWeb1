const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Conexão com o MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Seu usuário
  password: '12341234',  // Sua senha
  database: 'livros_db'
});

// Verificação de conexão
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para buscar todos os livros
app.get('/api/livros', (req, res) => {
  db.query('SELECT * FROM livros', (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      res.status(500).json({ mensagem: 'Erro ao buscar livros' });
    } else {
      res.json(results);
    }
  });
});

// Endpoint para adicionar um novo livro
app.post('/api/livros', (req, res) => {
  const { titulo, autor, ano } = req.body;

  const sql = 'INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)';
  db.query(sql, [titulo, autor, ano], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar livro:', err);
      res.status(500).json({ mensagem: 'Erro ao adicionar livro' });
    } else {
      res.status(201).json({
        id: result.insertId,
        titulo,
        autor,
        ano
      });
    }
  });
});

// Endpoint para editar um livro
app.put('/api/livros/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, ano } = req.body;

  const sql = 'UPDATE livros SET titulo = ?, autor = ?, ano = ? WHERE id = ?';
  db.query(sql, [titulo, autor, ano, id], (err, result) => {
    if (err) {
      console.error('Erro ao editar livro:', err);
      res.status(500).json({ mensagem: 'Erro ao editar livro' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ mensagem: 'Livro não encontrado' });
      } else {
        res.json({ id, titulo, autor, ano });
      }
    }
  });
});

// Endpoint para excluir um livro
app.delete('/api/livros/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM livros WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar livro:', err);
      res.status(500).json({ mensagem: 'Erro ao deletar livro' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ mensagem: 'Livro não encontrado' });
      } else {
        res.status(204).end();
      }
    }
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
