const { successRequestConstract } = require("./common");

exports.getStatusResponse = successRequestConstract({
  type: "string",
  required: true,
  example: "content",
});

exports.postStatusBody = {
  name: {
    type: "string",
    required: true,
    example: "content",
  },
};
exports.postStatusResponse = successRequestConstract({
  type: "string",
  required: true,
  example: "success",
});
