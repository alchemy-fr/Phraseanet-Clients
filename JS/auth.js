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
 * Phraseanet - Gestion du processus d'authentification
 */

(function(window) {

    PHRASEA.Auth = {

        /** Construit l'url d'authentification */
        buildAuthUrl: function(phraseanet, options) {
            var options = options || {};
            var auth_params = {
                redirect_uri: window.location.href,
                response_type: 'token',
                client_id: phraseanet.getApiKey()
            }
            
            //TODO setter un cookie pour dire qu'on est en train de se logguer sur ce phraseanet ?
			PHRASEA.Cookie.setRaw('phr_login', phraseanet.getApiKey(), 1988530800);

            return phraseanet.getAuthorizeEndpoint() + '?' + PHRASEA.QF.encode(jQuery.extend(auth_params, options), '&', true);
        },

        /** Décode l'url de réponse d'authentification */			
        readFragment: function(phraseanet) {
            var fragment;
			
			//TODO on est en train de se connecter sur ce phraseanet ?
			var phr_login = PHRASEA.Cookie.getRaw('phr_login');
			if (phr_login && phr_login == phraseanet.getApiKey()) {
				fragment = PHRASEA.QF.decode(window.location.hash.replace('%23', '#').replace('#', ''));
				PHRASEA.Cookie.clearRaw('phr_login');
			}
			
            return fragment;
        },

        /** Initialise la session */
        initSession: function(phraseanet, fragment) {				
            if (fragment) {
                if ('error' in fragment) {
                    throw ('Received auth error `' + fragment.error + '\': ' + fragment.error_description);
                }

                if ('access_token' in fragment) {
                    var session = {
                        oauth_token: fragment.access_token,
                        user: phraseanet.getApiKey()
                    };

                    phraseanet.setSession(session);

                    return true;
                }
            }

            return false;
        }
    };

})(window);
