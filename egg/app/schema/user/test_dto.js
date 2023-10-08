module.exports = {
  properties: {
    name: { type: "string", maxLength: 10, minLength: 5 },
  },
  required: ["name"],
};
