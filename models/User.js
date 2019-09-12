const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email:{
        type: String,
        unique: true,
        required: true
    },
    profile: {
        type: String,
        default: "https://i2.wp.com/drogaspoliticacultura.net/wp-content/uploads/2017/09/placeholder-user.jpg"
    },
    isVerified: {
		  type: Boolean,
		  default: false
    },
    token: {
        type: String,
        default: "secret"
    },
    phone: {
        type: String
    },
    accessToken: {
        type: String
    },
    password: String,
    firebaseToken: String
})

const generateHash = function (password) {
    const salt = bcrypt.genSaltSync(saltRounds);
	return bcrypt.hashSync(password, salt);
}

userSchema.pre('save', function(next) {
    if (this.password) {
    	this.password = generateHash(this.password);
    }
	next();
});

userSchema.statics.findOrCreate = async function (args, filter) {
    try {
        let user = await this.findOne(filter);
        if (!user) {
            user = await this.create(args);
        }
        return user;
    } catch (error) {
        console.log(error);        
    }
}

userSchema.statics.generateHash = generateHash;

userSchema.statics.login = async function (email, password) { 

    const user = await this.findOne({ email }).exec();
    if (!user) { 
        return null;
    }

    const comp = bcrypt.compareSync(password, user.password);
    if (comp) {
        delete user.password;
        user.logged = comp;
        return user;
    }
}

module.exports = mongoose.model('User',userSchema);