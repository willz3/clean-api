import {
	SaveSurveyResultParams,
	SurveyResultModel
} from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
	accountId: 'any_account_id',
	surveyId: 'any_survey_id',
	answer: 'any_answer',
	date: new Date()
});

const mockSurveyResultModel = (): SurveyResultModel => ({
	question: 'any_question',
	surveyId: 'any_survey_id',
	answers: [
		{
			answer: 'any_answer',
			count: 1,
			percent: 50
		},
		{
			answer: 'other_answer',
			count: 10,
			percent: 80,
			image: 'any_image'
		}
	],
	date: new Date()
});

export { mockSaveSurveyResultParams, mockSurveyResultModel };
