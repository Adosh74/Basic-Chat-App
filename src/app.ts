import express, { NextFunction, Request, Response } from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { Server } from 'socket.io';
import { ErrorMiddleware } from '../middleware/error.middleware';
import ErrorHandler from '../utils/ErrorHandler';

const app = express();

app.use(express.static('public'));

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

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
	const err: any = new ErrorHandler(
		`Can't find ${req.originalUrl} on this server!`,
		404
	);
	next(err);
});

app.use(ErrorMiddleware);

export default server;
