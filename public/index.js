const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typingStatus = document.getElementById('typing_status');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	if (input.value) {
		socket.emit('chat message', input.value);
		input.value = '';
	}
});

socket.on('chat_message_to_all_users', (msg) => {
	const item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

input.addEventListener('keydown', () => {
	socket.emit('typing', 'typing...');
});

socket.on('typing_status', (msg) => {
	typingStatus.textContent = msg;
});

input.addEventListener('keyup', () => {
	socket.emit('stop_typing', '');
});

socket.on('typing_off', (msg) => {
	typingStatus.textContent = msg;
});
