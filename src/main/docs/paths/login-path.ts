export const loginPath = {
	post: {
		tags: ['Login'],
		summary: 'API to authenticate users.',
		requestBody: {
			content: {
				'application/json': {
					schema: {
						$ref: '#/schemas/loginParams'
					}
				}
			}
		},
		responses: {
			200: {
				description: 'Success',
				content: {
					'application/json': {
						schema: {
							$ref: '#/schemas/account'
						}
					}
				}
			}
		}
	}
};
