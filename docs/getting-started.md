---
sidebar_position: 0
slug: /
---

# Getting Started

Welcome to the Realtime apps with Angular and NestJS workshop!

This workshop covers how to use NestJS as a websocket server for Angular apps.

## Clone Repo and Install Dependencies

To get started, clone the repo and install the dependencies:

```bash
git clone https://github.com/elylucas/realtime-ng-nest.git
```

Go into the repo's folder and install the dependencies:

```bash
cd realtime-ng-nest
npm install
```

The repo folder contains two pertinent folders:

- **client**: The Angular front-end app
- **server**: NestJS back-end app

Running `npm install` from above installs the dependencies for both apps.

## Start App

Next, open the code folders in your code editor. You might choose to open the app at the root level, or open each folder in the own editor instance.

To start the app run the following in the root folder:

```bash
npm start
```

This will start the dev servers for both apps.

The Angular app should launch a browser to [http://localhost:4200](http://localhost:4200). If it did not, go ahead and open it. The initial page will have a simple welcome message.

Once the app is running and you have your code editor open, you are ready to continue to the first lab.