const nodemailer = require("nodemailer");

const TEMPLATES = {
  CONTACT:
    "<h1>Helpet Contact</h1><h2>from [[fullName]] <[[email]]></h2>[[message]]"
};

const TRANSPORTER = {
  host: "smtp.googlemail.com", // Gmail Host
  port: 465, // Port
  secure: true, // this is true as port is 465
  auth: {
    user: "helpet.codenity@gmail.com",
    pass: process.env.EMAIL_PASS
  }
};

const sendEmailToAdmins = async (req, res, options) => {
  try {
    const { fullName, email, message } = req.body;
    const transporter = nodemailer.createTransport(TRANSPORTER);

    const mailOptions = {
      from: '"Helpet" <helpet.codenity@gmail.com>',
      to: process.env.EMAIL_ADMINS, // Recepient email address. Multiple emails can send separated by commas
      subject: options.subject,
      html: TEMPLATES[options.template]
        .replace("[[fullName]]", fullName)
        .replace("[[email]]", email)
        .replace("[[message]]", message)
    };

    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.json({ sent: false });
      console.log("Message sent: %s", info.messageId);
      return res.json({ sent: true });
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const sendContactEmail = async (req, res) => {
  const { fullName, email, message } = req.body;
  const options = {
    subject: `Contact from ${fullName} <${email}> - Helpet`,
    message,
    template: "CONTACT"
  };
  sendEmailToAdmins(req, res, options);
};

module.exports = {
  sendContactEmail
};
