export const surveyPath = {
	get: {
		security: [
			{
				apiKeyAuth: []
			}
		],
		tags: ['Survey'],
		summary: 'API to list all surveys.',
		responses: {
			204: {
				description: 'Success',
				content: {
					'application/json': {
						schema: {
							$ref: '#/schemas/surveys'
						}
					}
				}
			},
			403: {
				$ref: '#/components/forbidden'
			},
			404: {
				$ref: '#/components/notFound'
			},
			500: {
				$ref: '#/components/serverError'
			}
		}
	},
	post: {
		security: [
			{
				apiKeyAuth: []
			}
		],
		tags: ['Survey'],
		summary: 'API to create a survey.',
		requestBody: {
			content: {
				'application/json': {
					schema: {
						$ref: '#/schemas/addSurveyParams'
					}
				}
			}
		},
		responses: {
			204: {
				description: 'Success'
			},
			403: {
				$ref: '#/components/forbidden'
			},
			404: {
				$ref: '#/components/notFound'
			},
			500: {
				$ref: '#/components/serverError'
			}
		}
	}
};
