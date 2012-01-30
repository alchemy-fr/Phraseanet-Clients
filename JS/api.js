/**
 * Phraseanet - 
 */

(function(window)
{

    /**
	 * Constructeur de l'objet Server
	 * 
	 * 
	 */
    var api = function(phraseanet)
    {
        this._phraseanet = phraseanet;
    };
	
    api.prototype =
    {
		
		
        /**
		 * 
		 * 
		 * 
		 */
        call: function(path, method, params, callback)
        {
        	if (path[0] === '/')
        	{
            	path = path.substr(1);
            }
        	
        	var method = method.toLowerCase();
        	
        	if (method !== 'get' && method !== 'post')
        		throw ('Invalid method passed to api(). Only GET or POST method are allowed.');
        	        	
        	var params = params || {};
        	
        	if (typeof callback !== 'function')
        		throw ('Invalid callback parameter passed to api(). Only a function is allowed.');
        	
        	this.api.oauthRequest(path, method, params, callback);
        },
        
        oauthRequest: function(path, method, params, callback)
        {
        	var session = this._phraseanet.getSession();
        	
        	if (session && session.access_token && !params.access_token)
        		params.access_token = session.access_token;
        }
	};
}