var should = require('chai').should();
var expect = require('chai').expect;

var QueryBuilder = require('../lib/query_builder.js');
var qb = new QueryBuilder();

describe('join()', function() {
	it('should exist', function() {
		should.exist(qb.join);
	});
	it('should be a function', function() {
		qb.join.should.be.a('function');
	});
	it('should have an array to put fields into', function() {
		qb.should.have.property('joinArray');
	});
	it('should have an empty array to put fields into at the beginning', function() {
		qb.joinArray.should.be.empty;
	});
	it('should require a string to be passed as first parameter', function() {
		var invalid_match = /must provide a table/;
		expect(function() { qb.join(); 		}, 'nothing provided').to.throw(Error, invalid_match);
		expect(function() { qb.join(true); 	}, 'true provided').to.throw(Error, invalid_match);
		expect(function() { qb.join(null); 	}, 'null provided').to.throw(Error, invalid_match);
		expect(function() { qb.join(false);	}, 'false provided').to.throw(Error, invalid_match);
		expect(function() { qb.join({}); 	}, 'object provided').to.throw(Error, invalid_match);
		expect(function() { qb.join([]); 	}, 'empty array provided').to.throw(Error, invalid_match);
		expect(function() { qb.join('');	}, 'empty string provided').to.throw(Error, invalid_match);
		expect(function() { qb.join('  ');	}, 'string of spaces provided').to.throw(Error, invalid_match);
		expect(function() { qb.join('foo');	}, 'valid string provided').to.not.throw(Error);
		expect(function() { qb.join('foo');	}, 'valid string provided').to.not.throw(Error);
	});
	it('should except single item and add it to join array as basic join and escape item', function() {
		qb.resetQuery();
		qb.join('universe');
		qb.joinArray.should.eql(['JOIN `universe` ']);
	});
	it('should except single item with alias and add it to join array as basic join and escape each part', function() {
		qb.resetQuery();
		qb.join('universe u');
		qb.joinArray.should.eql(['JOIN `universe` `u` ']);
	});
	it('should allow a string (and only a string) to be passed as second parameter but only if a valid (or no) third parameter is provided', function() {
		var invalid_2nd_param = /You must provide a valid condition to join on when providing a join direction/;
		var invalid_direction = /Invalid join direction provided as third parameter/;
		
		expect(function() { qb.join('universe',null,'left');		}, 'null 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe',false,'left');		}, 'false 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe','','left');			}, 'empty string 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe','   ','left');		}, 'just spaces 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe',5,'left');			}, 'integer 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe',5.6,'left');			}, 'float 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe',[],'left');			}, 'array 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe',{},'left');			}, 'object 2nd param').to.throw(Error,invalid_2nd_param);
		expect(function() { qb.join('universe','foo = bar','fake');	}, 'invalid 3rd param').to.throw(Error,invalid_direction);
		expect(function() { qb.join('universe','foo = bar');		}, 'no 3rd param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','left');	}, '3 valid params').to.not.throw(Error);
	});
	it('should allow valid join direction to be passed in third parameter', function() {
		// NOTE: A lot of this functionality was already tested when testing second param
		var invalid_direction = /Invalid join direction provided as third parameter/;
		
		expect(function() { qb.join('universe','foo = bar','fake');			}, 'invalid 3rd param').to.throw(Error,invalid_direction);
		expect(function() { qb.join('universe',null,null);					}, 'invalid 2nd and 3rd params').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','');				}, 'empty third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','   ');			}, 'just spaces').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',null);			}, 'null third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',false);			}, 'false third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',5);				}, 'integer third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',5.5);			}, 'float third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',{});				}, 'object third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',[]);				}, 'array third param').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','left  ');		}, 'trailing space').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar',' left ');		}, 'leading and trailing space').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','  left');		}, 'leading space').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','left');			}, 'lowercase direction').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','LEFT');			}, 'uppercase direction').to.not.throw(Error);
		expect(function() { qb.join('universe','foo = bar','LEFT OUTER');	}, 'two word direction').to.not.throw(Error);
	});
	it('should except a valid second parameter as a join condition and escape it properly', function() {
		qb.resetQuery();
		qb.join('universe u','u.type_id = ut.id');
		qb.joinArray.should.eql(['JOIN `universe` `u` ON `u`.`type_id` = `ut`.`id`']);
	});
	it('should escape compound objects properly', function() {
		qb.resetQuery();
		qb.join('universe.galaxy.star_system s','s.type_id = st.id');
		qb.joinArray.should.eql(['JOIN `universe`.`galaxy`.`star_system` `s` ON `s`.`type_id` = `st`.`id`']);
	});
	it('should add aliases to alias-tracking array', function() {
		qb.resetQuery();
		qb.join('universe.galaxy.star_system s');
		qb.aliasedTables.should.eql(['s']);
	});
});