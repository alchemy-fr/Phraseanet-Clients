/**
 * Phraseanet - Gestion des cookies
 */

(function(window)
{

    /**
	 * Constructeur de l'objet Cookie
	 * 
	 * @param phraseanet {Phraseanet} objet Phraseanet lié à l'objet Cookie
	 */
    var Cookie = function(phraseanet)
    {
        this._phraseanet = phraseanet;
    };
	
    Cookie.prototype =
    {
		
		
        /**
		 * Récupère la session dans les cookies
		 * 
		 * @return {Session} session de l'utilisateur connecté
		 */
        get: function()
        {
            
            var cookie = document.cookie.match('\\bphr_' + this._phraseanet._apiKey + '="([^;]*)\\b');
            var session;
            
            if (cookie)
            {
                session = this._phraseanet._query_formater.decode(cookie[1]);
            }
			
            return session;
        },
		
        /**
		 * Affecte un cookie contenant la session
		 */
        set: function()
        {
            var session = this._phraseanet.getSession();
		
            if (session)
            {
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
        setRaw: function(value, timestamp)
        {
            var domain = this._phraseanet._domain.www;
                
            var cookie_str = 'phr_' + this._phraseanet._apiKey + '="' + value + '"'
            + (value && timestamp == 0 ? '' : '; expires=' + new Date(timestamp * 1000).toGMTString())
            + '; path=/'
            //                        + (domain ? '; domain=.' + domain : '');

            document.cookie = cookie_str;
        
        },
		
        /**
		 * Supprime le cookie
		 */
        clear: function()
        {
            this.setRaw('', 0);
        }
    };

    window.Cookie = Cookie;

})(window);
