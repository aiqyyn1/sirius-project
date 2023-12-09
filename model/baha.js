const {Schema, model} = require("mongoose")


const Baha = new Schema({
      name: {type: String},
      email: {type: String}
})

module.exports = model('Baha', Baha)