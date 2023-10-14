exports.successRequestConstract = function (data) {
  return {
    code: { type: "number", required: true, example: 0 },
    msg: { type: "string", required: true, example: "success" },
    data,
  };
};
