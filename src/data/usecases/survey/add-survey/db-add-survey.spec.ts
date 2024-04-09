import { AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols';
import { DbAddSurvey } from './db-add-survey';
import MockDate from 'mockdate';
import { throwError } from '@/domain/test';

describe('DbAddSurvey UseCase', () => {
	beforeAll(() => {
		MockDate.set(new Date());
	});

	afterAll(() => {
		MockDate.reset();
	});

	test('Should call AddSurveyRepository with correct values', async () => {
		const { sut, addSurveyRepositoryStub } = makeSut();
		const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
		const surveyData = makeFakeSurveyData();
		await sut.add(surveyData);

		expect(addSpy).toHaveBeenCalledWith(surveyData);
	});

	test('Should throw if AddSurveyRepository throws', async () => {
		const { sut, addSurveyRepositoryStub } = makeSut();
		jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError);

		expect(sut.add(makeFakeSurveyData())).rejects.toThrow();
	});
});

type SutTypes = {
	sut: DbAddSurvey;
	addSurveyRepositoryStub: AddSurveyRepository;
};

const makeSut = (): SutTypes => {
	const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();
	const sut = new DbAddSurvey(addSurveyRepositoryStub);
	return {
		sut,
		addSurveyRepositoryStub
	};
};

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
	class AddSurveyRepositoryStub implements AddSurveyRepository {
		add(account: AddSurveyParams): Promise<void> {
			return Promise.resolve();
		}
	}

	return new AddSurveyRepositoryStub();
};

const makeFakeSurveyData = (): AddSurveyParams => ({
	question: 'any_question',
	answers: [
		{
			image: 'any_image',
			answer: 'any_answer'
		}
	],
	date: new Date()
});
