const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const modelSchema = new Schema({
    kind: {type: String, required: true},
    etag: {type: String, required: true},
    id:  {type: String, required: true},
    snippet: {type: JSON},
    contentDetails: {type: JSON},
    statistics: {type: JSON}
}, {timestamps: true});


const Model = mongoose.model('hw-1-collection', modelSchema);
module.exports = Model; 