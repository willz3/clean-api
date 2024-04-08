import { AccountModel } from '@/domain/model/account';
import { AddAccountModel } from '@/domain/usecases/account/add-account';

export interface AddAccountRepository {
	add(account: AddAccountModel): Promise<AccountModel>;
}
