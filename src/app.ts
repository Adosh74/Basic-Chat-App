import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { Server } from 'socket.io';

const app = express();

app.use(express.static('public'));
// error: efused to execute script from 'http://localhost:3001/templates/index.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.
// solution: https://stackoverflow.com/questions/2871655/proper-mime-type-for-javascript-css-and-html-files

const server = createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});
// base route to ensure server is running
app.get('/xyz', (req, res) => {
	res.send('Server is running✅');
});

// html page
app.get('/', (req, res) => {
	res.sendFile(join(process.cwd(), '/templates/index.html'));
});

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);
	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);

		io.emit('chat_message_to_all_users', msg);
	});

	socket.on('typing', (msg) => {
		socket.broadcast.emit('typing_status', msg);
	});

	socket.on('stop_typing', () => {
		socket.broadcast.emit('typing_off', '');
	});
});

export default server;
