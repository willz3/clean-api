import jwt from 'jsonwebtoken';
import { Encrypter } from '@/data/protocols/criptography/encrypter';
import { Decrypter } from '@/data/protocols/criptography/decrypter';

export class JwtAdapter implements Encrypter, Decrypter {
	constructor(private readonly secret: string) {}

	async decrypt(token: string): Promise<string> {
		return jwt.verify(token, this.secret) as any;
	}

	async encrypt(value: string): Promise<string> {
		return await jwt.sign({ id: value }, this.secret);
	}
}
