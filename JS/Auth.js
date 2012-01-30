/**
 * Phraseanet - 
 */

(function(window)
{

    /**
     * 
     * 
     * 
     */
    var Auth = function(phraseanet)
    {
        this._phraseanet = phraseanet;
    };
	
    Auth.prototype =
    {
		
			
        /** Construit l'url de réponse d'authentification */
        buildAuthUrl: function (options)
        {
            var options = options || {};
            var auth_params =
            {
                redirect_uri: window.location.href,
                response_type: 'token',
                client_id: phraseanet._apiKey
            }
				
            return phraseanet._domain.authorize + '?' + phraseanet._query_formater.encode(jQuery.extend(auth_params, options), '&', true);
        },
			
        readFragment: function()
        {
            var fragment = window.location.hash.replace('%23', '#').replace('#', '');
				
            return phraseanet._query_formater.decode(fragment);
        },
			
        initSession: function()
        {
            var fragment = this.readFragment();
				
            if (fragment)
            {
                if ('error' in fragment)
                    throw ('Received auth error `' + fragment.error + '\': ' + fragment.error_description);					
                if ('access_token' in fragment)
                {
                    var session =
                    {
                        access_token: fragment.access_token,
                        user: phraseanet._apiKey
                    };
						
                    phraseanet.setSession(session);
                    phraseanet._cookie.set();
						
                    return;
                }
            }
        }
	}
    
    window.Auth = Auth;

})(window);
