import { AddAccount } from '@/domain/usecases/account/add-account';
import { Authentication } from '@/domain/usecases/account/authentication';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import faker from 'faker';

export class AddAccountSpy implements AddAccount {
	result = true;
	addAccountParams: AddAccount.Params;

	async add(account: AddAccount.Params): Promise<AddAccount.Result> {
		this.addAccountParams = account;
		return this.result;
	}
}

export class AuthenticationSpy implements Authentication {
	authenticationParams: Authentication.Params;
	authenticationModel = {
		accessToken: faker.random.uuid(),
		name: faker.name.findName()
	};

	async auth(
		authenticationParams: Authentication.Params
	): Promise<Authentication.Result> {
		this.authenticationParams = authenticationParams;
		return Promise.resolve(this.authenticationModel);
	}
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
	accessToken: string;
	role: string;
	result = {
		id: faker.random.uuid()
	};

	async load(accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
		this.accessToken = accessToken;
		this.role = role;
		return this.result;
	}
}
