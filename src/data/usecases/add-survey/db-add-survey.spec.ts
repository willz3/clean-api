import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols';
import { DbAddSurvey } from './db-add-survey';

describe('DbAddSurvey UseCase', () => {
	test('Should call AddSurveyRepository with correct values', async () => {
		const { sut, addSurveyRepositoryStub } = makeSut();
		const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
		const surveyData = makeFakeSurveyData();
		await sut.add(surveyData);

		expect(addSpy).toHaveBeenCalledWith(surveyData);
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
		add(account: AddSurveyModel): Promise<void> {
			return Promise.resolve();
		}
	}

	return new AddSurveyRepositoryStub();
};

const makeFakeSurveyData = (): AddSurveyModel => ({
	question: 'any_question',
	answers: [
		{
			image: 'any_image',
			answer: 'any_answer'
		}
	]
});
