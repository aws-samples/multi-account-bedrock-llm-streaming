const util = require('util');
const stream = require('stream');
const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);

const {
	BedrockRuntimeClient,
	InvokeModelWithResponseStreamCommand,
} = require('@aws-sdk/client-bedrock-runtime'); // ES Modules import

const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

function parseBase64(message) {
	return JSON.parse(Buffer.from(message, 'base64').toString('utf-8'));
}

exports.handler = awslambda.streamifyResponse(
	async (event, responseStream, _context) => {

		const params = {
			modelId: event.modelId,
			contentType: 'application/json',
			accept: 'application/json',
			body: JSON.stringify(event.body),
		};

		console.log(params);

		const command = new InvokeModelWithResponseStreamCommand(params);

		const response = await bedrock.send(command);

		const chunks = [];

		for await (const chunk of response.body) {
			if (chunk.chunk && chunk.chunk.bytes) {
				const parsed = parseBase64(chunk.chunk.bytes);
				console.log(parsed);

				if (parsed.type === 'content_block_delta') {
					if (parsed.delta && parsed.delta.text) {
						const text = parsed.delta.text;
						chunks.push(text);
						responseStream.write(text);
					}
					else {
						console.log('Delta text is missing');
					}
				}
				else if (parsed.type === 'message_delta') {
					console.log('Received message_delta:', parsed);
					// Handle message_delta if needed
				}
				else {
					console.log('Unknown parsed type:', parsed.type);
				}
			}
			else {
				console.log('Chunk data is missing or incomplete');
			}
		}


		console.log(chunks.join(''));
		responseStream.end();
	}
);
