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
 * Phraseanet -  Tools
 */

(function(window) {

    window.PHRASEA.Tools = {

		popup: function(url, title, width, height) {
			var w = width || 500;
			var h = height || 350;

			var x = ((($(window).width()) / 2) - (w / 2));
			var y = ((($(window).height()) / 2) - (h / 2));

			window.open(url, title, "width=" + w + ", height=" + h + ", top=" + y + ", left=" + x);
		},

        redirectTo: function(url) {
            window.location.href = url;
        }

    };

})(window);
