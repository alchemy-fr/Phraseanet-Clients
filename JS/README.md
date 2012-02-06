#Javascript SDK

Library for interacting with Phraseanet API

Still in development.

__Please, Do not use this library for the moment.__


* ##Register a phraseanet instance

```
PHRASEA.registerInstance(name, domain, apiKey);
```

* ##Get all registered instances from cookies

```
var instanceList = PHRASEA.getInstances();
var instance;
while (instance = instanceList.hasNext())
{
    //the current instance
}
```

* ##Get a previously registered instance

```
var myInstance = PHRASEA.getInstance(name, function(instance){
        if(instance)
        {
            return instance;
        }
        else
        {
            //handle errors
        }
    });
```
* ##Connect to the instance 

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

* ##Request to the instance 

```
myInstance.request("/path/", "METHOD", {params}, function(response){
        if(response.metas.http_code === 403)
        {
            //handle errors
        }
        else
        {
            datas = response.datas;
        }
    });
```

* ##logout to the instance

```
myInstance.logout(function(response){
    if(!response.error)
    {
        //user logout
    }
});
```