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
        {
            throw ("You must provide an api key to use phraseanet API");
        }		

        if ("domain" in options === false)
        {
            throw ("Missing domain argument for phraseanet object");
        }

        if (typeof options !== 'object')
        {
            throw ('Invalid options for phraseanet object');
        }

        /** Initialise les propriétés de l'objet Phraseanet */

        this._apiKey = options.apiKey;

        var domain = options.domain.replace(/\/$/, '');

        this._domain =
        {
            www: domain,
            authorize: domain + "/api/oauthv2/authorize",
            token: domain + "/api/oauthv2/token"
        };

        /** Retourne l'objet QF associé à l'objet Phraseanet courant */		
        this._query_formater = new QF(this);

        this._cookie = new Cookie(this);

        /** Initialise la session */
        this._session = options.session || this._cookie.get() || {};

        /** Objet authentification **/
        this._auth = new Auth(this);

        /** Permet de requêter le serveur */
        this._server = new ApiServer(this);

        /** Retourne l'objet Tools associé à l'objet Phraseanet courant */
        this._tools = new Tools(this);
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

        /** Set l'objet session courant */
        setSession: function(session)
        {
            this._session = session;
        },

        /** Récupère l'objet session courant */
        getSession: function()
        {
            return this._session;
        },

		/** Vide l'objet session courant */
        clearSession: function()
        {
        	this._session = {};
        },

		/** Récupère le cookie */
        getCookie: function()
        {						
            return this._cookie;
        },

		/** Récupère l'Url d'authentification */
        getAuthenticationUrl : function(options)
        {
            return this._auth.buildAuthUrl(options);  
        },

        /** Retourne le status connecté ou non de l'utilisateur */
        isConnected: function()
        {
            return "oauth_token" in this._session && this._session.oauth_token !== null;
        },

        /** Permet de se connecter */
        connect: function(options, callback)
        {
			// TODO
		},

		/** Permet de faire les requêtes sur le serveur */
		request: function(path, method, params, callback)
		{
			this._server.call(path, method, params, callback);
		},

        /** Permet à un utilisateur de se déconnecter */
        logout: function()
        {
            this._cookie.clear();
            this._session = {};
        }

    };

})(window);
