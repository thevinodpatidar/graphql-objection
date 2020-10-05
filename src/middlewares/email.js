const sgMail = require('@sendgrid/mail');
const sendgrid = require('../config/index').sendgrid;
sgMail.setApiKey(sendgrid);

const sendEmail = async (to, subject, text) => {
  console.log("after this console.log");
  const msg = {
    to: to,
    from: {
      name :  "OnlineFarmVeggies",
      email : 'onlinefarmveggies@gmail.com'
    },
    subject: subject,
    text: text
  };
  sgMail.send(msg)
    .then(() => {
      //Celebrate
      console.log("sent")
    })
    .catch(error => {

      //Log friendly error
      console.error(error.toString());

      //Extract error msg
      const {
        message,
        code,
        response
      } = error;

      //Extract response msg
      const {
        headers,
        body
      } = response;
    });
}


const sendEmailToMe = async (from,name, subject, text) => {
  console.log("after this console.log");
  const msg = {
    to: 'onlinefarmveggies@gmail.com',
    from: {
      name : name,
      email : from
    },
    subject: subject,
    text: text
  };
  sgMail.send(msg)
    .then(() => {
      //Celebrate
      console.log("sent")
    })
    .catch(error => {

      //Log friendly error
      console.error(error.toString());

      //Extract error msg
      const {
        message,
        code,
        response
      } = error;

      //Extract response msg
      const {
        headers,
        body
      } = response;
    });
}

module.exports = {
  sendEmail,
  sendEmailToMe
}
