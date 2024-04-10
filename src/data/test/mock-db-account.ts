import { mockAccountModel } from '@/domain/test';
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import {
	AddAccountParams,
	AccountModel,
	LoadAccountByEmailRepository
} from '@/data/usecases/account/add-account/db-add-account-protocols';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/infra/db/mongodb/account/account-mongo-repository-protocols';

const mockAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add(account: AddAccountParams): Promise<AccountModel> {
			return mockAccountModel();
		}
	}

	return new AddAccountRepositoryStub();
};

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail(email: string): Promise<AccountModel> {
			return mockAccountModel();
		}
	}

	return new LoadAccountByEmailRepositoryStub();
};

const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
	class LoadAccountByTokenRepository implements LoadAccountByTokenRepository {
		async loadByToken(token: string, role?: string): Promise<AccountModel | null> {
			return mockAccountModel();
		}
	}
	return new LoadAccountByTokenRepository();
};

const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
	class UpdateAccessTokenRepository implements UpdateAccessTokenRepository {
		async updateAccessToken(id: string, token: string): Promise<void> {
			return null;
		}
	}

	return new UpdateAccessTokenRepository();
};

export {
	mockAddAccountRepository,
	mockLoadAccountByEmailRepository,
	mockLoadAccountByTokenRepository,
	mockUpdateAccessTokenRepository
};
