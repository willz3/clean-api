export const serverError = {
	500: {
		description: 'Server error',
		content: {
			'application/json': {
				schema: {
					$ref: '#/schemas/error'
				}
			}
		}
	}
};
