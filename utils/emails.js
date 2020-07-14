const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlTotext = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Azeem Haider <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.E_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.E_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //render html based on pug temp
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // mail options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlTotext.fromString(html),
    };
    //create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natrous Family!');
  }

  async sendPasswordResetToken() {
    await this.send(
      'passwordreset',
      'Your Password Reset Token(only valid for 10 minutes)'
    );
  }
};
