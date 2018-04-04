interface Contact {
  active: boolean,
  firstName: string,
  lastName: string,
  photoUrl: string,
  stafferFor: string,
  title: string,
  uid: string
}

interface User {
  firstName: string,
  lastName: string,
  photoUrl: string,
  stafferFor: string,
  title: string,
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
