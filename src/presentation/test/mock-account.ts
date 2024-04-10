import { AccountModel } from '@/domain/model/account';
import { mockAccountModel } from '@/domain/test';
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account';
import {
	Authentication,
	AuthenticationParams
} from '@/domain/usecases/account/authentication';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';

const mockAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountParams): Promise<AccountModel> {
			return new Promise((resolve) => resolve(mockAccountModel()));
		}
	}

	return new AddAccountStub();
};

const mockAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(authentication: AuthenticationParams): Promise<string> {
			return Promise.resolve('any_token');
		}
	}

	return new AuthenticationStub();
};

const mockLoadAccountByToken = (): LoadAccountByToken => {
	class LoadAccountByToken implements LoadAccountByToken {
		loadByToken(accessToken: string, role?: string): Promise<AccountModel | null> {
			return Promise.resolve(mockAccountModel());
		}
	}
	return new LoadAccountByToken();
};

export { mockAddAccount, mockAuthentication, mockLoadAccountByToken };
