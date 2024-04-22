require('dotenv').config();
const mongoose = require('mongoose');
const State = require('../models/state');

// Database connection
require('../config/database');

const seedData = async () => {
  try {
    await State.deleteMany({});

    const states = [
    {
      stateCode: 'KS',
      funfacts: [
        'Kansas is geographically the center of the continental U.S.',
        'Dodge City is the windiest city in the United States.',
        'The first Pizza Hut restaurant opened in Wichita, Kansas.'
      ]
    },
    {
      stateCode: 'MO',
      funfacts: [
        'Missouri is known as the "Show Me State".',
        'The ice cream cone was first invented in Missouri during the 1904 St. Louis World’s Fair.',
        'Anheuser-Busch brewery in St. Louis, Missouri is the largest beer producing plant in the nation.'
      ]
    },
    {
      stateCode: 'OK',
      funfacts: [
        'Oklahoma is the site of the largest multiple species animal shelter in the U.S., in Tulsa.',
        'The parking meter was invented in Oklahoma City in 1935.',
        'Oklahoma has more man-made lakes than any other state.'
      ]
    },
    {
      stateCode: 'NE',
      funfacts: [
        'Nebraska has more miles of river than any other state.',
        'The largest indoor rainforest in the United States is at the Henry Doorly Zoo in Omaha, Nebraska.',
        'Kool-Aid was invented in Hastings, Nebraska.'
      ]
    },
    {
      stateCode: 'CO',
      funfacts: [
        'Colorado has the highest elevation of any state, with more than 1,000 Rocky Mountain peaks over 10,000 ft tall.',
        'The world’s first rodeo was held on July 4th, 1869 in Deer Trail, Colorado.',
        'Colorado is the only state in history to turn down the Olympics.'
      ]
    }
  ];

    for (let state of states) {
      const newState = new State(state);
      await newState.save();
    }

    console.log('Database seeded!');
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
