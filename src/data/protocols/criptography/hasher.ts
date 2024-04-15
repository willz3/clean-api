export interface Hasher {
	hash(plaintext: Hasher.Param): Promise<Hasher.Result>;
}

export namespace Hasher {
	export type Param = string;
	export type Result = string;
}
