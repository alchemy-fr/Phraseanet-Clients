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
**/



(function( window ) {

	/** Constructeur de l'objet Phraseanet
	* @param {Object}	options			Paramètres nécessaires à la construction de l'objet Phraseanet
	* @param {String}	options.apiKey	Clé publique de l'api qui identifie un client
	* @param {String}	options.domain	Url de l'application
	**/	 
	var Phraseanet = function(options) {
	  
		/** Vérifie la présence des paramètres **/
		
		var options = options || {};
		
		if ("apiKey" in options === false)
			throw ("Missing apiKey argument");
		
		if ("domain" in options === false)
			throw ("Missing domain argument");
		
		if (typeof options !== 'object')
			throw ('Invalid options');
		
		/** Initialise les propriétés de l'objet Phraseanet **/
		
		this._apiKey = options.apiKey;
		
	    var domain = options.domain.replace(/\/$/, '');
	    
	    this._domain = {
			www: domain,
	    	authorize: domain + "/api/oauthv2/authorize",
	    	token: domain + "/api/oauthv2/token",
	    };
	    
		this._session = null;
		//TODO
		//TODO
		//TODO
			    
	    /** Objet qui gère l'authentification **/
	    this._auth = {
			phraseanet: window.phraseanet,
			
			/** Construit l'url de réponse d'authentification **/
			buildAuthUrl: function (options)
			{
				var options = options || {};
				var auth_params =
				{
					redirect_uri: window.location.href,
					response_type: 'token',
					client_id: phraseanet._apikey
				}
				return phraseanet._domain.authorize + '?' + phraseanet._query_formater.encode(jQuery.extend(auth_params, options), '&', true);
			},
			
			/** Récupère le token d'accès **/
		   	readFragment: function()
		   	{
		   		var h = window.location.hash.replace('%23', '#');
		   		var res = h.split("=");
		   		if(res.shift() === "access_token")
		   		{
		   			var access_token = res.pop();
		   			return access_token;
		   		}
		  	},
			
			/** Set la session **/
			setSession: function()
			{
				this.phraseanet._sesssion = this.initSession();
			}
			
			/** Initialise la session **/
			initSession: function()
			{
				var token = this.readFragment();
				if (token != null)
				{
					var session =
					{
						token: this.readFragment(),
						user: this.phraseanet._apiKey,
						errorCode: //TODO TODO TODO
					};
					return session;
				}
				return null;
			}
	    };
	    
	    /** Objet qui permet d'encoder et de décoder des paramètres oauth2 **/
	    this._query_formater = {
			
			/** Encode les paramètres en une chaine de requête
			* params	{objet}		paramètres à encoder
			* sep		{string}	séparateur (par défaut '&')
			* encode	{booléen}	indique si la key/value doit être en URI encodée
			* retour	{string}	la chaîne de requête
			**/
			encode: function(params, sep, encode)
			{
				params = params || {};
				sep = sep === undefined ? '&' : sep;
				encode = encode === false ? function(s) {return s;} : encodeURIComponent;
				var pairs = new Array();

				jQuery.each(params, function(key, value)
				{
					if (value !== null)
					{
						pairs.push(encode(key) + '=' + encode(value));
					}
				});
				pairs.sort();
				return pairs.join(sep);
			},
			
			/** Décode une chaîne de requête en un objet de paramètres
			* str		{string}	la chaine de requête
			* retour	{objet}		paramètres à encoder
			**/
			decode: function(str)
			{
				var	decode = decodeURIComponent,
					params = {},
					parts = str.split('&'),
					i,
					pair;
					
				for (i = 0; i < parts.length; i++)
				{
					pair = parts[i].split('=', 2);
					if (pair && pair[0])
					{
						params[decode(pair[0])] = pair[1] ? decode(pair[1].replace(/\+/g, '%20')) : '';
					}
				}
				return params;
			}
	    };
	    
	    this._server = null;
		//TODO
		//TODO
		//TODO

	};
	
	/** Prototype de l'objet Phraseanet */
	Phraseanet.prototype = {
		
		/** Version de l'api **/		 		
		_version: '0.1',
		
		/** Retourne la version de l'api **/
		getVersion: function()
		{
			return this._version;
		},
		
		/** Retourne l'objet session courant **/
		getSession: function()
		{
			return this._session;
		},
		
		/** Retourne le status connecté ou non de l'utilisateur **/
		getStatus: function()
		{
			return this._session !== null;
		}
		
		/** Permet à un utilisateur de se connecter **/
		login: function(options)
		{
			this.redirectTo(this._auth.buildAuthUrl(options))
		},
		
		RedirectTo: function(url)
		{
			window.location.href = url;
		}
		
		/** Permet à un utilisateur de se déconnecter **/
		logout: function()
		{
			return this._session = null;
		},
		
		/** Permet de faire les requêtes sur le serveur **/
		api: function(path, method, params, callback)
		{
		//TODO
		//TODO
		//TODO

		}
		
	};
	
	window.Phraseanet = Phraseanet;

})(window);
