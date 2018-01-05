var _ = require('underscore');
var async = require('async');
var User = require('../models/User');

// In memory stats.
var stats = {};
function calculateStats(){
  console.log('Calculating stats...');
  var newStats = {
    lastUpdated: 0,

    total: 0,
    demo: {
      gender: {
        M: 0,
        F: 0,
        O: 0,
        N: 0
      },
      schools: {},
      year: {
        '2018': 0,
        '2019': 0,
        '2020': 0,
        '2021': 0,
        '2022': 0,
        'other': 0
      }
    },

    teams: {},
    verified: 0,
    submitted: 0,
    admitted: 0,
    confirmed: 0,
    confirmedINSA: 0,
    declined: 0,

    confirmedFemale: 0,
    confirmedMale: 0,
    confirmedOther: 0,
    confirmedNone: 0,

    shirtSizes: {
      'XS': 0,
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
      'XXL': 0
    },

    dietaryRestrictions: {
      'Vegan': 0,
      'Vegetarian': 0,
      'Halal': 0,
      'Kosher': 0,
      'Nut-Allergy': 0,
      'Other': 0,
      'None': 0
    },

    wantsHardware: 0,

    checkedIn: 0
  };

  User
    .find({})
    .exec(function(err, users){
      if (err || !users){
        throw err;
      }

      newStats.total = users.length;

      async.each(users, function(user, callback){

        // Grab the email extension
        var email = user.email.split('@')[1];

        // Add school Name
        if(user.profile.school !== "undefined"){
          var schoolName = user.profile.school;
        }

        // Add to the gender
        newStats.demo.gender[user.profile.gender] += 1;

        // Count verified
        newStats.verified += user.verified ? 1 : 0;

        // Count submitted
        newStats.submitted += user.status.completedProfile ? 1 : 0;

        // Count accepted
        newStats.admitted += user.status.admitted ? 1 : 0;

        // Count confirmed
        newStats.confirmed += user.status.confirmed ? 1 : 0;

        // Count confirmed that are mit
        newStats.confirmedINSA += user.status.confirmed && email === "insa-lyon.fr" ? 1 : 0;

        newStats.confirmedFemale += user.status.confirmed && user.profile.gender === "F" ? 1 : 0;
        newStats.confirmedMale += user.status.confirmed && user.profile.gender === "M" ? 1 : 0;
        newStats.confirmedOther += user.status.confirmed && user.profile.gender === "O" ? 1 : 0;
        newStats.confirmedNone += user.status.confirmed && user.profile.gender === "N" ? 1 : 0;

        // Count declined
        newStats.declined += user.status.declined ? 1 : 0;

        // Count the number of people who want hardware
        newStats.wantsHardware += user.confirmation.wantsHardware ? 1 : 0;

        // Count schools
        if (!newStats.demo.schools[schoolName]){
          newStats.demo.schools[schoolName] = {
            submitted: 0,
            admitted: 0,
            confirmed: 0,
            declined: 0
          };
        }
        newStats.demo.schools[schoolName].submitted += user.status.completedProfile ? 1 : 0;
        newStats.demo.schools[schoolName].admitted += user.status.admitted ? 1 : 0;
        newStats.demo.schools[schoolName].confirmed += user.status.confirmed ? 1 : 0;
        newStats.demo.schools[schoolName].declined += user.status.declined ? 1 : 0;

        // Count graduation years
        if (user.profile.graduationYear){
          newStats.demo.year[user.profile.graduationYear] += 1;
        }

        // Grab the team name if there is one
        // if (user.teamCode && user.teamCode.length > 0){
        //   if (!newStats.teams[user.teamCode]){
        //     newStats.teams[user.teamCode] = [];
        //   }
        //   newStats.teams[user.teamCode].push(user.profile.name);
        // }

        // Count shirt sizes
        if (user.profile.shirtSize in newStats.shirtSizes) {
          newStats.shirtSizes[user.profile.shirtSize] += 1;
        }

        // Dietary restrictions
        if (user.profile.dietaryRestrictions in newStats.dietaryRestrictions) {
          newStats.dietaryRestrictions[user.profile.dietaryRestrictions] += 1;
        }
        // if (user.confirmation.dietaryRestrictions){
        //   user.confirmation.dietaryRestrictions.forEach(function(restriction){
        //     if (!newStats.dietaryRestrictions[restriction]){
        //       newStats.dietaryRestrictions[restriction] = 0;
        //     }
        //     newStats.dietaryRestrictions[restriction] += 1;
        //   });
        // }

        // Count checked in
        newStats.checkedIn += user.status.checkedIn ? 1 : 0;

        callback(); // let async know we've finished
      }, function() {
        // Transform dietary restrictions into a series of objects
        var restrictions = [];
        _.keys(newStats.dietaryRestrictions)
          .forEach(function(key){
            restrictions.push({
              name: key,
              count: newStats.dietaryRestrictions[key]
            });
          });
        newStats.dietaryRestrictions = restrictions;

        // Transform schools into an array of objects
        var schools = [];
        _.keys(newStats.demo.schools)
          .forEach(function(key){
            schools.push({
              email: key,
              count: newStats.demo.schools[key].submitted,
              stats: newStats.demo.schools[key]
            });
          });
        newStats.demo.schools = schools;

        // Likewise, transform the teams into an array of objects
        // var teams = [];
        // _.keys(newStats.teams)
        //   .forEach(function(key){
        //     teams.push({
        //       name: key,
        //       users: newStats.teams[key]
        //     });
        //   });
        // newStats.teams = teams;

        console.log('Stats updated!');
        newStats.lastUpdated = new Date();
        stats = newStats;
      });
    });

}

// Calculate once every five minutes.
calculateStats();
setInterval(calculateStats, 300000);

var Stats = {};

Stats.getUserStats = function(){
  return stats;
};

module.exports = Stats;
