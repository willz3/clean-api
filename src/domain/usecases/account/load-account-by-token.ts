import { AccountModel } from '@/domain/model/account';

export interface LoadAccountByToken {
	loadByToken(accessToken: string, role?: string): Promise<AccountModel | null>;
}
