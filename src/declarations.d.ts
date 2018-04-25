interface Connection {
  active: boolean,
  userId: string,
  user?: User,
}

interface User {
  firstName: string,
  lastName: string,
  photoUrl: string,
  stafferFor: string,
  title: string,
  status: string,
  uid: string,
  privateData?: UserPrivate,
}

interface UserPrivate {
  email: string,
  uid: string
}


interface Invitation {
  inviteeId: string,
  inviterId: string,
  message: string,
  createdAt: Date,
  processed: boolean,

  inviteeUser?: User,
  inviterUser?: User,
}

interface Connection {
  active: boolean,
  inviteeId: string,
  inviterId: string,
  createdAt: Date,
}

interface Notification {
  message: string,
  actorId: string,
  actorType: string,
  createdAt: Date,

  actor?: User | any,
}

interface Channel {
  uid: string,
  name?: string,
  status?: string,
  photoUrl?: string,
  ownerId: string,
  createdAt: Date,
  lastMessageAt: Date,
  participants: string[],
}


interface Message {
  uid: string,
  userId: string,
  text: string,
  createdAt: Date,
  timestamp: number,
  seen?: any,
}

