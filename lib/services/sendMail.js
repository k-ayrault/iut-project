'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class SendMailService extends Service {
    sendMail(subject, text, to) {
        console.log(process.env.ENV_DEV);
        if (process.env.SMTP_PROD !== 'PROD') {
            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    console.error('Failed to create a testing account. ' + err.message);
                    return process.exit(1);
                }

                console.log('Credentials obtained, sending message...');

                // Create a SMTP transporter object
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass
                    }
                });

                // Message object
                const message = {
                    from: 'sender@movies.fr',
                    to: to,
                    subject: subject,
                    html: text
                };

                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log('Error occurred. ' + err.message);
                        return process.exit(1);
                    }

                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            });
        }
        else {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });

            // Message object
            const message = {
                from: 'sender@movies.fr',
                to: to,
                subject: subject,
                html: text
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return process.exit(1);
                }

                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        }
    }
};
