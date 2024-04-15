import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';

export class LogErrorRepositorySpy implements LogErrorRepository {
	stack: string;

	async logError(stack: LogErrorRepository.Param): Promise<LogErrorRepository.Result> {
		this.stack = stack;
		return Promise.resolve();
	}
}
