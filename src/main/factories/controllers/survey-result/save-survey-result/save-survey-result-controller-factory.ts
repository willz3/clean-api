import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/db-add-survey-factory';
import { makeDbLoadAnswersBySurvey } from '@/main/factories/usecases/survey-result/db-load-answers-by-survey-factory';
import { SaveSurveyResultController } from '@/presentation/controllers/suvey-result/save-survey-result/save-survey-result-controller';
import { Controller } from '@/presentation/protocols';

export const makeSaveSurveyResultController = (): Controller => {
	const controller = new SaveSurveyResultController(
		makeDbLoadAnswersBySurvey(),
		makeDbSaveSurveyResult()
	);

	return makeLogControllerDecorator(controller);
};
