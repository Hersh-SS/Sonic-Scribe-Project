import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import mysql from 'mysql';
import multer from 'multer';
import convertRouter from './convertRoutes.js';
import transcribeRouter from './transcribeRoutes.js';
import http from 'http';
import https from 'https';

const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	console.log(`Method: ${req.method} \t Path: ${req.path}`);
	next();
});

app.use("/convert", convertRouter);
app.use("/transcribe", transcribeRouter);

// MySQL database connection
const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	port: process.env.MYSQL_PORT,
});

// Connect to the database
connection.connect((err) => {
	if (err) {
		console.error('Error connecting to database: ' + err.stack);
		return;
	}
	console.log('Connected to database as id ' + connection.threadId);
});


/*
Endpoint to create a SQL table
Example POST:
{
  "tableName": "music",
  "tableSchema": "id INT AUTO_INCREMENT PRIMARY KEY, xmlFile TEXT, title VARCHAR(255), userId INT, isPublic BOOLEAN"
}
*/
app.post('/create-table', (req, res) => {
	const { tableName, tableSchema } = req.body;

	if (!tableName || !tableSchema) {
		return res.status(400).send('Table name and schema are required');
	}

	// Generate CREATE TABLE statement
	const createTableQuery = `CREATE TABLE ${tableName} (${tableSchema})`;

	// Execute SQL statement
	connection.query(createTableQuery, (err, result) => {
		if (err) {
			console.error('Error creating table:', err);
			return res.status(500).send('Error creating table');
		}
		res.status(200).send('Table created successfully');
	});
});


/*
Create a new music record
Example POST ("id" is auto-generated server side):
{
  "xmlFile": "<xml>...</xml>",
  "title": "4th Song",
  "userId": 234,
  "isPublic": true
}
*/
app.post('/music', (req, res) => {
	const { xmlFile, title, userId, isPublic } = req.body;
	const sql = 'INSERT INTO music (xmlFile, title, userId, isPublic) VALUES (?, ?, ?, ?)';
	connection.query(sql, [xmlFile, title, userId, isPublic], (err, result) => {
		if (err) {
			console.error('Error inserting music record: ' + err);
			res.status(500).send('Error inserting music record');
			return;
		}
		res.status(201).send(result);
	});
});


// Retrieve all music records
app.get('/music', (req, res) => {
	const userId = req.query.userId;
	const searchTerm = req.query.searchTerm;
	const isPublic = Number(req.query.isPublic);
	const limit = Number(req.query.limit); // Default limit is 25
	let sql = 'SELECT * FROM music WHERE title LIKE ?';
	let params = [`%${searchTerm}%`];

	if (userId) {
		sql += ' AND userId = ?';
		params.push(userId);
	}

	if (isPublic) {
		sql += ' AND isPublic = ?';
		params.push(isPublic);
	}

	if (limit) {
		sql += ' LIMIT ?';
		params.push(limit);
	}

	connection.query(sql, params, (err, results) => {
		if (err) {
			console.error('Error retrieving music records: ' + err);
			res.status(500).send('Error retrieving music records');
			return;
		}
		res.json(results);
	});
});

// Get a music record
app.get('/music/:id', (req, res) => {
	const id = Number(req.params.id);
	const sql = 'SELECT * FROM music WHERE id = ?';
	connection.query(sql, [id], (err, result) => {
		if (err) {
			console.error('Error selecting music record: ' + err);
			res.status(500).send('Error selecting music record');
			return;
		}
		res.send(result);
	});
});


/*
Update a music record
Example PUT:
{
  "xmlFile": "<xml>...</xml>",
  "title": "4th Song",
  "userId": 234,
  "isPublic": true
}
*/
app.put('/music/:id', (req, res) => {
	const id = Number(req.params.id); // Extracting song ID from the URL
	const { title, isPublic } = req.body; // Extracting title and isPublic from the request body

	const sql = `UPDATE music SET title = ?, isPublic = ? WHERE id = ?`;
	connection.query(sql, [title, isPublic, id], (err, result) => {
		if (err) {
			console.error('Error updating music record:', err);
			return res.status(500).send('Error updating music record');
		}
		res.send('Music record updated successfully');
	});
});

// Delete a music record
app.delete('/music/:id', (req, res) => {
	const id = req.params.id;
	const sql = 'DELETE FROM music WHERE id = ?';
	connection.query(sql, [id], (err, result) => {
		if (err) {
			console.error('Error deleting music record: ' + err);
			res.status(500).send('Error deleting music record');
			return;
		}
		res.send('Music record deleted successfully');
	});
});

app.post('/upload', upload.single('file'), (req, res) => {
	const { originalname: title } = req.file; // Destructure and rename 'originalname' to 'title'
	let { userId, isPublic } = req.body;
	isPublic = isPublic === 'true' ? 1 : 0; // Convert isPublic to 1 or 0 based on its value

	// Read the file content
	const filePath = req.file.path; // The path to where the file is saved
	const xmlData = fs.readFileSync(filePath);

	// SQL to insert new record into 'music' table
	const sql = 'INSERT INTO music (xmlFile, title, userId, isPublic) VALUES (?, ?, ?, ?)';
	connection.query(sql, [xmlData, title.split(".")[0], userId, isPublic], (err, result) => {
		if (err) {
			console.error('Error inserting music record:', err);
			return res.status(500).send('Error inserting music record');
		}

		fs.unlink(filePath, (err) => {
			if (err) console.error("Error deleting " + filePath + ": " + err);
		});

		res.status(201).send('File uploaded successfully');
	});
});

if(process.env.HTTPS_RUN) {
	const options = {
		cert: fs.readFileSync(process.env.CERT_CERTIFICATE),
		key: fs.readFileSync(process.env.CERT_PRIVATE),
		ca: fs.readFileSync(process.env.CERT_CA_BUNDLE)
	};
	
	https.createServer(options, app).listen(10000, () => {
		console.log('HTTPS server running on port 10000');
	});
}
else {
	app.listen(10000, () => {
		console.log("Server started on port 10000");
	});
}
