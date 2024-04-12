import { AccountModel } from '@/domain/model/account';

export interface LoadAccountByToken {
	load(accessToken: string, role?: string): Promise<AccountModel | null>;
}
