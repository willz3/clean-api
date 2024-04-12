import { LoadSurveyResultController } from './load-survey-result-controller';
import {
	HttpRequest,
	InvalidParamError,
	LoadSurveyById,
	forbidden
} from './load-survey-result-controller-protocols';
import { mockLoadSurveyById } from '@/presentation/test';

describe('LoadSurveyResult Controller', () => {
	test('Should call LoadSurveyById with correct value', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');
		await sut.handle(makeFakeRequest());
		expect(loadByIdSpy).toHaveBeenCalledWith('any_id');
	});

	test('Should return 403 if LoadSurveyById returns null', async () => {
		const { sut, loadSurveyByIdStub } = makeSut();
		jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
	});

	const makeFakeRequest = (): HttpRequest => ({
		params: {
			surveyId: 'any_id'
		}
	});

	type SutTypes = {
		sut: LoadSurveyResultController;
		loadSurveyByIdStub: LoadSurveyById;
	};

	const makeSut = (): SutTypes => {
		const loadSurveyByIdStub = mockLoadSurveyById();
		const sut = new LoadSurveyResultController(loadSurveyByIdStub);
		return {
			sut,
			loadSurveyByIdStub
		};
	};
});