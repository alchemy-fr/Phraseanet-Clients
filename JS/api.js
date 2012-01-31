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

/**
 * Phraseanet -  API de communication avec le serveur
 */

(function(window)
{

    /**
	 * Constructeur de l'objet API serveur
	 * 
	 * @param phraseanet {Phraseanet} objet Phraseanet lié à l'objet Cookie
	 */
    var ApiServer = function(phraseanet)
    {
        this._phraseanet = phraseanet;
    };
	
    ApiServer.prototype =
    {
		
        /**
		 * Effectue un appel serveur.
		 * 
		 * @param path      {String}   le chemin url
		 * @param method    {String}   la méthode http (get ou post)
		 * @param params    {Object}   les paramètres à passer à la requête http
		 * @param callback  {Function} la fonction callback de retour
		 */
        call: function(path, method, params, callback)
        {
            if (path[0] !== '/')
            {
                path = "/" + path;
            }
        	
            var method = method.toLowerCase();
        	
            if (method !== 'get' && method !== 'post')
            {
                throw ('Invalid method passed to api(). Only GET or POST method are allowed.');
            }
        	        	
            var params = params || {};
        	
            if (typeof callback !== 'function')
            {
                throw ('Invalid callback parameter passed to api(). Only a function is allowed.');
            }
        	
            return this.oauthRequest(path, method, params, callback);
        },
        
        /**
		 * Effectue un appel serveur en lui ajoutant le token d'accès.
		 * 
		 * @param path      {String}   le chemin url
		 * @param method    {String}   la méthode http (get ou post)
		 * @param params    {Object}   les paramètres à passer à la requête http
		 * @param callback  {Function} la fonction callback de retour
		 */
        oauthRequest: function(path, method, params, callback)
        {
            var session = this._phraseanet.getSession();
        	
            if (session && session.oauth_token && !params.oauth_token)
            {
                params.oauth_token = session.oauth_token;
            }
        	
            return this.PhrRequest(path, method, params, callback);
        },
        
        PhrRequest: function(path, method, params, callback)
        {
            var target = this._phraseanet._domain.www + path + "?callback=?";

            $.ajax({
                type: method,
                dataType: "jsonp",
                url: target,
                data: params,
                success : callback
            });
        }
    };

    window.ApiServer = ApiServer;

})(window);
