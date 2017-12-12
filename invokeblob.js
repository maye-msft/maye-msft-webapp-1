var azure = require('azure-storage');
var blobSvc = azure.createBlobService("", "");
blobSvc.createContainerIfNotExists('mycontainer', {publicAccessLevel : 'blob'}, function(error, result, response){
    if(error){
    	console.log(error)
    	return;
    }
    blobSvc.createBlockBlobFromText('mycontainer', 'myblob', 'test', function(error, result, response){
	  if(error){
	    console.log(error)
    	return;
	  }
	  console.log(result)
	  console.log(response)
	});

});