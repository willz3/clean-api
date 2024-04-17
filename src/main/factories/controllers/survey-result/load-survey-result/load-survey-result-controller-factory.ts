import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/db-load-survey-result-factory';
import { makeDbCheckSurveyById } from '@/main/factories/usecases/survey-result/db-check-survey-factory';
import { LoadSurveyResultController } from '@/presentation/controllers/suvey-result/load-survey-result/load-survey-result-controller';
import { Controller } from '@/presentation/protocols';

export const makeLoadSurveyResultController = (): Controller => {
	const controller = new LoadSurveyResultController(
		makeDbCheckSurveyById(),
		makeDbLoadSurveyResult()
	);

	return makeLogControllerDecorator(controller);
};
