Government Connect
=================

Welcome to the application repository for [Government Connect](https://governmentconnect.net/).

# Getting Started 

Make sure you have the Ionic CLI installed, which you can do by running: `npm install -g ionic@latest`.

Then, within this repository, run `npm install`. This will install all needed Node.js dependencies.

Once everything is set up, you can run `ionic serve` to interact with the app in the browser.

# Backend Architecture

Government Connect uses [Firebase](https://firebase.com) to host data, send notifications, and manage user authentication. Below are some breakdowns of how we handle various business logic through the Firebase backend.

## Requesting Connections

When a user requests a connection, he or she writes to the `/invitations` object of the user they wish to connect with. Our Firebase database rules dictate that any user may write to the invitations object of any other user, but only may do so under their own UID. For example, user `foo` wishes to send a connection request to user `bar`. After sending the request, the `invitations` object in our database looks as follows: 

```json
{
  "invitations": {
    "bar": {
      "foo": {
        "active": true,
        "accepted": false
      }
    }
  }
}
```

User `foo` may only read from the path `/invitations/bar/foo`, but user `bar` may read from the top-level path, `/invitations/bar`, and thus enumerate any pending invitations. __Note__, a user's acceptance of an invitation does not automatically enforce the connection. A corresponding `connection` entry must exist at `/connections/bar/foo` (to follow the previous example) in order for the two users to be truly "connected". Connections may only be created by a user, and that process is covered in the next section.

## Adding Connections

If a user receiving a connection request, they may cement the relationship by creating an active connection within their `connections` object. Per our Firebase database rules, the `connections` key may only be written to authenticated users, and users may only write to their own keys. So should `bar` wish to accept `foo`'s connection request, he may do so by creating a corresponding connection object, resulting in the `connections` object being formed thusly:

```json
{
  "connections": {
    "bar": {
      "foo": {
        "active": true
      }
    },
    "foo": {
      "bar": {
        "active": true
      }
    }
  }
}
```

Notice the denormalization of connection state - both users must possess `active` connection objects for each other in order for the connection to be considered established. Should a user switch a connection's `active` state to `false`, the connection will be severed.

