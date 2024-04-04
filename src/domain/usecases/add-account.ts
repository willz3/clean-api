import { AccountModel } from '@/domain/model/account';

export type AddAccountModel = {
	name: string;
	email: string;
	password: string;
};

export interface AddAccount {
	add(account: AddAccountModel): Promise<AccountModel | null>;
}
