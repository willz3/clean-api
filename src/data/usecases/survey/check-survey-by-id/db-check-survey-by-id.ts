import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository';
import { CheckSurveyById } from './db-check-survey-by-id-protocols';

export class DbCheckSurveyById implements CheckSurveyById {
	constructor(private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}

	async checkById(id: CheckSurveyById.Param): Promise<CheckSurveyById.Result> {
		return this.checkSurveyByIdRepository.checkById(id);
	}
}
