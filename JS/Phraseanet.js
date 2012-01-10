/**
 * Phraseanet Client Librarie
 * Copyright (C) 2004 Alchemy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * PhraseanetClientApi - Provide easy easy access to Phraseanet API
 * 
 * @author https://github.com/alchemy-fr
 * @copyright (c) 2004 Alchemy
 * @licence Licensed under GPL license.
 * @see http://phraseanet.com/license
 * @see http://developer.phraseanet.com
 * @version 1.0
 * @link https://github.com/alchemy-fr/Phraseanet-Clients
 * 
 */



(function( window ) {

	//constructor
  var Phraseanet = function(options) {
  
    this.version = '0.1';
  
  	var options = options || {};
  	
  	//session information utilisateur = utilisateur non connecte
  	this.session = null;
  	
  	if("apiKey" in options === false)
  	{
  		throw ("Missing apiKey argument");
  	}
  	
  	if("domain" in options === false)
  	{
  		throw ("Missing domain argument");	
  	}
  	
    this.apiKey = options.apiKey;
    
    var instance = options.domain.replace(/\/$/, '');
    
    this.domain = 
	{
		instance: instance,
    	authorize_endpoint: instance + "/api/oauthv2/authorize",
    	token_endpoint: instance + "/api/oauthv2/token",
    } 
  };
  
  var Auth = function (instance){
  
  	var phraseanet = instance;

  	this.buildAuthUrl = function (options){
   			var options = options || {};

   			var auth_params = {
   				redirect_uri: window.location.href,
   				response_type: "token",
   				client_id: phraseanet.apiKey	
   			}

   			return phraseanet.domain.authorize_endpoint + '?' + phraseanet.query_formater.encode(jQuery.extend(auth_params, options), '&', true);
   		};
   		
   	this.readFragment = function(){
   		var h = window.location.hash.replace('%23', '#');
   		var res = h.split("=");
   		if(res.shift() === "access_token")
   		{
   			var access_token = res.pop();
   		}
  	};
  }
  
  Phraseanet.prototype = {
  
    getVersion : function(){
      
      return this.version;
    },
    
    isConnected: function(){
    	return session !== null;
    },
    
   	getSession: function(){
   		return this.session;
   	},
   	
   	logout: function(){
   		this.session = null;
   		return;
   	},
   	
   	login: function(options){
   		this.redirectTo(this.getAuth().buildAuthUrl(options))
   	},
   	
   	redirectTo: function(url){
   		window.location.href = url;
   	},
   	
   	getAuth: function(){
   		return new Auth(this)
   	},
   	
   	//encode et decode une url
   	query_formater: {
   		encode: function(params, sep, encode)
    	{
    		params = params || {};
    		
        	sep = sep === undefined ? '&' : sep;
        	
        	encode = encode === false ? function(s) {return s;} : encodeURIComponent;
			
        	var pairs = new Array();
        	
        	jQuery.each(params, function(key, val){
        	
            	if (val !== null)
            	{
                	pairs.push(encode(key) + '=' + encode(val));
            	}
   			});
   			
        	pairs.sort();
        	
        	return pairs.join(sep);
    	},
    	
		decode: function(str){
		
		}   		
   	}    
    
  };

  window.Phraseanet = Phraseanet;

})(window);

	

