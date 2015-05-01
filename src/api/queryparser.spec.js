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
    QueryParser.getConditions(query, defaultConditions).should.be.eql(defaultConditions);
  });

  it('getConditions should rewrite defaults when query is set', () => {
    var query = {
      state: 'Draft'
    };

    var conditions = QueryParser.getConditions(query, defaultConditions);
    conditions.state.should.equal('Draft');
    conditions.type.should.equal(defaultConditions.type);
  });

  it('getConditions should omit keys/values when they are set to any', () => {
    var query = {
      state: 'any'
    };

    var conditions = QueryParser.getConditions(query, defaultConditions);
    expect(conditions.state).to.not.exist;
    conditions.type.should.equal(defaultConditions.type);
  });

  it('queryOptions should not get into conditions', () => {
    let query = {
      state: 'Draft',
      type: 'classic',
      sort: '-field',
      limit: '20'
    };

    let conditions = QueryParser.getConditions(query, defaultConditions);
    expect(conditions.sort).to.not.exist;
    expect(conditions.limit).to.not.exist;
  });

  it('getOptions should only return options and nothing else', () => {
    let query = {
      state: 'Draft',
      type: 'classic',
      sort: '-field',
      limit: '20'
    };
    let expectedOptions = {
      sort: '-field',
      limit: '20'
    }

    let options = QueryParser.getOptions(query, defaultOptions);
    options.should.eql(expectedOptions);
  });

  it('getOptions should reassign option from query but not omit defaults', () => {
    let query = {
      limit: 22
    };
    let expectedOptions = {
      limit: 22,
      sort: 'createdDate'
    };

    let options = QueryParser.getOptions(query, defaultOptions);
    options.should.eql(expectedOptions);
  });
});
