"use strict";

module.exports = (app) => {
  const { router, controller } = app;
  // const { io } = app;
  const { home } = controller;

  // Socket.IO
  // io.route("chat", io.controller.chat.ping);

  // Rest API
  const homeRouter = router.namespace("/api");
  homeRouter.get("/status", home.getStatus);
  homeRouter.post("/user/status", home.postStatus);
};
