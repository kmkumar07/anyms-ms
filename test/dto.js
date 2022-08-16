'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-softobiz-ms:dto', () => {
  beforeEach(() => {
    return helpers
      .run(path.join(__dirname, '../generators/dto'))
      .withArguments(["application"])
  });

  it('creates dto file', () => {
    assert.noFile('templates/dto.tmpl');
  });

});