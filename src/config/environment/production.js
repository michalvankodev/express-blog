// Production specific configuration
// =================================
/* eslint key-spacing: 0*/
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/michalBlog'
  },

  corsOptions: {
    origin: function(origin, callback){
      const whitelist = ['http://localhost:9000'];

      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
    }
  }
};
