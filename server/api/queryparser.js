'use strict';

/*
This function should be common for all api call calls.
Most usefull for index calls and used to limit the output.

Parses the GET query and adds parameters to the mongoose query
returns back the mongoose query
*/
exports.parse = function(req, query) {

  // if query has a limit make a limit
  if (!isNaN(req.query['limit'])) {
    query.limit(+req.query['limit']);
  }
  
  /*
  Uses mongoose syntax so to make a DESC just add - infront of the parameter
  Ex. http://localhost:8090/api/artists?orderBy=-created&limit=2
  */
  if (typeof req.query['orderBy'] !== 'undefined') {
    console.log(req.query['orderBy']);
    query.sort(req.query['orderBy']);
  }

  return query;
};
