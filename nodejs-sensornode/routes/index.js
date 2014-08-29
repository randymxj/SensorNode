
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'SensorNode Console' });
};


/*
 * GET Host info page.
 */

exports.hostinfo = function(req, res){
  res.render('hostinfo', { title: 'SensorNode Hostinfo' });
};