import {ImapFlow} from 'imapflow';

export class mailbox {
  client: ImapFlow;
  constructor(email: string, pwd: string) {
    this.client = new ImapFlow({
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: {
        user: email,
        pass: pwd,
      },
    });
  }
  async init() {
    await this.client.connect();
  }
}
