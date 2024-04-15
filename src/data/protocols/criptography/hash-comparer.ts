export interface HashComparer {
	compare(plaintext: string, digest: string): Promise<HashComparer.Result>;
}

export namespace HashComparer {
	export type Result = boolean;
}
