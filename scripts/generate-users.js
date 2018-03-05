const FS = require('fs')
const Chance = new require('chance')()

const count = 600
const users = {}

for (var i = 0; i < count; i++) {
  const id = Chance.hash({ length: 32 })
  const gender = Math.round(Math.random()) ? 'female' : 'male' 
  const photo = `https://d3iw72m71ie81c.cloudfront.net/${gender}-${Math.ceil(Math.random() * 100)}.jpg`
  
  users[id] = {
    "agency": "Senate",
    "firstName": Chance.first({ gender }),
    "lastName": Chance.last(),
    "photoUrl": photo,
    "stafferFor": "Senator " + Chance.name(),
    "title": "Legislative Assistant",
    "uid": id
  }
}

users['ij9Ve6EWijaHzz4e0X8k9DJdqaq1'] = {
  firstName: 'Demo',
  lastName: 'User',
  agency: 'Senate',
  photoUrl: 'https://d3iw72m71ie81c.cloudfront.net/female-41.jpg',
  stafferFor: 'Senator Lux Imperator',
  title: 'Assistant',
  uid: 'ij9Ve6EWijaHzz4e0X8k9DJdqaq1'
}

users['yWpiXiWnpYM6EN0JaLHYKS7rYxO2'] = {
  firstName: 'Test',
  lastName: 'User',
  agency: 'Senate',
  photoUrl: 'https://d3iw72m71ie81c.cloudfront.net/female-11.jpg',
  stafferFor: 'Senator Jamie Doe',
  title: 'Assistant',
  uid: 'yWpiXiWnpYM6EN0JaLHYKS7rYxO2'
}

FS.writeFileSync('./users.json', JSON.stringify(users))