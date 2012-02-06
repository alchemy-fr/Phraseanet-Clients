Phraseanet Client Libraries
===========================

Phrasea
-

1. Register a phraseanet instance

```
PHRASEA.registerInstance(name, domain, apiKey);

```

2. Get all registered instances from cookies

```
var instanceList = PHRASEA.getInstances();
var instance;
while (instance = instanceList.hasNext())
{
    //the current instance
}

```

3. Get a previously registered instance

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
4. Connect to the instance 

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

5. Request to the instance 

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

6. logout to the instance

```
myInstance.logout(function(response){
    if(!response.error)
    {
        //user logout
    }
});
```