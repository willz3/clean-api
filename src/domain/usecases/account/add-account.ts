import { AccountModel } from '@/domain/model/account';

export type AddAccountParams = Omit<AccountModel, 'id'>;

export interface AddAccount {
	add(account: AddAccountParams): Promise<AccountModel | null>;
}
