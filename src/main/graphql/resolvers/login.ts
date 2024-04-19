import { adapterResolver } from '@/main/adapters/apollo-server/apollo-server-resolver-adapter';
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory';
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory';

export default {
	Query: {
		login: async (parent: any, args: any) => adapterResolver(makeLoginController(), args)
	},
	Mutation: {
		signUp: async (parent: any, args: any) =>
			adapterResolver(makeSignUpController(), args)
	}
};
