export const unauthorized = {
	401: {
		description: 'Invalid credentials',
		content: {
			'application/json': {
				schema: {
					$ref: '#/schemas/error'
				}
			}
		}
	}
};
