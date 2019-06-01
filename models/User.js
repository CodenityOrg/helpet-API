const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email:{
      type: String,
      unique:true,
      required:true
    },
    profile: {
        type: String,
        default: "https://i2.wp.com/drogaspoliticacultura.net/wp-content/uploads/2017/09/placeholder-user.jpg"
    },
    isVerified: {
		  type: Boolean,
		  default:false
    },
    token: {
		  type:String,
		  default: "secret"
    },
    phone: {
        type: String
    },
    facebook: {
        type: String
    },
    password: String,
    firebaseToken: String
})

userSchema.pre('save', function(next) {
	let salt = bcrypt.genSaltSync(saltRounds);
	let hash = bcrypt.hashSync(this.password, salt);
	this.password = hash;
	next();
});

userSchema.statics.login = async function (email,password) { 

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