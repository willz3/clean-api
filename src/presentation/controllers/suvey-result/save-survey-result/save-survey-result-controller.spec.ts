import { SaveSurveyResultController } from './save-survey-result-controller';
import {
	HttpRequest,
	LoadSurveyById,
	SurveyModel,
	InvalidParamError,
	forbidden,
	serverError,
	SaveSurveyResult,
	SurveyResultModel,
	SaveSurveyResultModel
} from './save-survey-result-controller-protocols';
import MockDate from 'mockdate';

describe('SaveSurveyResult Controller', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});
	test('Should call LoadSurveyById with correct values', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
		await sut.handle(makeFakeRequest());
		expect(loadSpy).toHaveBeenCalledWith('any_survey_id');
	});

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
		const result = await sut.handle(makeFakeRequest());
		expect(result).toEqual(forbidden(new InvalidParamError('surveyId')));
	});

	test('Should return 500 on if load survey by id throws', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		jest
			.spyOn(loadSurveyByIdStub, 'loadById')
			.mockReturnValueOnce(Promise.reject(new Error()));
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('Should return 403 if an invalid answer is provided', async () => {
		const { sut } = makeSut();

		const result = await sut.handle({
			params: {
				surveyId: 'any_survey_id'
			},
			body: {
				answer: 'wrong_answer'
			}
		});
		expect(result).toEqual(forbidden(new InvalidParamError('answer')));
	});

	test('Should call SaveSurveyResult with correct values', async () => {
		const { sut, saveSurveyResult } = makeSut();
		const saveSpy = jest.spyOn(saveSurveyResult, 'save');
		await sut.handle(makeFakeRequest());
		expect(saveSpy).toHaveBeenCalledWith({
			surveyId: 'any_survey_id',
			accountId: 'any_account_id',
			date: new Date(),
			answer: 'any_answer'
		});
	});

	const makeFakeRequest = (): HttpRequest => {
		return {
			params: {
				surveyId: 'any_survey_id'
			},
			body: {
				answer: 'any_answer'
			},
			accountId: 'any_account_id'
		};
	};

	type SutTypes = {
		sut: SaveSurveyResultController;
		loadSurveyByIdStub: LoadSurveyById;
		saveSurveyResult: SaveSurveyResult;
	};

	const makeSut = (): SutTypes => {
		const loadSurveyByIdStub = makeLoadSurveyBiIdStub();
		const saveSurveyResult = makeSaveSurveyResultStub();
		const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResult);
		return {
			sut,
			loadSurveyByIdStub,
			saveSurveyResult
		};
	};

	const makeSaveSurveyResultStub = (): SaveSurveyResult => {
		class SaveSurveyResultStub implements SaveSurveyResult {
			async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
				return makeFakeSurveyResult();
			}
		}

		return new SaveSurveyResultStub();
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

	const makeFakeSurveyResult = (): SurveyResultModel => {
		return {
			id: 'valid__id',
			surveyId: 'valid_survey_id',
			accountId: 'valid_account_id',
			answer: 'valid_answer',
			date: new Date()
		};
	};
});
