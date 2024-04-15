import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account';
import {
	Authentication,
	AuthenticationParams
} from '@/domain/usecases/account/authentication';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { AccountModel } from '@/domain/model/account';
import { mockAccountModel } from '../../domain/mock';
import faker from 'faker';
import { AuthenticationModel } from '@/domain/model/authentication';

export class AddAccountSpy implements AddAccount {
	accountModel = mockAccountModel();
	addAccountParams: AddAccountParams;

	async add(account: AddAccountParams): Promise<AccountModel> {
		this.addAccountParams = account;
		return Promise.resolve(this.accountModel);
	}
}

export class AuthenticationSpy implements Authentication {
	authenticationParams: AuthenticationParams;
	authenticationModel = {
		accessToken: faker.random.uuid(),
		name: faker.name.findName()
	};

	async auth(authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
		this.authenticationParams = authenticationParams;
		return Promise.resolve(this.authenticationModel);
	}
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
	accountModel = mockAccountModel();
	accessToken: string;
	role: string;

	async load(accessToken: string, role?: string): Promise<AccountModel> {
		this.accessToken = accessToken;
		this.role = role;
		return Promise.resolve(this.accountModel);
	}
}