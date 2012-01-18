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

	/**
	* Constructeur de l'objet Phraseanet
	* 
	* @constructor		
	* @param {Object}	options			Paramètres nécessaires à la construction de l'objet Phraseanet
	* @param {String}	options.apiKey	Clé publique de l'api qui identifie un client
	* @param {String}	options.domain	Url de l'application
	*/	 
	window.Phraseanet = function(options)
	{
		
		/** Vérifie la présence des paramètres */
		
		var options = options || {};
		
		if ("apiKey" in options === false)
			throw ("You must provide an api key to use phraseanet API");
		
			
		if ("domain" in options === false)
			throw ("Missing domain argument for phraseanet object");
		
		if (typeof options !== 'object')
			throw ('Invalid options for phraseanet object');
		
		/** Initialise les propriétés de l'objet Phraseanet */
		
		this._apiKey = options.apiKey;
		
		var domain = options.domain.replace(/\/$/, '');
		
		this._domain =
		{
			www: domain,
			authorize: domain + "/api/oauthv2/authorize",
			token: domain + "/api/oauthv2/token",
		};
	    
	    /** Objet session */
		this._session = {};
		
		var phraseanet = this;
		
		/** Fonctions relatives au processus d'authentification
		 *
		 *  Definies au sein de l'objet auth
		 */
		this._auth =
		{
			
			/** Construit l'url de réponse d'authentification */
			buildAuthUrl: function (options)
			{
				var options = options || {};
				var auth_params =
				{
					redirect_uri: window.location.href,
					response_type: 'token',
					client_id: phraseanet._apiKey
				}
				return phraseanet._domain.authorize + '?' + phraseanet._query_formater.encode(jQuery.extend(auth_params, options), '&', true);
			},
			
			readFragment: function()
			{
				var fragment = window.location.hash.replace('%23', '#').replace('#', '');
				
				var session = phraseanet._query_formater.decode(fragment);
		   		
		   		this.initSession(session);
			},
			
			initSession: function(session)
			{
				
				if (!session)
					throw ("Received invalid session");
				
				if ('error' in session)
					throw ('Received auth error `' + session.error + '\': ' + session.error_description);
				
				phraseanet.setSession(session);
			}
		};
		
		/** Permet de requêter le serveur */
		this._server =
		{
			
			oauthRequest: function(path, method, params, callback)
			{
				var session = phraseanet.getSession();
				
				if (session && session.access_token && !params.access_token)
					params.access_token = session.access_token;
				
				// TODO 
			}
		};

	};
	
	/** Prototype de l'objet Phraseanet */
	Phraseanet.prototype =
	{
		
		/** Version de l'api */		 		
		_version: '0.1',
		
		/** Retourne la version de l'api */
		getVersion: function()
		{
			return this._version;
		},
		
		/** Retourne l'objet session courant */
		getSession: function()
		{
			return this._session;
		},
		
		setSession: function(session)
		{
			 this._session = session;
		},
		
		/** Retourne l'objet Auth associé à l'objet Phraseanet courant */
		getAuth: function()
		{
			return this._auth;
		},
		
		/** Retourne le status connecté ou non de l'utilisateur */
		getStatus: function()
		{
			return this._session !== null && this._session.access_token != null;
		},
		
		/** Permet à un utilisateur de se connecter */
		login: function(options)
		{
			this.redirectTo(this._auth.buildAuthUrl(this, options));
		},
		
		redirectTo: function(url)
		{
			window.location.href = url;
		},
		
		/** Permet à un utilisateur de se déconnecter */
		logout: function()
		{
			return this._session = null;
		},
		
		/** Permet de faire les requêtes sur le serveur */
		api: function(path, method, params, callback)
		{
			if (method != 'get' && method != 'post')
				throw ('invalid method passed to api(). Only get or post method are allowed.');
			
			params = params || {};
			
			this._server.oauthRequest(path, method, params, callback);
		},
		
		/**
		 * Objet qui permet d'encoder et de décoder des paramètres oauth2
		 */
		_query_formater:
		{
			
			/**
			 * Encode les paramètres en une chaine de requête
			 * 			 
			 * @param {Object} params Paramètres à encoder
			 * @param {String} sep Séparateur (par défaut '&')
			 * @param {Boolean} encode Indique si la key/value doit être en URI encodée
			 * @returns {String} La chaîne de requête
			 */
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
			
			/**
			 * Décode une chaîne de requête en un objet de paramètres
			 * 			 
			 * @param {String} str La chaine de requête
			 * @returns {Object} Paramètres à encoder
			 */
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
			
		}
		
	};
	
})(window);


