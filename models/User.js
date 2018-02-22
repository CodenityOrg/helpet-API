const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
})

userSchema.pre('save', function(next) {
	let salt = bcrypt.genSaltSync(saltRounds);
	let hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;
	next();
});

userSchema.statics.login = (email,password) => { 
	return this.findOne({ email }).exec()
		.then((user) => {
			if (!user) { 
                return null;
            }

            return bcrypt.compare(password, user.password)
                    .then((comp)=> {
                        let _user = user._doc;
                        delete _user.password;
                        _user.logged = comp;
                        return _user;
                    });
		});
}