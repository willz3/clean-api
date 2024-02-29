import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';
import { AccountModel } from '../../domain/model/account';

describe('Auth middleware', () => {
	it('Should return 403 if no x-access-token exists in headers', async () => {
		const sut = new AuthMiddleware(makeLoadAccountByTokenStub());
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	it('Should call LoadAccountByToken with correct accessToken', async () => {
		const loadAccountByTokenStub = makeLoadAccountByTokenStub();
		const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
		const sut = new AuthMiddleware(loadAccountByTokenStub);
		await sut.handle({
			headers: {
				'x-access-token': 'any_token'
			}
		});

		expect(loadSpy).toHaveBeenCalledWith('any_token');
	});
});

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
	class LoadAccountByTokenStub implements LoadAccountByToken {
		load(accessToken: string, role?: string): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount());
		}
	}
	return new LoadAccountByTokenStub();
};

const makeFakeAccount = (): AccountModel => {
	return {
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email@mail.com',
		password: 'hashed_password'
	};
};
