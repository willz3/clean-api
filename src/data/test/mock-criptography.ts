import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { HashComparer } from '@/data/protocols/criptography/hash-comparer';
import { Decrypter } from '@/data/protocols/criptography/decrypter';
import { Hasher } from '@/data/protocols/criptography/hasher';

const mockHasherComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare(value: string, hash: string): Promise<boolean> {
			return true;
		}
	}

	return new HashComparerStub();
};

const mockEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(id: string): Promise<string> {
			return 'any_token';
		}
	}

	return new EncrypterStub();
};

const mockDecrypter = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		async decrypt(value: string): Promise<string> {
			return 'any_token';
		}
	}
	return new DecrypterStub();
};

const mockHasher = (): Hasher => {
	class HasherStub implements Hasher {
		async hash(value: string): Promise<string> {
			return 'hashed_password';
		}
	}

	return new HasherStub();
};

export { mockHasher, mockEncrypter, mockDecrypter, mockHasherComparer };
