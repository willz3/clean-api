import { AccountModel } from '@/domain/model/account';

export interface LoadAccountByEmailRepository {
	loadByEmail(
		email: LoadAccountByEmailRepository.Param
	): Promise<LoadAccountByEmailRepository.Result>;
}

export namespace LoadAccountByEmailRepository {
	export type Param = string;
	export type Result = AccountModel | null;
}
