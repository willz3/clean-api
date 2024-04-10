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
	id: 'any_id',
	accountId: 'any_account_id',
	surveyId: 'any_survey_id',
	answer: 'any_answer',
	date: new Date()
});

export { mockSaveSurveyResultParams, mockSurveyResultModel };
