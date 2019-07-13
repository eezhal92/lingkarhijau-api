import mailgun from 'mailgun-js';
import MailComposer from 'nodemailer/lib/mail-composer';

function createMailGun() {
  return mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });
}

/**
 * @param {object} payload
 * @param {object} payload.from
 * @param {object} payload.to
 * @param {object} payload.subject
 * @param {object} payload.text
 */
export function sendText(payload) {
  return new Promise((resolve, reject) => {
    createMailGun().messages().send(payload, function (error, body) {
      if (error) {
        return reject(error);
      }

      resolve(body);
    });
  });
}

/**
 * @param {object} payload
 * @param {object} payload.from
 * @param {object} payload.to
 * @param {object} payload.subject
 * @param {object} payload.html
 */
export function sendMime(payload) {
  const mailComposer = new MailComposer(payload);

  return new Promise((resolve, reject) => {
    mailComposer.compile().build((error, message) => {
      if (error) return reject(error);

      createMailGun().messages().sendMime({
        to: payload.to,
        message: message.toString('ascii')
      }, function (error, body) {
        if (error) return reject(error);

        resolve(body);
      });
    })
  });
}

