---
sidebar_position: 1
---

# Getting Started

In this lab we will build a multi-room chat app.

To get started, make sure your current branch is clean, and then checkout the  `lab2-start` branch:

```bash
git checkout lab2-start
```

You can find a completed version of this lab in the
[lab2-complete](https://github.com/elylucas/ng-nest-realtime-apps/tree/lab2-complete)
branch.

The starting branch contains the skeleton of the app we will use. Most of the HTML and CSS is done for you already, we will be adding to it.

## Scaffold Nest Parts

```bash title=./server
nest g service chat
nest g gateway chat
```

using chat service to hold state, chat gateway for connection

explain namespaces...

## Scaffold Angular Parts

using ng service to manage socket and data

```bash title=./client
ng g service chat
```
