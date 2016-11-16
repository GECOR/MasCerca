export class MessageChat {
  messageChat_ID: string;
  dateMessage: string;
  message: string;
  sendedByAux_ID: string;
  m_checked: string;
  info: string;
  sendedByName: string;
  sendedByMe: boolean;

  constructor(obj?: any) {
    console.log("MessageChat "+ JSON.stringify(obj));
    this.messageChat_ID   = obj && obj.messageChat_ID   || undefined;
    this.dateMessage      = obj && obj.dateMessage      || undefined;
    this.message          = obj && obj.message          || undefined;
    this.sendedByAux_ID   = obj && obj.sendedByAux_ID   || undefined;    
    this.m_checked        = obj && obj.m_checked        || undefined;
    this.info             = obj && obj.info             || undefined;
    this.sendedByName     = obj && obj.sendedByName     || undefined;
    this.sendedByMe       = obj && obj.sendedByMe       || false;
  }
}
