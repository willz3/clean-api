import { SurveyModel } from '@/domain/model/survey';
import { AddSurvey } from '@/domain/usecases/survey/add-survey';
import faker from 'faker';

export const mockSurveyModel = (): SurveyModel => {
	return {
		id: faker.random.uuid(),
		question: faker.random.words(),
		answers: [
			{
				answer: faker.random.word()
			},
			{
				answer: faker.random.word(),
				image: faker.image.imageUrl()
			}
		],
		date: faker.date.recent()
	};
};

export const mockSurveyModels = (): Array<SurveyModel> => [
	mockSurveyModel(),
	mockSurveyModel()
];

export const mockAddSurveyParams = (): AddSurvey.Params => ({
	question: faker.random.words(),
	answers: [
		{
			image: faker.image.imageUrl(),
			answer: faker.random.word()
		},
		{
			answer: faker.random.word()
		}
	],
	date: faker.date.recent()
});
