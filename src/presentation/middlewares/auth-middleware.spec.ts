import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';
import { AuthMiddleware } from './auth-middleware';
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token';
import { AccountModel } from '../../domain/model/account';
import { HttpRequest } from '../protocols';

describe('Auth middleware', () => {
	it('Should return 403 if no x-access-token exists in headers', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	it('Should call LoadAccountByToken with correct accessToken', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

		await sut.handle(makeFakeRequest());

		expect(loadSpy).toHaveBeenCalledWith('any_token');
	});
});

type SutTypes = {
	sut: AuthMiddleware;
	loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (): SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByTokenStub();
	const sut = new AuthMiddleware(loadAccountByTokenStub);
	return {
		sut,
		loadAccountByTokenStub
	};
};

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

const makeFakeRequest = (): HttpRequest => {
	return {
		headers: {
			'x-access-token': 'any_token'
		}
	};
};
