import { Hasher } from '@/data/protocols/criptography/hasher';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { Decrypter } from '@/data/protocols/criptography/decrypter';
import faker from 'faker';

export class HasherSpy implements Hasher {
	digest = faker.random.uuid();
	plaintext: string;

	async hash(plaintext: Hasher.Param): Promise<Hasher.Result> {
		this.plaintext = plaintext;
		return Promise.resolve(this.digest);
	}
}

export class HashComparerSpy implements HashComparer {
	plaintext: string;
	digest: string;
	isValid = true;

	async compare(plaintext: string, digest: string): Promise<HashComparer.Result> {
		this.plaintext = plaintext;
		this.digest = digest;
		return Promise.resolve(this.isValid);
	}
}

export class EncrypterSpy implements Encrypter {
	ciphertext = faker.random.uuid();
	plaintext: string;

	async encrypt(plaintext: Encrypter.Param): Promise<Encrypter.Result> {
		this.plaintext = plaintext;
		return Promise.resolve(this.ciphertext);
	}
}

export class DecrypterSpy implements Decrypter {
	plaintext = faker.internet.password();
	ciphertext: string;

	async decrypt(ciphertext: Decrypter.Param): Promise<Decrypter.Result> {
		this.ciphertext = ciphertext;
		return Promise.resolve(this.plaintext);
	}
}
