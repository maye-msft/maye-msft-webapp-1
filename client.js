var axios = require('axios');
var count1 = 0;
var count2 = 0;
var count3 = 0;
var name = ""
var etag = ""
function req(data,ck) {
	
	axios({
	  method: 'post',
	  url: 'http://localhost:1337/blob/'+name,
	  data: data
	}).then(function (res) {
		console.log("client-id:"+data.clientId+"\t"+data.count+"\t"+res.data.name+"\t"+res.data.url );
	    name = res.data.name
	    
	    setTimeout(function(){
		    req({
			  	clientId: data.clientId,
			  	count : data.count+1,
			    date: (new Date())
		  	})
	  	}, 1000*Math.random())
	}).catch(function (error) {
	    console.log("client-id"+data.clientId+"\t"+error );
	    req(data)//retry
	});
}


count1++;
req({
  	clientId: "client 1",
  	count : count1,
    date: (new Date())
})	

setTimeout(function(){
	
		count2++;
		req({
		  	clientId: "client 2",
		  	count : count2,
		    date: (new Date())
	  	})	

}, 1000)

setTimeout(function(){
	
		count3++;
		req({
		  	clientId: "client 3",
		  	count : count3,
		    date: (new Date())
	  	})		

}, 2000)





