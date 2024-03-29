/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const config = require("../config");

const tryCatch = async promise => {
  let result;
  let error;
  try {
    result = await promise;
  } catch (err) {
    error = err;
  }
  return { result, error };
};

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    const error = {};

    try {
      const user = await User.login(email, password);
      if (!user) {
        error.message = "El email ingresado no existe";
        return res.status(401).send(error);
      }

      if (!user.logged) {
        error.message = "La contraseña es incorrecta";
        return res.status(401).send(error);
      }

      user.token = jwt.sign(user._id.toString(), config.secret);
      return res.status(200).send(user);
    } catch (err) {
      console.log(err);
      error.message = "Ocurrio un error, revisar los detalles";
      error.details = err;
      return res.status(503).send(error);
    }
  },
  async validToken(req, res) {
    const { token } = req.body;
    try {
      const userId = jwt.verify(token, config.secret);
      const user = await User.findById(userId).exec();
      delete user.password;
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.sendStatus(401);
    }
  },
  /* const user = jwt.verify(token, config.secret);
			const currentUser = await User.findById(user._id).exec();
			console.log(currentUser, user);
			if (!currentUser) {
				return res.sendStatus(401);
			}
			delete currentUser.password;
			return res.json(currentUser); */
  async updateFirebaseToken(req, res) {
    const { user } = req.headers;

    if (user === null) {
      res.sendStatus(422);
      return;
    }

    const userId = user._id;

    try {
      await User.updateOne(
        { _id: userId },
        { receiverId: req.body.receiverId.token }
      );
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  },
  async validate(req, res) {
    try {
      const data = req.body;
      const user = await User.findOne({ email: data.email });
      if (user) {
        data.message = "Email ya existe";
        data.validate = false;
      } else {
        data.message = "Email esta disponible";
        data.validate = true;
      }
      return res.status(200).send(data);
    } catch (e) {
      return res.status(503);
    }
  },
  async create(req, res) {
    try {
      const data = req.body;

      if (!Object.keys(data).length) {
        const error = {};
        error.message =
          "Debe indicar los nombres, apellidos y email del usuario. Intentelo de nuevo";
        return res.status(503).send(error);
      }
      delete data.isVerified;
      const createdUser = await User.create(data);
      delete data.password;
      data.token = jwt.sign(createdUser._id.toString(), config.secret);
      return res.json(data);
    } catch (error) {
      error.message = "No se pudo crear el usuario, intentelo de nuevo";
      console.log(error);
      return res.status(503).send(error);
    }
  },
  async updateProfile(req, res) {
    try {
      const {
        body: data,
        headers: {
          user: { _id }
        }
      } = req;
      delete data.email;
      const userInstance = await User.updateOne({ _id }, data).exec();
      res.json(userInstance);
    } catch (error) {
      console.log(error);
      error.message = "No se pudo actualizar el usuario, revise los detalles";
      res.status(500).send(error);
    }
  },
  async getProfile(req, res) {
    try {
      const fullData = JSON.parse(req.query.full);
      const id = req.headers.user._id;
      const fields = { _id: 1, email: 1, profile: 1, phone: 1, facebook: 1 };
      if (fullData === true) {
        fields.firstName = 1;
        fields.lastName = 1;
      }
      const user = await User.findById(id).select(fields);
      res.json(user);
    } catch (error) {
      error.message = "No se obtener el usuario indicado!";
      res.status(500).send(error);
    }
  },
  async getAProfile(req, res) {
    try {
      const fullData = JSON.parse(req.query.full);
      const { id } = req.params;
      const fields = { _id: 1, email: 1, profile: 1, phone: 1, facebook: 1 };
      if (fullData === true) {
        fields.firstName = 1;
        fields.lastName = 1;
      }
      const user = await User.findById(id).select(fields);
      res.json(user);
    } catch (error) {
      error.message = "No se obtuvo el usuario indicado!";
      res.status(500).send(error);
    }
  },
  async oauthLogin(req, res) {
    // TODO: Implement integration with Google and check oauth type (google or facebook)
    // TODO: Validate facebook access token
    const { first_name, last_name, email, accessToken } = req.body;

    const userParams = {
      firstName: first_name,
      lastName: last_name,
      email,
      accessToken
    };

    const { result: user } = await tryCatch(
      User.findOrCreate(userParams, { email })
    );
    if (!user) {
      return res.status(401).send({
        message: "No se pudo iniciar sesion"
      });
    }
    user.token = jwt.sign(user._id.toString(), config.secret);
    return res.json(user);
  }
};
