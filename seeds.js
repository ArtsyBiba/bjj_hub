const mongoose = require("mongoose");
const Dojo = require("./models/dojo");
const Comment = require("./models/comment");

let seeds = [
	{name: "Primal Academy", image: "https://bit.ly/3cGl6h3", description: "Primal MMA offers BJJ Classes, Kickboxing Classes, Russian Sambo Classes, Self-Defense classes, Strength & Conditioning Classes, Kids Martial Arts."},
	{name: "Yorkdale Martial Arts Academy", image: "https://bit.ly/2WL3URY", description: "Conveniently located in Toronto, our martial arts classes are excellent choices for self-defense, discipline, and fitness for all ages & fitness levels."},
	{name: "OpenMat MMA", image: "https://bit.ly/36h7HK6", description: "OpenMat MMA brings world class instruction in, BJJ, Muay Thai and Wrestling to Downtown Toronto."}
];

// function seedDB(){
//    //Remove all dojos
//    Dojo.deleteMany({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("removed dojos!");
//         Comment.deleteMany({}, function(err) {
//             if(err){
//                 console.log(err);
//             }
//             console.log("removed comments!");
//              //add a few dojos
//             seeds.forEach(function(seed){
//                 Dojo.create(seed, function(err, dojo){
//                     if(err){
//                         console.log(err)
//                     } else {
//                         console.log("added a dojo");
//                         //create a comment
//                         Comment.create(
//                             {
//                                 text: "Great academy, friendly atmosphere and some solid rolls!",
//                                 author: "Homer"
//                             }, function(err, comment){
//                                 if(err){
//                                     console.log(err);
//                                 } else {
//                                     dojo.comments.push(comment);
//                                     dojo.save();
//                                     console.log("Created new comment");
//                                 }
//                             });
//                     }
//                 });
//             });
//         });
//     }); 
// }

async function seedDB(){
	try {
		await Dojo.deleteMany({});
		await Comment.deleteMany({});

		for(const seed of seeds) {
			let dojo = await Dojo.create(seed);
			let comment = await Comment.create(
				{
					text: "Great academy, friendly atmosphere and some solid rolls!",
					author: "Homer"
				}
			)
			dojo.comments.push(comment);
			dojo.save();
		}
	} catch(err){
		console.log(err);
	}
}
		
module.exports = seedDB;
