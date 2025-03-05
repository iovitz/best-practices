// api/models/User.js
module.exports = {
  attributes: {
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    email: { type: 'string', unique: true, required: true, isEmail: true },
    age: { type: 'number', min: 18 },
  },
}
