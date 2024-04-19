import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		surveys: [Survey!]!
	}

	type Survey: {
		id: ID!
		question: String!
		answers: [SurveysAnswer!]!
		date: Date
		didAnswer: Boolean
	}

	type SurveysAnswer = {
		image: String
		answer: String!
	};
`;
