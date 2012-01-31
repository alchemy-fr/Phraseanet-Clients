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
 * Phraseanet - Objet QF qui permet d'encoder et de décoder des paramètres oauth2
 */

(function(window)
{

    /**
	 * Constructeur de l'objet QF
	 */
    var QF = function(){};
	
    QF.prototype =
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
            encode = encode === false ? function(s) {
                return s;
            } : encodeURIComponent;
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
    };
    
    window.QF = QF;

})(window);
