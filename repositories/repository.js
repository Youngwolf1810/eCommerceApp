const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository{
    constructor(filename) {
		if (!filename) throw new Error('File needed for creating repository.');

		this.filename = filename;

		try {
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf-8' }));
	}

	async create(attrs){
        attrs.id = this.randomId();

        const items = await this.getAll();

        items.push(attrs);

        await this.writeAll(items);

        return attrs;
    }
	async writeAll(users) {
		await fs.promises.writeFile(this.filename, JSON.stringify(users,null,2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async findById(id) {
		const users = await this.getAll();

		return users.find((user) => user.id === id);
	}

	async deleteById(id){
		const users = await this.getAll();

		const newUsers =  users.filter( user => user.id !== id);

		await this.writeAll(newUsers);
	}

	async update(id,attrs){
		const users = await this.getAll();

		const user = users.find( user => user.id===id);

		if(!user){
			throw new error(`user with id ${id} not found :( `);
		}
		Object.assign(user,attrs);

		await this.writeAll(users);
	}

	async getByOne(filters){
		const users = await this.getAll();

		for(let user of users){
			let found = true;

			for(let key in filters){
				if(user[key]!=filters[key]) found = false;
			}

			if(found) return user;
		}
	}


}