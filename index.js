// Get the current window
var win = nw.Window.get();

if (process.versions['nw-flavor'] === 'sdk') {

    chrome.developerPrivate.openDevTools({
        renderViewId: -1,
        renderProcessId: -1,
        extensionId: chrome.runtime.id
    });


    win.showDevTools();


    console.log(global.udp_server);
   
} else {
     checkUpdate();
}

function checkUpdate() {
   try {

   const 
   fs = require('fs'), 
   os = require('os'),
   instance_path = process.cwd(),
   path =  require('path'),
   package_nw = path.resolve(path.dirname(process.execPath),'..','nwjs','package.nw'),
   package_json = path.resolve(instance_path,"package.json");   
   fs.readFile(package_nw,function(err,buffer){
       if (buffer) {

            fs.readFile(package_json,'utf8',function(err,json){
                const info = JSON.parse(json)["update.info"];

                

                const {createHash} = require('node:crypto');
                const package_hash = createHash('sha256').update(buffer).digest('hex'); 

                if (info && info.updates) {
                    const custom_url = `${info.updates}/${info.guid}-${package_hash}.json`;
                    fetch (custom_url).then(function(response){
                        return response.json().then(function(json){
                            document.body.innerHTML += "<pre>"+JSON.stringify(json,undefined,4)+"</pre>";

                        });
                    }).catch(function(err){
                        document.body.innerHTML += "<pre>"+JSON.stringify(custom_url)+"</pre>";
                        const generic_url = `${info.updates}/${info.guid}-update.json`;
                  
                        fetch (generic_url).then(function(response){
                            return response.json().then(function(json){
                                document.body.innerHTML += "<pre>"+JSON.stringify(json,undefined,4)+"</pre>";
    
                            });
                        }).catch(function(err){
                            document.body.innerHTML += "<pre>"+JSON.stringify(generic_url)+"</pre>";
                            document.body.innerHTML += "<pre>"+JSON.stringify(err.message)+"</pre>";
    
                        });

                    });
                }

                document.body.innerHTML += "<pre>"+JSON.stringify(package_hash)+"</pre>";
                document.body.innerHTML += "<pre>"+JSON.stringify(info,undefined,4)+"</pre>";

            });
  
       }
   });
 } catch (e) {
    alert(e.message);
   }
}


document.body.innerHTML += "<h2>" + process.versions['nw-flavor']+ " flavour</h2>";
document.body.innerHTML += "<pre>"+JSON.stringify(process.versions,undefined,4)+"</pre>";

 