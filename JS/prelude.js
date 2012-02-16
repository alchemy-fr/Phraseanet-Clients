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

(function (window) {

	if (!window.PHRASEA) {

		window.PHRASEA = {

			/**
			 * Pour chaque pair propriété/valeur de cet objet,
			 * la propriété correspond au nom de l'instance et
			 * la valeur correspond à l'instance en elle même.
			 */
			_instances: {},

			/**
			 * Enregistre une nouvelle instance
			 *
			 * @param name {String} identifiant
			 * @param domain {String} domain
			 * @param apiKey {String} clé publique
			 */
			registerInstance: function(name, domain, apiKey) {
				this._instances[name] = new Phraseanet({
					apiKey: apiKey,
					domain: domain
				});
				
				PHRASEA.Cookie.save(); // TODO voir si on peut améliorer

				return this._instances[name];
			},

			/**
			 * Retourne l'instance correspondant à l'identifiant donné
			 *
			 * @param name {String} identifiant
			 * @return instance de phraseanet ou null
			 */
			getInstance: function(name) {
				return this._instances[name];
			},

			/**
			 * Supprime l'instance de la liste des instances
			 *
			 * @param name {String} identifiant
			 */
			removeInstance: function(name) {
				PHRASEA.Cookie.clearRaw('phr_' + name); // TODO créer une fonction pour ça dans Cookie
				delete this._instances[name];
			},

			/**
			 * Retourne un itérateur sur la liste de toutes les instances.
			 * L'itérateur dispose d'une méthode next() retournant l'entrée
			 * suivante ou null s'il n'y en a plus, et d'une méthode hasNext()
			 * retournant true/false selon qu'il y ait encore une instance
			 * de phraseanet ou non.
			 * 
			 * Une entrée se compose de :
			 * - name : le nom de l'instance
			 * - instance : l'instance de phraseanet
			 *
			 * @return itérateur sur la liste des instances
			 */
			getInstances: function() {

				var list = [];

				for (id in this._instances) {
					list.push(id);
				}

				var	i = 0,
					length = list.length,
					map = this._instances;

				return {
					next: function() {
						var key;

						if (!this.hasNext()) {
							return null;
						}
						key = list[i];
						i = i + 1;
						return {name:key, instance:map[key]};
					},

					hasNext: function() {
						return i < length;
					}
				};
			}

		};

	}

})(window);
