import {
	AddAccount,
	AddAccountParams,
	AccountModel,
	Hasher,
	AddAccountRepository,
	LoadAccountByEmailRepository
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
	constructor(
		private readonly hasher: Hasher,
		private readonly addAccountRepository: AddAccountRepository,
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
	) {}

	async add(accountData: AddAccountParams): Promise<AccountModel | null> {
		const accountAlradyRegistered = await this.loadAccountByEmailRepository.loadByEmail(
			accountData.email
		);

		if (accountAlradyRegistered) {
			return null;
		}

		const hashedPassword = await this.hasher.hash(accountData.password);
		const account = await this.addAccountRepository.add(
			Object.assign({}, accountData, { password: hashedPassword })
		);

		return account;
	}
}
