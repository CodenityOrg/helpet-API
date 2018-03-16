const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
    login(req, res) {
        const { email, password } = req.body;
		const error = {}

		User.login(email, password)
			.then((user) => {
				if(!user){
					error.message = "El email ingresado no existe";
					return res.status(401).send(error);
				} 	
				
				if(!user.logged){
					error.message = "La contraseña es incorrecta";
					return res.status(401).send(error);
				}
				
				user.token = jwt.sign(user, config.secret);
				return res.status(200).send(user);
			})
			.catch(() => {
				error.message = "Ocurrio un error, revisar los detalles";
				error.details = err;
				return res.status(503).send(error);
			})
    },
    create(req,res) {
		const data = req.body;
		const error = {};
		const body = {};

		if(!Object.keys(data).length){
			let error = {};
		
			error.message = "Debe indicar los nombres, apellidos y email del usuario. Intentelo de nuevo";
			return res.status(503).send(error);
		}
		delete data.isVerified;

		User.create(data).then((user)=>{
			delete data.password;

			user.token = jwt.sign(user, config.secret);
			return res.json(user);
		})
		.catch((err)=>{
			console.log(err)
			error.message = "No se pudo crear el usuario, intentelo de nuevo"
			return res.status(503).send(error);
		})
	}
}