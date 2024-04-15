import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';

import { mockAccountModel } from '@/tests/domain/mock';

export class AddAccountRepositorySpy implements AddAccountRepository {
	accountModel = mockAccountModel();
	addAccountParams: AddAccountRepository.Params;

	async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
		this.addAccountParams = data;
		return this.accountModel;
	}
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
	accountModel = mockAccountModel();
	email: string;

	async loadByEmail(
		email: LoadAccountByEmailRepository.Param
	): Promise<LoadAccountByEmailRepository.Result> {
		this.email = email;
		return this.accountModel;
	}
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
	accountModel = mockAccountModel();
	token: string;
	role: string;

	async loadByToken(
		token: string,
		role?: string
	): Promise<LoadAccountByTokenRepository.Result> {
		this.token = token;
		this.role = role;
		return this.accountModel;
	}
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
	id: string;
	token: string;

	async updateAccessToken(
		id: string,
		token: string
	): Promise<UpdateAccessTokenRepository.Result> {
		this.id = id;
		this.token = token;
		return undefined;
	}
}
