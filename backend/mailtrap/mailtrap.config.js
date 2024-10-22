import {MailtrapClient} from "mailtrap";
import dotenv from 'dotenv';

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,  // this token is generated from the mailtrap website, basically an API token or SMTP credentials where you can get from creating a project or inbox to set-up new project in mailtrap
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Rom",
};

// const recipients = [
//   {
//     email: "romwendel99@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);