import { SurveyResultModel } from '@/domain/model/survey-result';

type SaveSurveyResultParams = {
	surveyId: string;
	accountId: string;
	answer: string;
	date: Date;
};

interface SaveSurveyResult {
	save(data: SaveSurveyResultParams): Promise<SurveyResultModel>;
}

export { SaveSurveyResultParams, SaveSurveyResult };
