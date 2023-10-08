exports.ping = async function () {
  const message = this.args[0];
  await this.socket.emit("res", `Hi! I've got your message: ${message}`);
};
