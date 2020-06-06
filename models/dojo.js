const mongoose = require("mongoose");

// SCHEMA SETUP
let dojoSchema = new mongoose.Schema({
	name: String, 
	fee: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Dojo", dojoSchema);