import { SaveSurveyResultController } from './save-survey-result-controller';
import {
	HttpRequest,
	LoadSurveyById,
	SurveyModel
} from './save-survey-result-controller-protocols';

describe('SaveSurveyResult Controller', () => {
	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
		await sut.handle(makeFakeRequest());
		expect(loadSpy).toHaveBeenCalledWith('any_survey_id');
	});

	const makeFakeRequest = (): HttpRequest => {
		return {
			params: {
				surveyId: 'any_survey_id'
			}
		};
	};

	type SutTypes = {
		sut: SaveSurveyResultController;
		loadSurveyByIdStub: LoadSurveyById;
	};

	const makeSut = (): SutTypes => {
		const loadSurveyByIdStub = makeLoadSurveyBiIdStub();
		const sut = new SaveSurveyResultController(loadSurveyByIdStub);
		return {
			sut,
			loadSurveyByIdStub
		};
	};

	const makeLoadSurveyBiIdStub = (): LoadSurveyById => {
		class LoadSurveyByIdStub implements LoadSurveyById {
			async loadById(id: string): Promise<SurveyModel> {
				return makeFakeSurvey();
			}
		}

		return new LoadSurveyByIdStub();
	};

	const makeFakeSurvey = (): SurveyModel => {
		return {
			id: 'any_survey_id',
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
});
