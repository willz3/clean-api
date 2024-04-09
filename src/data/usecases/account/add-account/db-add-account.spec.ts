import {
	AccountModel,
	AddAccountParams,
	Hasher,
	AddAccountRepository,
	LoadAccountByEmailRepository
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';
import { mockAccountModel, mockAccountParams, throwError } from '@/domain/test';

type SutTypes = {
	sut: DbAddAccount;
	hasherStub: Hasher;
	addAccountRepositoryStub: AddAccountRepository;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
	const hasherStub = makeHasher();
	const addAccountRepositoryStub = makeAddAccountRepository();
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const sut = new DbAddAccount(
		hasherStub,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub
	);

	return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub };
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async loadByEmail(email: string): Promise<AccountModel | null> {
			return null;
		}
	}

	return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add(account: AddAccountParams): Promise<AccountModel> {
			return mockAccountModel();
		}
	}

	return new AddAccountRepositoryStub();
};

const makeHasher = (): Hasher => {
	class HasherStub implements Hasher {
		async hash(value: string): Promise<string> {
			return 'hashed_password';
		}
	}

	return new HasherStub();
};

describe('DbAddAccount Usecase', () => {
	test('Should call Hasher with correct  password', async () => {
		const { sut, hasherStub } = makeSut();
		const hashSpy = jest.spyOn(hasherStub, 'hash');
		await sut.add(mockAccountParams());
		expect(hashSpy).toHaveBeenCalledWith('any_password');
	});

	test('Should throw if hasher throws', async () => {
		const { sut, hasherStub } = makeSut();
		jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError);

		const promise = sut.add(mockAccountParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

		await sut.add(mockAccountParams());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'hashed_password'
		});
	});

	test('Should throw if AddAccountRepository throws', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError);

		const promise = sut.add(mockAccountParams());
		await expect(promise).rejects.toThrow();
	});

	test('Should return an account on success', async () => {
		const { sut } = makeSut();

		const account = await sut.add(mockAccountParams());
		expect(account).toEqual(mockAccountModel());
	});

	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
		await sut.add(mockAccountModel());

		expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
	});

	test('Should return null if LoadAccountByEmailRepository not return null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();

		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockReturnValueOnce(Promise.resolve(mockAccountModel()));

		const account = await sut.add(mockAccountParams());
		expect(account).toEqual(null);
	});
});
