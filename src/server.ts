import server from './app';

console.log(process.cwd());

server.listen(3001, () => {
	console.log('Server is listening on port 3001');
});
