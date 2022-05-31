import nodemailer from 'nodemailer';

const user = process.env.GMAIL_Id;
const pass = process.env.GMAIL_PW;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user,
    pass,
  },
});

const sendChangePassword = (to, subject, text) => new Promise((resolve, reject) => {
  const message = {
    from: user,
    to,
    subject,
    text,
  };
  
  transport.sendMail(message, (err, info) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(info);
  });
});

export { sendChangePassword }; 