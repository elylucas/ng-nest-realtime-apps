---
sidebar_position: 1
---

# Getting Started

In this lab, we will build a multi-room chat app. A chat app is the
quintessential demo app for real-time communications. And for good reasons! They
are understood by most developers, fairly easy to implement and showcase many of
the concepts needed to build more sophisticated applications.

Our chat app will feature multiple rooms that people can join and leave, which
will help demonstrate sending messages to only particular groups.

Ready to get started? Great!

First, make sure your current branch is clean, and then checkout the
`lab2-start` branch:

```bash
git checkout lab2-start
```

:::info

You can find a completed version of this lab in the
[lab2-complete](https://github.com/elylucas/ng-nest-realtime-apps/tree/lab2-complete)
branch.

:::

The starting branch contains the skeleton of the app we will use. On the client
side, we will only use the home page powered by the app component. Most of the
HTML and all of the CSS are already in the app component's style and template
files. We'll modify the TypeScript file and update the template a bit as we
build the app.

## Scaffolding

### Scaffold Nest Parts

We will create two new Nest pieces, a `ChatGateway` and a `ChatService`. The
gateway will be responsible for communicating with client apps via Socket.IO,
and the service will be a data persistence and logic layer. The app will store
everything in memory to keep things simple. So each time the server reboots, all
data will be lost. However, you could expand the service layer to persist the
chat room information into something like a database.

Go into the **server** folder and run the following commands to generate the
files:

```bash title=./server
nest g service chat
nest g gateway chat
```

### Scaffold Angular Parts

We will create an Angular service to communicate with the backend and persist
any client side state on the client side.

Move into the **client** folder and run:

```bash title=./client
ng g service chat
```

## Start Server

Next, start the development server if you haven't already:

```bash
npm run start
```

Let's get coding!
