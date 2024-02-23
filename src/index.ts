import {ImapFlow} from 'imapflow';
import {parse} from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
require('dotenv').config();

const email_addr = process.env.EMAIL_ADDR!;
const email_pwd = process.env.APP_PWD!;
const data_csv = process.env.APP_TRACKER!;

type AppInfo = {
  title: string;
  company: string;
  link: string;
  status: number;
  date: Date;
};

const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  logger: false,
  auth: {
    user: email_addr,
    pass: email_pwd,
  },
});

const main = async () => {
  // // Wait until client connects and authorizes
  // await client.connect();

  // // Select and lock a mailbox. Throws if mailbox does not exist
  // let lock = await client.getMailboxLock('INBOX');
  // try {
  //   for await (let message of client.fetch('1:*', {
  //     uid: true,
  //     envelope: true,
  //   })) {
  //     //   console.log(`UID: ${message.uid}`);\
  //     console.log(
  //       'UID: ' + message.uid + ' --- Subject: ' + message.envelope.subject
  //     );
  //   }
  // } finally {
  //   // Make sure lock is released, otherwise next `getMailboxLock()` never returns
  //   lock.release();
  // }

  // log out and close connection
  await client.logout();

  const csvFilePath = path.resolve(data_csv);

  const headers = ['title', 'company', 'link', 'status', 'date'];

  const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    (error, result: AppInfo[]) => {
      if (error) {
        console.error(error);
      }
      console.log('Result', result);
    }
  );
};
main();
