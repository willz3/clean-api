import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-survey-by-id/db-load-answers-by-survey';
import { throwError } from '@/tests/domain/mock';
import faker from 'faker';
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mock';

type SutTypes = {
	sut: DbLoadAnswersBySurvey;
	loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
	const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy();
	const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy);
	return {
		sut,
		loadAnswersBySurveyRepositorySpy
	};
};

let surveyId: string;

describe('DbLoadAnswersBySurvey', () => {
	beforeEach(() => {
		surveyId = faker.random.uuid();
	});

	test('Should call LoadSurveyByIdRepository', async () => {
		const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
		await sut.loadAnswers(surveyId);
		expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId);
	});

	test('Should return answers on success', async () => {
		const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
		const answers = await sut.loadAnswers(surveyId);
		expect(answers).toEqual([
			loadAnswersBySurveyRepositorySpy.result[0],
			loadAnswersBySurveyRepositorySpy.result[1]
		]);
	});

	test('Should return empty array if LoadSurveyByIdRepository returns an empty array', async () => {
		const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
		loadAnswersBySurveyRepositorySpy.result = [];
		const answers = await sut.loadAnswers(surveyId);
		expect(answers).toEqual([]);
	});

	test('Should throw if LoadSurveyByIdRepository throws', async () => {
		const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
		jest
			.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers')
			.mockImplementationOnce(throwError);
		const promise = sut.loadAnswers(surveyId);
		await expect(promise).rejects.toThrow();
	});
});
