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
 * Phraseanet - Gestion des cookies
 */

(function(window) {

    /**
	 * Constructeur de l'objet Cookie
	 * 
	 * @param phraseanet {Phraseanet} objet Phraseanet lié à l'objet Cookie
	 */
    var Cookie = function(phraseanet) {
        this._phraseanet = phraseanet;
    };

    Cookie.prototype = {

        /**
		 * Récupère la session dans les cookies
		 * 
		 * @return {Session} session de l'utilisateur connecté
		 */
        get: function() {
            
            var cookie = document.cookie.match('\\bphr_' + this._phraseanet._apiKey + '="([^;]*)\\b');
            var session;
            
            if (cookie) {
                session = this._phraseanet._query_formater.decode(cookie[1]);
            }
			
            return session;
        },

        /**
		 * Affecte un cookie contenant la session
		 */
        set: function() {
            var session = this._phraseanet.getSession();

            if (session) {
                var value = this._phraseanet._query_formater.encode(session);
                this.setRaw(value, 1988530800);
            }

        },

        /**
		 * Affecte un cookie contenant la valeur spécifiée
		 * 
		 * @param value {String} la valeur du cookie
		 * @param timestamp {Integer} timestamp pour l'expiration du cookie
		 */
        setRaw: function(value, timestamp) {
            document.cookie = 'phr_' + this._phraseanet._apiKey + '="' + value + '"'
            + (value && timestamp == 0 ? '' : '; expires=' + new Date(timestamp * 1000).toGMTString())
            + '; path=/';
        },

        /**
		 * Supprime le cookie
		 */
        clear: function() {
            this.setRaw('', 0);
        }
    };

    window.Cookie = Cookie;

})(window);
