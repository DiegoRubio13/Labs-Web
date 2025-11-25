const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_db'
});

// GET todos los productos
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(data);
    });
});

// GET un producto
app.get('/api/productos/:id', (req, res) => {
    db.query('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        if (data.length === 0) return res.status(404).json({ error: 'no encontrado' });
        res.json(data[0]);
    });
});

// POST crear producto
app.post('/api/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
        [nombre, precio, stock], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, precio, stock });
    });
});

// PUT actualizar producto
app.put('/api/productos/:id', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
        [nombre, precio, stock, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'no encontrado' });
        res.json({ mensaje: 'actualizado' });
    });
});

// DELETE eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'no encontrado' });
        res.json({ mensaje: 'eliminado' });
    });
});

app.listen(3000, () => console.log('API corriendo en puerto 3000'));
