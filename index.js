var http = require('http');
var azure = require('azure-storage');
var express = require('express');
var shortid = require('shortid');
var bodyParser = require('body-parser')


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var blobSvc = azure.createBlobService("", "");
blobSvc.createContainerIfNotExists('mycontainer', {publicAccessLevel : 'blob'}, function(error, result, response){
    if(error){
    	console.log(error)
    	return;
    }


});

blobSvc.createContainerIfNotExists('mycontainerver', {publicAccessLevel : 'blob'}, function(error, result, response){
    if(error){
    	console.log(error)
    	return;
    }
});

var handleReqeust = function(req, res) {
	let name = req.params.name || shortid.generate()
	let version = 0
	let etag = null;
 	let cond = {};
	blobSvc.getBlobToText('mycontainerver', name,  function(error, content, blob){


	  if(error){
	    version = 1
	    console.log(error)
	  } else {
	  	version = parseInt(content)
	  	version++;
	  	cond = { accessConditions: { EtagMatch: blob.etag} }
	  }
	  version = version+"";
	  console.log(version)
		var waitTill = new Date(new Date().getTime() +  1000*Math.random());
		while(waitTill > new Date()){}
		  blobSvc.createBlockBlobFromText('mycontainerver', name, version, cond, function(error, result, response){
				if(error){
					res.status(500)
				    res.json(error);
			    	return;
				}
			  	blobSvc.createBlockBlobFromText('mycontainer', name+"/"+version, JSON.stringify(req.body), function(error, result, response){
					if(error){
						res.status(500)
				    	res.json(error);
			    		return;
					}

				  	res.json({name:name, url:"https://blobmayemsft.blob.core.windows.net/mycontainer/"+name+"/"+version});
				});
			});
		});


	


}

app.post('/blob/', function(req, res){
	handleReqeust(req, res);
});

app.post('/blob/:name', function(req, res){
	handleReqeust(req, res);
});



var port = process.env.PORT || 1337;
app.listen(port);

console.log("Server running at http://localhost:%d", port);
