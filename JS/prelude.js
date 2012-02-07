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

(function(window) {
	
//	if (!window.PHRASEA) {
		
		window.PHRASEA = {
			
			/**
			 * Objet qui contient les différentes instances de phraseanet.
			 */
			_instances: {},
			
			/**
			 * Enregistre une nouvelle instance de phraseanet
			 *
			 * @params name {String} identifiant
			 * @params domain {String} domain
			 * @params apiKey {String} clé publique
			 */
			registerInstance: function(name, domain, apiKey) {
				this._instances[name] = new Phraseanet({
					apiKey: apiKey,
					domain: domain
				});
				this._instances[name]._auth.initSession(this._instances[name]._auth.readFragment("#access_token=424242"));
				
				// juste pour les tests - à supprimer ensuite ?
				return this._instances[name];
			},
	
			/**
			 * Retourne l'instance de phraseanet correspondant à l'identifiant donné
			 *
			 * @params name {String} identifiant
			 * @return objet phraseanet correspondant ou null
			 */
			getInstance: function(name) {
				return this._instances[name];
			},
	
			/**
			 * Supprime l'instance en cours en vidant la session
			 *
			 * @params name {String} identifiant
			 * @return objet vide
			 */
			removeInstance: function(name) {
				return this._instances[name]._session = {};
			},
			
			/**
			 * Retourne la liste de toutes les instances,
			 * la fonction hasNext() retourne l'élément courant et avance à l'élément suivant
			 *
			 * @return liste des instances
			 */
			getInstances: function() {
				
				var list = {};
				
				for (id in this._instances) {
					list = list.push(id);
				}
	
				var	i = 0,
					list = list,
					length = list.length;			
	
				return {
					next: function() {
						var element;
						
						if (!this.hasNext()) {
							return null;
						}
						element = list[i];
						i = i + 1;
						return element;
					},
					
					hasNext: function() {
						return i < length;
					}
				};
			}

		};
		
//	};

})(window);


