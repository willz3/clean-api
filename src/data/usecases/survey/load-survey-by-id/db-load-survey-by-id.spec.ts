import { throwError } from '@/domain/test';
import { DbLoadSurveyById } from './db-load-survey-by-id';
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols';
import MockDate from 'mockdate';

describe('DbLoadSurveyById', () => {
	beforeAll(async () => {
		MockDate.set(new Date());
	});

	afterAll(async () => {
		MockDate.reset();
	});

	test('Should call LoadSurveysRepository', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
		await sut.loadById('any_id');
		expect(loadSpy).toHaveBeenCalled();
	});

	test('Should return a SurveyModel on success', async () => {
		const { sut } = makeSut();
		const result = await sut.loadById('any_id');
		expect(result).toEqual(makeFakeSurvey());
	});

	test('Should throw if repository throws', async () => {
		const { sut, loadSurveyByIdRepositoryStub } = makeSut();

		jest
			.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
			.mockImplementationOnce(throwError);

		const promise = sut.loadById('any_id');
		await expect(promise).rejects.toThrow();
	});

	type SutTypes = {
		sut: DbLoadSurveyById;
		loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
	};

	const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
		class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
			loadById(): Promise<SurveyModel | null> {
				return Promise.resolve(makeFakeSurvey());
			}
		}

		return new LoadSurveyByIdRepositoryStub();
	};

	const makeSut = (): SutTypes => {
		const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub();
		const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);
		return {
			sut,
			loadSurveyByIdRepositoryStub
		};
	};

	const makeFakeSurvey = (): SurveyModel => {
		return {
			id: 'any_id',
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
