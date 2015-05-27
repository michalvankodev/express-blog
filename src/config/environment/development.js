// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/michalBlog'
  },

  seedDB: true,

  corsOptions: {
    origin: function(origin, callback){
      const whitelist = ['http://localhost:9000'];

      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  }
};
