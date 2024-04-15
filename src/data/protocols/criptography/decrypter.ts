export interface Decrypter {
	decrypt(ciphertext: Decrypter.Param): Promise<Decrypter.Result>;
}

export namespace Decrypter {
	export type Param = string;
	export type Result = string | null;
}
