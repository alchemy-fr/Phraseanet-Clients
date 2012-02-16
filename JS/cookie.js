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

    PHRASEA.Cookie = {
        
        load: function() {
			var exp = new RegExp('phr_([^=]+)=([^;]*)(;|$)', 'g');
			var results = document.cookie.match(exp);
			if (results != null) {
				for (var i = 0, iend = results.length; i < iend; ++i) {
					var results2 = results[i].match('(^|;) ?phr_([^=]+)=([^;]*)(;|$)');
					if (results2 != null) {
						var infos = PHRASEA.QF.decode(unescape(results2[3]));
						if (infos.domain && infos.apiKey)
							PHRASEA.registerInstance(results2[2], infos.domain, infos.apiKey);
					}
				}
			}
		},
		
		save: function() {
			var entries = PHRASEA.getInstances();
			var entry;
			while (entry = entries.next()) {
				this.setRaw('phr_' + entry.name, PHRASEA.QF.encode({
					domain:entry.instance.getDomain(),
					apiKey:entry.instance.getApiKey()
				}), 1988530800);
			}
		},
        
        /**
		 * Affecte un cookie à l'objet phraseanet courant
		 */
        set: function(phraseanet, value) {
            this.setRaw('phr_' + phraseanet.getApiKey(), PHRASEA.QF.encode(value), 1988530800);
		},
		
        /**
		 * Récupère la session dans les cookies
		 * 
		 * @return {value} valeur de la session de l'utilisateur connecté
		 */
		get: function(phraseanet) {
			var value = this.getRaw('phr_' + phraseanet.getApiKey());

			if (value) {
				value = PHRASEA.QF.decode(value);
			}
			
			return value || {};
		},
		
        /**
		 * Supprime le cookie de l'objet phraseanet courant
		 */
		clear: function(phraseanet) {
			this.clearRaw('phr_' + phraseanet.getApiKey());
		},
		
        /**
		 * Affecte un cookie contenant les valeurs spécifiées
		 * 
		 * @param name {String} nom du cookie
		 * @param value {String} valeur du cookie
		 * @param timestamp {Integer} timestamp pour l'expiration du cookie
		 */
        setRaw: function(name, value, timestamp) {
            document.cookie = name + '=' + escape(value)
            + (value && timestamp == 0 ? '' : '; expires=' + new Date(timestamp * 1000).toGMTString())
            + '; path=/';
        },
        
        getRaw: function(name) {			
			var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
			
			if (results) {
				return unescape(results[2]);
			}
			else {
				return null;
			}
		},

        /**
		 * Supprime le cookie nommé
		 */
        clearRaw: function(name) {
			this.setRaw(name, "", 0);
//            document.cookie = name + '=""; expires=0; path=/';
        }
    };

})(window);
