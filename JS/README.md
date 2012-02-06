#Javascript SDK

Library for interacting with Phraseanet API

Still in development.

__Please, Do not use this library for the moment.__


* Register a phraseanet instance

```
PHRASEA.registerInstance(name, domain, apiKey);
```

* Get all registered instances from cookies

```
var instanceList = PHRASEA.getInstances();
var instance;
while (instance = instanceList.hasNext())
{
    //the current instance
}
```

* Get a previously registered instance

```
var myInstance = PHRASEA.getInstance(name);
```
* Connect to the instance 

```
myInstance.connect({options}, function(response){
        if(response.errors)
        {
            //handle errors
        }
        else
        {
            //connected
        }
    });
```

* Request to the instance 

```
myInstance.request("/path/", "METHOD", {params}, function(response){
        var instance = this;

        if(Math.floor(response.metas.http_code / 100) <= 3))
        {
            response = response.response;
        }
        elseif(response.metas.http_code === 403)
        {
            instance.connect();
        }
        else
        {
            //handle errors
            alert(response.metas.error_message, response.metas.error_detail);
        }
    });
```

* logout to the instance

```
myInstance.logout(function(){
    
        //logout
    
});
```