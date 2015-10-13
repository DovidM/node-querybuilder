var should = require('chai').should();
var expect = require('chai').expect;
var qb = require('../../drivers/mysql/query_builder.js').QueryBuilder();

describe('get_compiled_select()', function() {
	it('should exist', function() {
		should.exist(qb.get_compiled_select);
	});
	it('should be a function', function() {
		qb.get_compiled_select.should.be.a('function');
	});
	it('should add a table to from_array when a table is supplied', function() {
		qb.reset_query();
		qb.get_compiled_select('galaxies');
		qb.from_array.should.eql(['`galaxies`']);
	});
	it('should add a set of tables to from_array when an array of tables is supplied', function() {
		qb.reset_query();
		qb.get_compiled_select(['galaxies','star_systems','planets']);
		qb.from_array.should.eql(['`galaxies`','`star_systems`','`planets`']);
	});
	it('should return a SQL string', function() {
		qb.reset_query();
		var sql = qb.get_compiled_select('galaxies');
		sql.should.eql('SELECT * FROM `galaxies`');
	});
});

describe('get_compiled_insert()', function() {
	it('should exist', function() {
		should.exist(qb.get_compiled_insert);
	});
	it('should be a function', function() {
		qb.get_compiled_insert.should.be.a('function');
	});
	it('should return a SQL string', function() {
		qb.reset_query();
		var sql = qb.set({foo:'bar'}).get_compiled_insert('galaxies');
		sql.should.eql("INSERT INTO `galaxies` (`foo`) VALUES ('bar')");
	});
});

describe('get_compiled_update()', function() {
	it('should exist', function() {
		should.exist(qb.get_compiled_update);
	});
	it('should be a function', function() {
		qb.get_compiled_update.should.be.a('function');
	});
	it('should return a SQL string', function() {
		qb.reset_query();
		var sql = qb.set({foo:'bar'}).where('id',45).get_compiled_update('galaxies');
		sql.should.eql("UPDATE (`galaxies`) SET `foo` = 'bar' WHERE `id` = 45");
	});
});

describe('get_compiled_delete()', function() {
	it('should exist', function() {
		should.exist(qb.get_compiled_delete);
	});
	it('should be a function', function() {
		qb.get_compiled_delete.should.be.a('function');
	});
	it('should return a SQL string', function() {
		qb.reset_query();
		var sql = qb.where('id',45).get_compiled_delete('galaxies');
		sql.should.eql("DELETE FROM `galaxies` WHERE `id` = 45");
	});
});
