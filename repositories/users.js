const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends Repository{
	async comparePasswords(saved,supplied){

		const [hashed,salt] = saved.split('.');

		const suppliedHash = await scrypt(supplied,salt,64);

		return hashed === suppliedHash.toString('hex');
	}

	async create(attr) {
		attr.id = this.randomId();

		const users = await this.getAll();

		const salt = crypto.randomBytes(8).toString('hex');

		const buffer = await scrypt(attr.password,salt,64)

		const record = {
			...attr,
			password:`${buffer.toString('hex')}.${salt}`
		}

		users.push(record);

		await this.writeAll(users);

		return record;
	}

}

module.exports = new usersRepository('users.json');
