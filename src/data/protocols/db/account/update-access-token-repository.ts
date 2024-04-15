export interface UpdateAccessTokenRepository {
	updateAccessToken(
		id: string,
		token: string
	): Promise<UpdateAccessTokenRepository.Result>;
}

export namespace UpdateAccessTokenRepository {
	export type Result = void;
}
