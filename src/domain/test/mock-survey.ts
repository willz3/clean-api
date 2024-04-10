import { SurveyModel } from '@/domain/model/survey';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

const mockSurveyModel = (): SurveyModel => {
	return {
		id: 'any_id',
		question: 'any_question',
		answers: [
			{
				image: 'any_image',
				answer: 'any_answer'
			}
		],
		date: new Date()
	};
};

const mockSurveyModels = (): SurveyModel[] => {
	return [
		{
			id: 'any_id',
			question: 'any_question',
			answers: [
				{
					image: 'any_image',
					answer: 'any_answer'
				}
			],
			date: new Date()
		},
		{
			id: 'other_id',
			question: 'other_question',
			answers: [
				{
					image: 'other_image',
					answer: 'other_answer'
				}
			],
			date: new Date()
		}
	];
};

const mockAddSurveyParams = (): AddSurveyParams => ({
	question: 'any_question',
	answers: [
		{
			image: 'any_image',
			answer: 'any_answer'
		}
	],
	date: new Date()
});

export { mockSurveyModel, mockSurveyModels, mockAddSurveyParams };
