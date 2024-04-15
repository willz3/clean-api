export interface Encrypter {
	encrypt(plaintext: Encrypter.Param): Promise<string>;
}

export namespace Encrypter {
	export type Param = string;
	export type Result = string;
}
