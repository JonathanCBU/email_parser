import {ImapFlow} from 'imapflow';
import {parse} from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import {error} from 'console';
import {PrivateKeyInput} from 'crypto';
require('dotenv').config();

const email_addr = process.env.EMAIL_ADDR!;
const email_pwd = process.env.APP_PWD!;
const data_csv = process.env.APP_TRACKER!;

interface AppInfo {
  title: string;
  company: string;
  link: string;
  status: number;
  date: Date;
}

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

const getRecords = async (): Promise<AppInfo[]> => {
  let headers = ['title', 'company', 'link', 'status', 'date'];
  let records: AppInfo[] = [];
  let parser = fs
    .createReadStream(path.resolve(data_csv))
    .pipe(parse({delimiter: ',', columns: headers}));
  for await (let record of parser) {
    records.push(record);
  }
  return records;
};

const getUnique = async (
  records: AppInfo[],
  column: keyof AppInfo
): Promise<string[]> => {
  let col_arr: any[] = [];
  records.forEach(record => {
    if (record[column] && !col_arr.includes(record[column])) {
      col_arr.push(record[column]);
    }
  });
  return col_arr;
};

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

  // // log out and close connection
  // await client.logout();

  const data = await getRecords();
  console.log(data);
  const comps = await getUnique(data, 'company');
  console.log(comps);
};
main();
