import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token/load-account-by-token';
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import env from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
	return new DbLoadAccountByToken(
		new JwtAdapter(env.jwtSecret),
		new AccountMongoRepository()
	);
};
