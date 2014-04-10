// AngularJS function
function ctrl_overview($scope, $http, $timeout) 
{ 
	$scope.time = 0;
	$scope.temperature = 0;
	$scope.humidity = 0;
	$scope.pressure = 0;
	$scope.compass = 0;
	
	$scope.data = [];
	
	var plotdata = {
		labels : [],
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : []
			},
		]
	}
	
	// Request the history at the page loading
	$http(
	{
		method: 'GET', 
		url: '/gethistorydata'
	}).
	success(function(data, status, headers, config) 
	{
		// this callback will be called asynchronously
		// when the response is available
		for( i = 0; i < data.length; i++ )
		{
			var obj = [];
			dateObj = new Date(data[i].time);
			obj.time = dateObj.toLocaleString();
			obj.temperature = data[i].temperature;
			obj.humidity = data[i].humidity;
			obj.pressure = data[i].pressure;
			obj.compass = data[i].compass;
			$scope.data.push(obj);
		}
		
		// Push into plot
		for( i = data.length - 1; i >= 0; i-- )
		{
			dateObj = new Date(data[i].time);
			plotdata.labels.push(dateObj.Format("hh:mm"));
			plotdata.datasets[0].data.push(data[i].temperature);
		}
		
		//Get context with jQuery - using jQuery's .get() method.
		var ctx = $("#chart_overview").get(0).getContext("2d");
		//ctx.canvas.width  = window.innerWidth * 0.5;
		//This will get the first returned node in the jQuery collection.
		var myNewChart = new Chart(ctx);
		// Plot
		options = {
			scaleLabel : "<%=value%>",
			animation: true,};
		new Chart(ctx).Line(plotdata,options);
	}).
	error(function(data, status, headers, config) 
	{
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		console.log('AJAX GET ERROR');
	});
	  
	// Request the realtime with a timer
	$scope.onTimeout = function()
	{   
		$http(
		{
			method: 'GET', 
			url: '/getrealtimedata'
		}).
		success(function(data, status, headers, config) 
		{
			// this callback will be called asynchronously
			// when the response is available
			$scope.time = new Date(data.time).toLocaleString();
			$scope.temperature = data.temperature;
			$scope.humidity = data.humidity;
			$scope.pressure = data.pressure;
			$scope.compass = data.compass;		
			if( $scope.compass >= 0 && $scope.compass < 15 )
				$scope.compass += ' N';
			else if( $scope.compass >= 15 && $scope.compass < 75 )
				$scope.compass += ' NE';
			else if( $scope.compass >= 75 && $scope.compass < 115 )
				$scope.compass += ' E';
			else if( $scope.compass >= 115 && $scope.compass < 165 )
				$scope.compass += ' SE';
			else if( $scope.compass >= 165 && $scope.compass < 195 )
				$scope.compass += ' S';
			else if( $scope.compass >= 195 && $scope.compass < 255 )
				$scope.compass += ' SW';
			else if( $scope.compass >= 255 && $scope.compass < 295 )
				$scope.compass += ' W';
			else if( $scope.compass >= 295 && $scope.compass < 345 )
				$scope.compass += ' NW';
			else if( $scope.compass >= 345 && $scope.compass <= 360 )
				$scope.compass += ' N';
		}).
		error(function(data, status, headers, config) 
		{
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('AJAX GET ERROR');
		});
		
		mytimeout = $timeout($scope.onTimeout, 60000);   
	}  
	// Start the timer
	var mytimeout = $timeout($scope.onTimeout);

}


Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),  
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
