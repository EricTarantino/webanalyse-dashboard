//TODO: Code best practice

angular.module('app', ['ngMaterial', 'ngSanitize', 'ngMdIcons', 'mdDataTable', 'analytics', 'management', 
	'register', 'router', 'sidebar', 'material.svgAssetsCache']); //'datepicker'
	

angular.module('app').controller('ApplicationCtrl', function ($scope, $state, $location, $http) { //
	
	//module variables
	//Getter and Setter would not be too bad, cause then we could not mess up the data, So this'd be like some android, OOP, Script Coding
	//We might like to give best practice a shoot
	var vm = this;	
	//data variables
	vm.currentDB = null;
	//datapicker enddate
	vm.enddate = null;	
	//holds the dashboards [d1, d2, d3, d4, ... ]
	vm.myddd = [];		
	//show or unshow dashboardcard
	vm.showDashboardList = false;	
	//show or unshow departments
	vm.showDepartments = false;		
	//to set the possible level depending on the user rights
	vm.showDIY = false;
	vm.showGesamt = false;
	vm.showHG = false;
	vm.showPRO = false;
	//show variables with respect to autorization and linkstate, show sidebar icon
	vm.showSidebarIcon = false;	
	//show top navigation bar
	vm.showTopNav = false;
	//this is used in child controller analytics but should used everywhere instead of vm.currentDB
	//to avoid emiting and broadcasting vm.currentDB up and down the scopes	
	//datapicker startdate
	vm.startdate = null;
	vm.useremail = "";
	//user variables
	vm.username = null;
	//user rights
	vm.userrights = null;
	
	//scope variable
	$scope.CDB;
	$scope.mmdbEndDate = new Date();
	$scope.mmdbStartDate = new Date();
	//holds the graphs [{graph : {useremail : "useremail", screensize: "", 
	$scope.mygraphs =[];
	$scope.useraccess = null; //add this to user object, needs to be saved
	
	//intern variables
	//delete a graph, the array graph to delete holds temporary graphs until it is confirmed to be deleted from server side
	var graphToDelete = [];
	//functions 
	//function to fetch data, vm.fetchData = fetchData, function to set visibility of the menu
	vm.routeTo = routeTo;
	//function to set the viewer level
	vm.SetAccess = SetAccess;	
	vm.setRights = setRights;
	//set the rights, this is the authorization
  	function setRights(userrights){  		
  		if(userrights==="Gesamt"){
  			vm.showGesamt = true;
  			vm.showDIY = true;
			vm.showHG = true;	
			vm.showPRO = true;
  		}
  		if(userrights==="DIY"){
  			vm.showGesamt = false;
  			vm.showDIY = true;
  			vm.showPRO = false;
			vm.showHG = false;			
  		}
  		if(userrights==="PRO"){
  			vm.showGesamt = false;
  			vm.showDIY = false;
  			vm.showPRO = true;
			vm.showHG = false;
  		}
  		if(userrights==="HG"){
  			vm.showGesamt = false;
  			vm.showDIY = false;
			vm.showPRO = false;
			vm.showHG = true;
  		}
  	}
  	//set the access depending on the user choice, not all users can choose every access
    function SetAccess(access){
  		$scope.useraccess = access;  		
  		if(access !== "Gesamt"){
  			$scope.$broadcast('accessChange', [$scope.useraccess] );
  		}
  		//inject access into management root scope
  		//show or hide the access Buttons on the sidebar menu
  		if(vm.userrights==="Gesamt" && access==="Gesamt"){  			
 	 		vm.showGesamt = false;
 	 		vm.showDIY = true;
			vm.showPRO = true;
			vm.showHG = true;
 	 	}
  		if((vm.userrights==="Gesamt" || vm.userrights==="DIY") && access==="DIY"){
  			vm.showGesamt = true;
  			vm.showDIY = false;
 	 		vm.showPRO = true;
			vm.showHG = true;
	  	}
	  	if((vm.userrights==="Gesamt" || vm.userrights==="PRO") && access==="PRO"){
	  		vm.showGesamt = true;
			vm.showDIY = true;
  			vm.showPRO = false;
			vm.showHG = true;
	  	}
	  	if((vm.userrights==="Gesamt" || vm.userrights==="HG") && access==="HG"){
	  		vm.showGesamt = true;
			vm.showDIY = true;
  			vm.showPRO = true;
			vm.showHG = false;
	  	}
  		//var myData = fetchData(vm.userrights);
  		//this function must be defined in the appropriate place
   		//TODO make this a callback
  		//updateChart( fetchData(vm.useraccess) );
  	}  	
	//handles the visibility of different object, depending on the route
	function routeTo($event){
  		var shortlink = $event.currentTarget.toString();
  		var route = shortlink.slice(shortlink.lastIndexOf("/")+1);
  		//these are the sidebar main elements: dashboardlist, departmentlist for 
  		//css sidebar and for angular overlay sidebar (ao)
  		var mt, dplcss, dblcss, dplao, dblao; 
  		if(route === "management"){
  			mt = document.getElementById("menu-toggle");
  			mt.style.visibility='visible';
  			dplcss = document.getElementById("departmentListCSSSideBar");
  			dplcss.style.display='block';
  			dblcss = document.getElementById("dashboardListCSSSideBar");
  			dblcss.style.display='none';	
  			dplao = document.getElementById("departmentListAOSideBar");
  			dplao.style.display='block';
  			dblao = document.getElementById("dashboardListAOSideBar");
  			dblao.style.displayy='none';	
  			//management and analytics dashboards switch
  			var ngViewindexXY = document.getElementById("index-center");
  			ngViewindexXY.style.display='block';  
  			ngViewindexXY = document.getElementById("index-analytics");
  			ngViewindexXY.style.display='none'; 
  		} else if(route === "analytics"){
  			mt = document.getElementById("menu-toggle");
  			mt.style.visibility='visible';
  			dplcss = document.getElementById("departmentListCSSSideBar");
  			dplcss.style.display='none';	
  			dblcss = document.getElementById("dashboardListCSSSideBar");
  			dblcss.style.display='block';  
  			dplao = document.getElementById("departmentListAOSideBar");
  			dplao.style.display='none';
  			dblao = document.getElementById("dashboardListAOSideBar");
  			dblao.style.display='block';	
  			//management and analytics dashboards switch
  			ngViewindexXY = document.getElementById("index-center");
  			ngViewindexXY.style.display='none';  
  			ngViewindexXY = document.getElementById("index-analytics");
  			ngViewindexXY.style.display='block'; 
  		} else if(route === "signout") {
  			$http.defaults.headers.common['X-Auth']= "";
  			//var user = _user[0];	
  			closeCSSSideBar()
	  		var resulta = document.getElementById("topNavBlendInAtLogin");
	  		resulta.style.visibility='hidden';
	  		var smallTopNav = document.getElementById("smallNavBlendInAtLogin");
	  		smallTopNav.style.visibility='hidden';
	  		var resultc = document.getElementById("menu-toggle");
	  		resultc.style.visibility='hidden'; 	
			var NgSidebar = document.getElementById("closeNgSidebar");
	  		NgSidebar.style.display='none';
	  		var menuToggle = document.getElementById("menu-toggle");
	  		menuToggle.style.display='none';
	  		vm.useremail = null;
	  		$scope.mydashboards = [];
	  		vm.mydashboards = [];
	    	vm.username = null;
	    	vm.userrights = null;
	        $scope.useraccess = null;
	    	//management and analytics dashboards switch
	  		var ngViewindexXY = document.getElementById("index-center");
	  		ngViewindexXY.style.display='block';  
	  		ngViewindexXY = document.getElementById("index-analytics");
	  		ngViewindexXY.style.display='none'; 
  		} else {
  			var mt_m = document.getElementById("menu-toggle");
  			mt_m.style.visibility='hidden';
  			closeCSSSideBar();    			
  			//management and analytics dashboards switch
  			ngViewindexXY = document.getElementById("index-center");
  			ngViewindexXY.style.display='block';  
  			ngViewindexXY = document.getElementById("index-analytics");
  			ngViewindexXY.style.display='none'; 
  		}  		
  	}	
	//scope event emitter
	//scope event listener
	//selected a dashboard
	$scope.$on('currentDBChange', function (_, currentDB) {
		//alert("currentDB is: " + vm.currentDB)
		vm.currentDB = currentDB[0];
		$scope.$broadcast('currentDBChange', [vm.currentDB]);
	});
	//prepare new dashboard localy
	$scope.$on('loadDB', function (_, cardname) {
	});
	//created new dashboard
	$scope.$on('loadedDB', function (_, cardname) {		
	//update all graphs one by one
	});
	//prepare new dashboard localy
	$scope.$on('newDBCard', function (_, cardname) {		
		vm.myddd.push(cardname[0]);		
		//set dashboard as the current dashboard
		vm.currentDB = cardname[0];
  		$scope.$broadcast('currentDBChange', [vm.currentDB]);
	});	
	//created new dashboard
	$scope.$on('newedDBCard', function (_, cardname) {		
	});	
	//reverse new dashboard
	$scope.$on('unnewDBCard', function (_, cardname) {		
		var index =  vm.myddd.indexOf(cardname[0]);		
		//alert("vm.myddd index: " + index)
		if (index >= 0) {
  			vm.myddd.splice( index, 1 );
  		}
  		//set first dashboard in the dashboard list as the current dashboard
  		if(vm.myddd.length===0){
  			vm.currentDB = null;
  			$scope.$broadcast('currentDBChange', [vm.currentDB]);
  		} else {
  			vm.currentDB = vm.myddd[0];  			
  			$scope.$broadcast('currentDBChange', [vm.currentDB]);
  		}
	});	
	//prepare delete dashboard, delete dashboard localy
	$scope.$on('deleteDB', function (_, id) {	
		//delete Dashboard
		var index =  vm.myddd.indexOf(id[0]);		
		//alert("vm.myddd index: " + index)
		if (index >= 0) {
  			vm.myddd.splice( index, 1 );
  		}  		
  		//delete graphs of this dashboard
  		for (var i = 0; i < $scope.mygraphs.length; i++) {
  			if($scope.mygraphs[i].dashboard === id[0]){
  				$scope.mygraphs.splice( i, 1);
  			}
		}  		  		
  		//set first dashboard in the dashboard list as the current dashboard
  		if(vm.myddd.length===0){
  			vm.currentDB = null;
  			$scope.$broadcast('currentDBChange', [null]);
  		} else {
  			vm.currentDB = vm.myddd[0];
  			$scope.$broadcast('currentDBChange', [vm.currentDB]);  			
  		}	
	});	
	//successfully deleted, remove all local data
	$scope.$on('deletedDB', function (_, id) {		
		//remove all local data from vm.mygraphs slice, TODO this may be an error source, depending on how foreach works
	    /*check for eah graph wether it belongs to the dashboard, 
	     *if it belongs to the dashboard, use the slice method with 
	     *the index of the graph in the vm.mygraphs array*/	    
	    for (var graphItem of $scope.mygraphs) {
  			if(graphItem.dashboard === id[0]){
  				$scope.mygraphs.slice( $scope.mygraphs.indexOf(graphItem), 1);
  			}
		}	
	});	
	//not successfully deleted, append name to list again
	$scope.$on('undeleteDB', function (_, nameOfDashboardToUndelete) {
		//push dashboard back in the dashboard array
		vm.myddd.push(nameOfDashboardToUndelete[0]);
		//set former dashboard as the current dashboard
		vm.currentDB = nameOfDashboardToUndelete[0];  	
  		$scope.$broadcast('currentDBChange', [vm.currentDB]);
	});	
	//change property of a dashboard, like name or kathegorie
	$scope.$on('updateDB', function (_, id) {
	});
	//sucessfully changed property of a dashboard in the database
	$scope.$on('updatedDB', function (_, id) {
	});
	//unupdate(reverse) change property of a dashboard
	$scope.$on('unupdateDB', function (_, id) {
	});
	//prepare new graph
	$scope.$on('newGraph', function (_,_newGraph) {
		//add useremail and current dashboard to graph data
		//broadcast it to send it to the server
		//TODO make useremail and currentDB scope variables, this way, 
		//they dont need to be emitted upwards to be initialised
		var newGraph = _newGraph[0];		
		newGraph.useremail = vm.useremail;
		//current db comes with the user data
		//alert("in new graph "+vm.currentDB);
		newGraph.dashboard = vm.currentDB;		
		$scope.mygraphs.push(newGraph);  
		//alert("new"+JSON.stringify($scope.mygraphs))	  		
		$scope.$broadcast('newGraphBroadcast', [newGraph]);		
	});
  	//this is newed graph: update the first graph with lib updateChart.js
  	$scope.$on('updateAnalyticsChart', function (_, _graph ) {		
  		var graph = _graph[0];  		
  		//save graph to dashboard scope variable localy  
  		updateChart(graph);		  	
  	});
  	//reverse a new graph
	$scope.$on('unnewGraph', function (_, answer) {		
		var graphToUnNew = {db : answer[0].dashboard, graph : answer[0]};
		var index =  $scope.mygraphs.indexOf(graphToUnNew);		
		//alert("vm.myddd index: " + index)
		if (index >= 0) {
  			$scope.mygraphs.splice(index, 1);
  		}
	});		
	$scope.$on('deleteGraph', function (_, graph_and_name) {	
	    for (var i = 0; i < $scope.mygraphs.length; i++  ) {
  			if($scope.mygraphs[i].dashboard === graph_and_name[0] && $scope.mygraphs[i].name === graph_and_name[1]){
  				graphToDelete.push( $scope.mygraphs[i] );
  				$scope.mygraphs.splice( i, 1 );
  			}
		}
	});
	//successfully deleted, remove from temporary array
	$scope.$on('deletedGraph', function (_, graph_and_name) {
		for (var i = 0; i < $scope.mygraphs.length; i++  ) {
	  		if($scope.graphToDelete[i].dashboard === graph_and_name[0].dashboard && $scope.graphToDelete[i].name === graph_and_name[0].name){
	  			$scope.graphToDelete.splice( i, 1 );
	  		}
		}
	});
	//not successfully deleted, push graph to the list again
	$scope.$on('undeleteGraph', function (_, graph_and_name) {
		for (var i = 0; i < $scope.mygraphs.length; i++  ) {
  			if($scope.graphToDelete[i].dashboard === graph_and_name[0].dashboard && $scope.graphToDelete[i].name === graph_and_name[0].name){
  				$scope.mygraphs.push( $scope.graphToDelete[i] )
  			}
		}
	});
	//change property of a dashboard
	//successfully changed property of a dashboard in the database
	$scope.$on('updateGraph', function (_, id) {
	});
	//successfully changed property of a dashboard in the database
	$scope.$on('updatedGraph', function (_, id) {
	});
	//unupdate(reverse) change property of a dashboard
	$scope.$on('unupdateGraph', function (_, id) {
	});
	//set the rights on login, the right are the authorization of the user
	//this comes from the register service
  	$scope.$on('login', function (_, _user) {
		var user = _user[0];
		vm.myddd  = user.userdashboards; 		
  		vm.useremail = user.useremail;
    	vm.username = user.username;
    	vm.userrights = user.userrights; 
    	vm.useraccess = user.userrights;
    	$scope.useraccess = user.userrights;
    	setRights(user.userrights);  
    	//Set the user access and show or unshow the user buttons
    	SetAccess(user.useraccess);
    	//assign the start/ end date to the scope date variable for the datepicker
    	try{
    		$scope.mmdbStartDate = user.mmdbStartDate;
    	} catch (e){}
    	try{
    		$scope.mmdbEndDate = user.mmdbEndDate;
    	} catch (e){}
    	//assign the start/ end date to the scope date variable for the datepicker
    	try{
    		$scope.mmdbStartDate = user.mmdbStartDate;
    	} catch (e){} 
    	try{
    		$scope.mmdbEndDate = user.mmdbEndDate;
    	} catch (e){}
  		if(user.userdashboards.length > 0){
  			vm.currentDB =  user.userdashboards[0];
  			$scope.CDB = user.userdashboards[0];
  		}
    	var ngb = document.getElementById("newGraphButton");
  		var ngbd = document.getElementById("newGraphButtonDisabled");	
	  	if(vm.currentDB === null){
	  		ngb.style.display = 'none';	
	  		ngbd.style.display = 'block';
	  	} else {
	  		ngb.style.display = 'block';
	  		ngbd.style.display = 'none';	
	  	}	
  		var result = document.getElementById("topNavBlendInAtLogin");
  		result.style.visibility='visible';	
  		var result1 = document.getElementById("smallNavBlendInAtLogin");
  		result1.style.visibility='visible';
  		var result2 = document.getElementById("menu-toggle");
  		result2.style.visibility='visible';
   		var dplcss = document.getElementById("departmentListCSSSideBar");
  		dplcss.style.display='block';  	
 		var dblcss = document.getElementById("dashboardListCSSSideBar");
  		dblcss.style.display='none';  		
  		var dplao = document.getElementById("departmentListAOSideBar");
  		dplao.style.display='block';  	
  		var dblao = document.getElementById("dashboardListAOSideBar");
  		dblao.style.displayy='none';	
		var NgSidebar = document.getElementById("closeNgSidebar");
  		NgSidebar.style.display='block';  
  		//management and analytics dashboards switch
  		var ngViewindexXY = document.getElementById("index-analytics");
  		ngViewindexXY.style.display='none'; 
  	});
});
