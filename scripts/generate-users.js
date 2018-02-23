const FS = require('fs')
const Chance = new require('chance')()

const count = 600
const users = {}

for (var i = 0; i < count; i++) {
  const id = Chance.hash({ length: 32 })
  
  users[id] = {
    "agency": "Senate",
    "firstName": Chance.first(),
    "lastName": Chance.last(),
    "photoUrl": 'https:' + Chance.avatar(),
    "stafferFor": "Senator " + Chance.name(),
    "title": "Legislative Assistant",
    "uid": id
  }
}

FS.writeFileSync('./users.json', JSON.stringify(users))