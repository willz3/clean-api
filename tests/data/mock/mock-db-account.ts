import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';

import faker from 'faker';

export class AddAccountRepositorySpy implements AddAccountRepository {
	result = true;
	params: AddAccountRepository.Params;

	async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
		this.params = data;
		return this.result;
	}
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
	result = {
		id: faker.random.uuid(),
		name: faker.name.findName(),
		password: faker.internet.password()
	};

	email: string;

	async loadByEmail(
		email: LoadAccountByEmailRepository.Param
	): Promise<LoadAccountByEmailRepository.Result> {
		this.email = email;
		return this.result;
	}
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
	token: string;
	role: string;
	result = {
		id: faker.random.uuid()
	};

	async loadByToken(
		token: string,
		role?: string
	): Promise<LoadAccountByTokenRepository.Result> {
		this.token = token;
		this.role = role;
		return this.result;
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
