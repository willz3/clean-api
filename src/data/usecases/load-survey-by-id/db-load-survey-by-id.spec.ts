import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@/domain/model/survey';
import MockDate from 'mockdate';
import { DbLoadSurveyById } from './db-load-survey-by-id';

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
