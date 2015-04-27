'use strict';

import chai from 'chai';
import QueryParser from './queryparser';
chai.should();
var expect = chai.expect;

var defaultConditions = {
  state: 'Published',
  type: 'classic'
};

var defaultOptions = {
  limit: 10,
  sort: 'createdDate',
};


describe('QueryParser', () => {

  it('getConditions should return defaults when query is empty', () => {
    var query = {};
    QueryParser.getConditions(query, defaultConditions).should.be.equal(defaultConditions);
  });

  it('getConditions should rewrite defaults when query is set', () => {
    var query = {
      q: '{"state": "Draft"}'
    };

    var conditions = QueryParser.getConditions(query, defaultConditions);
    conditions.state.should.equal('Draft');
    conditions.type.should.equal(defaultConditions.type);
  });

  it('getConditions should omit keys/values when they are set to any', () => {
    var query = {
      q: '{"state": "any"}'
    };

    var conditions = QueryParser.getConditions(query, defaultConditions);
    expect(conditions.state).to.not.exist;
    conditions.type.should.equal(defaultConditions.type);
  });

});
