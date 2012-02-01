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

(function(window)
{

    /**
	 * Constructeur de l'objet Auth
	 * 
	 * @param phraseanet {Phraseanet} objet Phraseanet lié à l'objet Auth
	 */
    var Auth = function(phraseanet)
    {
        this._phraseanet = phraseanet;
    };
	
    Auth.prototype =
    {
		
			
        /** Construit l'url d'authentification */
        buildAuthUrl: function (options)
        {
            var options = options || {};
            var auth_params =
            {
                redirect_uri: window.location.href,
                response_type: 'token',
                client_id: this._phraseanet._apiKey
            }
			            
            return this._phraseanet._domain.authorize + '?' + this._phraseanet._query_formater.encode(jQuery.extend(auth_params, options), '&', true);
        },

        /** Décode l'url de réponse d'authentification */			
        readFragment: function(hash)
        {
            var fragment = hash.replace('%23', '#').replace('#', '');
			
            return this._phraseanet._query_formater.decode(fragment);
        },

        /** Initialise la session */
        initSession: function(fragment)
        {				
            if (fragment)
            {
                if ('error' in fragment)
                {
                    throw ('Received auth error `' + fragment.error + '\': ' + fragment.error_description);
                }
                
                if ('access_token' in fragment)
                {
                    var session =
                    {
                        oauth_token: fragment.access_token,
                        user: this._phraseanet._apiKey
                    };
						
                    this._phraseanet.setSession(session);
                    this._phraseanet._cookie.set();
						
                    return true;
                }
            }
            
            return false;
        }
    };
    
    window.Auth = Auth;

})(window);
