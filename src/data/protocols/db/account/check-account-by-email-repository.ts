export interface CheckAccountByEmailRepository {
	checkByEmail(
		email: CheckAccountByEmailRepository.Param
	): Promise<CheckAccountByEmailRepository.Result>;
}

export namespace CheckAccountByEmailRepository {
	export type Param = string;
	export type Result = boolean;
}
