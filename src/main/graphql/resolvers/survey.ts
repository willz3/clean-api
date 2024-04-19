import { adapterResolver } from '@/main/adapters/apollo-server/apollo-server-resolver-adapter';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory';

export default {
	Query: {
		surveys: async () => adapterResolver(makeLoadSurveysController())
	}
};
