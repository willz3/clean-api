export const surveyResultPath = {
	put: {
		security: [
			{
				apiKeyAuth: []
			}
		],
		tags: ['Survey'],
		summary: 'API to create the result of a survey.',
		parameters: [
			{
				in: 'path',
				name: 'surveyId',
				required: true,
				schema: {
					type: 'string'
				}
			}
		],
		requestBody: {
			content: {
				'application/json': {
					schema: {
						$ref: '#/schemas/saveSurveyParams'
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
							$ref: '#/schemas/surveyResult'
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
	get: {
		security: [
			{
				apiKeyAuth: []
			}
		],
		tags: ['Survey'],
		summary: 'API to consult a result of a survey',
		description: 'This route only can be access by authenticate users.',
		parameters: [
			{
				in: 'path',
				name: 'surveyId',
				description: 'Survey of id that has been answered',
				required: true,
				schema: {
					type: 'string'
				}
			}
		],
		responses: {
			200: {
				description: 'Success',
				content: {
					'application/json': {
						schema: {
							$ref: '#/schemas/surveyResult'
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
	}
};
