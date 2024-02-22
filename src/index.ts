import {mailbox} from './mailbox';
require('dotenv').config();

const email_addr = process.env.EMAIL_ADDR!;
const email_pwd = process.env.APP_PWD!;

const emailClient = new mailbox(email_addr, email_pwd);

console.log(emailClient.client);
