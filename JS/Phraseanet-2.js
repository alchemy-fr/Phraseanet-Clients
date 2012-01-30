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



(function(window)
{

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
        this._session = {} || options.session || this._cookie.get();
        
        
        this._cookie = new Cookie(this);
        
        this._auth = new Auth(this);
        
		
        /** Permet de requêter le serveur */
        this._server =
        {		
     		// TODO 
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
        setSession: function(session)
        {
            this._session = session;
        },
		
        getSession: function()
        {
            return this._session;
        },
		
        getCookie: function()
        {
            return this._cookie;
        },
		
        /** Retourne l'objet Auth associé à l'objet Phraseanet courant */
        getAuth: function()
        {
            return this._auth;
        },
		
        /** Retourne le status connecté ou non de l'utilisateur */
        getStatus: function()
        {
            return this._session.access_token != null;
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
            this._cookie.clear();
            this._session = {};
        },
		
        /** Permet de faire les requêtes sur le serveur */
        api: function(path, method, params, callback)
        {
        //TODO
        },
		
        _query_formater: function(){
            return new QF();
        }
    };
	
})(window);
