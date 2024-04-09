import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey-result/load-survey-by-id/load-survey-by-id-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey-result/save-survey-result/db-add-survey-factory';
import { SaveSurveyResultController } from '@/presentation/controllers/suvey-result/save-survey-result/save-survey-result-controller';
import { Controller } from '@/presentation/protocols';

export const makeSaveSurveyResultController = (): Controller => {
	const controller = new SaveSurveyResultController(
		makeDbLoadSurveyById(),
		makeDbSaveSurveyResult()
	);

	return makeLogControllerDecorator(controller);
};
