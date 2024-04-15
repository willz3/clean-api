export interface LogErrorRepository {
	logError(stack: LogErrorRepository.Param): Promise<LogErrorRepository.Result>;
}

export namespace LogErrorRepository {
	export type Param = string;
	export type Result = void;
}
