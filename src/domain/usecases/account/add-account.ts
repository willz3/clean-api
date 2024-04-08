import { AccountModel } from '@/domain/model/account';

export type AddAccountModel = Omit<AccountModel, 'id'>;

export interface AddAccount {
	add(account: AddAccountModel): Promise<AccountModel | null>;
}
