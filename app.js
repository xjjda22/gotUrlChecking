const got = require('got');
const app = require('express')();
const bodyParser = require('body-parser');

const HTTPCode = require('./HTTPResponseCode');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('case sensitive routing', false);
app.disable('x-powered-by');

const { PORT } = process.env;

const request = async (url, options) => {
	try {
		const response = await got(url, options);

		return { response, content: response.body };
	} catch (error) {
		return { error };
	}
};

const processError = async e => {
	try {
		const { response } = e;
		if (!response) throw new Error(e.name);

		// const { url, statusCode: httpCode, headers, body } = response;
		const { statusCode: httpCode } = response;

		throw new Error(httpCode);
	} catch (error) {
		return { error };
	}
};

const processRequest = async (req, res, next) => {
	const options = { method: 'HEAD' };
	const { params } = req;
	const url = params[0];

	const { response, error } = await request(url, options);

	if (!error && response.statusCode === HTTPCode.success.code) {
		res.status(HTTPCode.success.code).send({
			url,
			httpCode: HTTPCode.success.code,
			content_type: response.headers['content-type'],
			content_length: +response.headers['content-length'] || -1
		});
	} else {
		const { error: err } = await processError(error);
		next(err);
	}
};

const logger = (err, req, res, next) => {
	// console.log('logger err->', err.message);

	if (err && err.name === 'UnauthorizedError') {
		// log unauthorized requests
		res.status(HTTPCode.unauthorized.code).end({
			httpCode: HTTPCode.unauthorized.code,
			message: HTTPCode.unauthorized.message
		});
	} else if (err) {
		res.status(HTTPCode.internalServerError.code).send({
			httpCode: HTTPCode.internalServerError.code,
			message: HTTPCode.internalServerError.message
		});
	} else {
		res.status(HTTPCode.methodNotAllowed.code).end({
			httpCode: HTTPCode.methodNotAllowed.code,
			message: HTTPCode.methodNotAllowed.message
		});
	}
};

app.all('/api/*', processRequest);
app.use(logger);

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;
