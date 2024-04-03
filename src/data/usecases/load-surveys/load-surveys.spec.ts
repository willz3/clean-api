import { SurveyModel } from '../../../domain/model/survey';
import { DbLoadSurveys } from './load-surveys';
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository';

describe('DbLoadSurveys', () => {
	test('Should call LoadSurveysRepository', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
		await sut.load();
		expect(loadSpy).toHaveBeenCalled();
	});

	test('Should return a list of Surveys on success', async () => {
		const { sut } = makeSut();
		const result = await sut.load();
		expect(result).toEqual(makeFakeSurveys());
	});

	test('Should throw if repository throws', async () => {
		const { sut, loadSurveysRepositoryStub } = makeSut();

		jest
			.spyOn(loadSurveysRepositoryStub, 'loadAll')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

		const promise = sut.load();
		await expect(promise).rejects.toThrow();
	});

	type SutTypes = {
		sut: DbLoadSurveys;
		loadSurveysRepositoryStub: LoadSurveysRepository;
	};

	const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
		class LoadSurveysRepositoryStub implements LoadSurveysRepository {
			loadAll(): Promise<SurveyModel[]> {
				return Promise.resolve(makeFakeSurveys());
			}
		}

		return new LoadSurveysRepositoryStub();
	};

	const makeSut = (): SutTypes => {
		const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub();
		const sut = new DbLoadSurveys(loadSurveysRepositoryStub);
		return {
			sut,
			loadSurveysRepositoryStub
		};
	};

	const makeFakeSurveys = (): SurveyModel[] => {
		return [
			{
				id: 'any_id',
				question: 'any_question',
				answers: [
					{
						image: 'any_image',
						answer: 'any_answer'
					}
				],
				date: new Date()
			},
			{
				id: 'other_id',
				question: 'other_question',
				answers: [
					{
						image: 'other_image',
						answer: 'other_answer'
					}
				],
				date: new Date()
			}
		];
	};
});
