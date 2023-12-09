// const {Schema, model} = require('mongoose')
const mongoose = require('mongoose')
const User = require('./User')

const Article = new mongoose.Schema({
      name: {type: String, required: true},
      description: {type: String, required: true},
      coverPhoto: {type: String, required: false},
      content: [
            {
                  key: {type: String, required: true},
                  text: {type: String, default: ""},
                  type: {type: String, default: "unstyled"},
                  depth: {type: Number, default: 0},
                  inlineStyleRanges: [{
                              offset: {type: Number, default: null},
                              length: {type: Number, default: null},
                              style: {type: String, default: null}
                        }
                  ],
                  default: []
            }
      ],
      state: {type: String, required: true},
      creationDate: {type: Date, default: Date.now},
      owner: {type: String, ref: 'User', required: true},
      pinned: {type: Boolean, default: false}
      
})


module.exports = mongoose.model('Article', Article)