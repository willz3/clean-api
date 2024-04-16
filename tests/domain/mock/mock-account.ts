import faker from 'faker';
import { AddAccount } from '@/domain/usecases/account/add-account';
import { Authentication } from '@/domain/usecases/account/authentication';

export const mockAddAccountParams = (): AddAccount.Params => ({
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: faker.internet.password()
});

export const mockAuthenticationParams = (): Authentication.Params => ({
	email: faker.internet.email(),
	password: faker.internet.password()
});
