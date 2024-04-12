import { AccountModel } from '@/domain/model/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';

export interface AddAccountRepository {
	add(data: AddAccountParams): Promise<AccountModel>;
}
