"use strict";

module.exports = (app) => {
  const { router, controller, io } = app;
  const { demo } = controller;

  // Socket.IO
  io.route("chat", io.controller.chat.ping);

  // Rest API
  const userRouter = router.namespace("/api/demo");
  userRouter.get("/", demo.testGet);
  userRouter.post("/", demo.testPost);
};
