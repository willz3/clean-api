import { AccountModel } from '@/domain/model/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';

const mockAccountModel = (): AccountModel => {
	return {
		id: 'any_id',
		name: 'any_name',
		email: 'any_email@mail.com',
		password: 'hashed_password'
	};
};

const mockAccountParams = (): AddAccountParams => {
	return {
		name: 'any_name',
		email: 'any_email@mail.com',
		password: 'any_password'
	};
};

export { mockAccountModel, mockAccountParams };
