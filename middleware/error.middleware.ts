import { Response, Request, NextFunction } from 'express';

export const ErrorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || 'Internal Server Error';

	return res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
