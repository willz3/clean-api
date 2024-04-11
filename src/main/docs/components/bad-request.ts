export const badRequest = {
	400: {
		description: 'Invalid request',
		content: {
			'application/json': {
				schema: {
					$ref: '#/schemas/error'
				}
			}
		}
	}
};
