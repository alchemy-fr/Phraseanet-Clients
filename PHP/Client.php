<?php

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
 * PhaseanetClientApi - Provide easy easy access to Phraseanet API
 * 
 * @author https://github.com/alchemy-fr
 * @copyright (c) 2004 Alchemy
 * @licence Licensed under GPL license.
 * @see http://phraseanet.com/license
 * @see http://developer.phraseanet.com
 * @version 1.0
 * @link https://github.com/alchemy-fr/PhraseanetApiClient
 * 
 */
require_once dirname(__FILE__) . '/CurlWrapper/CurlWrapper.php';

/**
 * PhaseanetClient do not handle how access token is stored on client side
 * It's up to you to implement your favorite method (session, database, file etc ..)
 * 
 * Define getAccessToken in the way you want retrieve a previous stored token
 * Define setAccessToken in the way you want store your access stoken
 * 
 */
abstract class PhraseanetApi
{

  /**
   * Retieve a stored token
   * @return mixed
   */
  public abstract function getAccessToken();

  /**
   * Store a fresh acces token
   * return PhraseanetApi
   */
  public abstract function setAccessToken($token);
}

/**
 * !! Phraseanet API client needs the curl library to run !!
 * @link http://www.php.net/manual/fr/book.curl.php
 * 
 * PhraseanetApi use a dedicated object to handle HTTP REQUEST.
 * This allow you to fully configure on how your http request will be executed using curl options
 * Or resolve some problematics like (proxies, SSL certificate, cookies etc ..)
 *   
 */
class PhraseanetClientApi extends PhraseanetApi
{
  const VERSION = '1.0';

  /**
   * Phraseanet API Endpoint
   * @var string
   */
  const API_ENDPOINT = '/api/v1';
  const TOKEN_ENDPOINT = '/api/oauthv2/token';
  const AUTH_ENDPOINT = '/api/oauthv2/authorize';

  /**
   * Oauth grant type
   */
  const GRANT_TYPE_AUTHORIZATION = 'authorization_code';

  public
  /**
   * Activate debug output
   */
  $debug = false,
  /**
   * The API endpoint URL
   */
  $apiEndpointUrl = '',
  /**
   * The OAuth authorization server endpoint URL
   */
  $oauthAuthorizeEndpointUrl = '',
  /**
   * The OAuth token server endpoint URL
   */
  $oauthTokenEndpointUrl = '';

  /**
   * A CurlWrapper which handle your personnal curl configuration 
   * and performs HTTP requests to the Phraseanet API
   * @see https://github.com/Svyatov/CurlWrapper for more informations
   * @var CurlWrapper 
   */
  protected $curl;

  /**
   * Api credentials
   * Info Keys :
   *   key: the api client key access
   *   secret: the api scret key access
   * @var array
   */
  protected $apiAccess;

  /**
   * Choosen grant type
   * @var string 
   */
  protected $grantType;

  /**
   * Associated infos to the choosen grant type
   * @var array 
   */
  protected $grantInfo;

  /**
   * To create an API key/secret pair, go to your account adminstation panel
   * in your phraseanet application.
   * 
   * @param string $instanceUrl
   * @param string $apiKey
   * @param string $apiSecret
   * @param CurlWrapper $curl 
   */
  public function __construct($instanceUrl, $apiKey, $apiSecret, CurlWrapper $curl)
  {
    if (!$this->isValidUrl($instanceUrl))
    {
      throw new InvalidArgumentException(sprintf('%s is not a valid url', $instanceUrl));
    }
    $url = rtrim($instanceUrl, '/');
    $this->apiEndpointUrl = sprintf('%s%s', $url, self::API_ENDPOINT);
    $this->oauthAuthorizeEndpointUrl = sprintf('%s%s', $url, self::AUTH_ENDPOINT);
    $this->oauthTokenEndpointUrl = sprintf('%s%s', $url, self::TOKEN_ENDPOINT);
    $this->url = $url;
    $this->apiAccess['key'] = $apiKey;
    $this->apiAccess['secret'] = $apiSecret;
    $curl->addOption(CURLOPT_VERBOSE, $this->debug);
    $this->curl = $curl;
  }

  /**
   * @Override this method to run the client 
   */
  public function getAccessToken()
  {
    return null;
  }

  /**
   * @Override this method to run the client 
   */
  public function setAccessToken($token)
  {
    return $this;
  }

  /**
   * Return the CurlWrapper which handle HTTP requests to the Phraseanet API
   * @return CurlWrapper 
   */
  public function getCurl()
  {
    return $this->curl;
  }

  /**
   *
   * @param type $curl
   * @return PhaseanetClientApi 
   */
  public function setCurl(CurlWrapper $curl)
  {
    $this->curl = $curl;
    return $this;
  }

  /**
   * Change the default grant type.
   * 
   * !! Only PhaseanetClientApi::GRANT_TYPE_AUTHORIZATION is currently supported !!
   * 
   * @param string type the API grant type
   * @param $info array info associated to the chosen grant type
   * Info Keys:
   * - redirect_uri: if $type is PhaseanetClientApi::GRANT_TYPE_AUTHORIZATION, this key can be provided. If omited,
   *                 the current URL will be used. Make sure this value have to stay the same before
   *                 the user is redirect to the authorization page and after the authorization page
   *                 redirected to this provided URI (the token server will change this).
   * 
   * @return PhaseanetClientApi
   * @throws InvalidArgumentException if bad grant type provided
   */
  public function setGrantType($type, Array $info = null)
  {
    switch ($type)
    {
      case self::GRANT_TYPE_AUTHORIZATION:
        if (!isset($info['redirect_uri']))
        {
          $info['redirect_uri'] = $this->getCurrentUrl();
        }
        break;
      default:
        throw new InvalidArgumentException(sprintf('Only %s grant type is currently supported', self::GRANT_TYPE_AUTHORIZATION));
    }
    $this->grantType = $type;
    $this->grantInfo = $info;

    return $this;
  }

  /**
   * Build the Authorisation Url
   * 
   * @param array $scope the requested scope
   * @return string the authorization url 
   * @throws RuntimeException if bad grant type provided
   */
  public function getAuthorizationUrl(Array $scope = array())
  {
    if ($this->grantType !== self::GRANT_TYPE_AUTHORIZATION)
    {
      throw new RuntimeException('This method can only be used with TOKEN grant type.');
    }

    $oauthParams = array(
        'response_type' => 'code'
        , 'client_id' => $this->apiAccess['key']
        , 'redirect_uri' => $this->grantInfo['redirect_uri']
        , 'scope' => implode(' ', $scope)
    );

    $url = http_build_query($oauthParams, null, '&');

    return sprintf('%s?%s', $this->oauthAuthorizeEndpointUrl, $url);
  }

  /**
   * 
   * Retrieve your access Token from your callback endpoint
   * Use $_GET globale variable
   * 
   * @return void
   * 
   * @throws PhraseanetAuthException if error occurs during authentication
   * @throws PhraseanetTransportException if problem occurs with transport layer
   * @throws PhraseanetAuthRequiredException if client do not auth himself
   */
  public function retrieveAccessToken()
  {
    /**
     *  If no grant type defined, the request will not be authenticated
     */
    if ($this->grantType === null)
    {
      return;
    }

    $token = $this->getAccessToken();

    if (trim($token) !== '' && $token !== null)
    {
      return;
    }

    try
    {
      if ($this->grantType === self::GRANT_TYPE_AUTHORIZATION)
      {
        if (isset($_GET['code']))
        {
          $args = array(
              'grant_type' => 'authorization_code',
              'client_id' => $this->apiAccess['key'],
              'client_secret' => $this->apiAccess['secret'],
              'scope' => $this->grantInfo['scope'],
              'code' => $_GET['code'],
              'redirect_uri' => $this->grantInfo['redirect_uri'],
          );

          $response = $this->getCurl()->post($this->oauthTokenEndpointUrl, $args);
          $token = json_decode($response);
          $this->setAccessToken($token["access_token"]);
        }
        elseif (isset($_GET['error']))
        {
          throw new PhraseanetAuthException($_GET['error']);
        }
        else
        {
          // Ask the client to request end-user authorization
          throw PhraseanetAuthRequiredException();
        }
      }
    }
    catch (CurlWrapperException $e)
    {
      throw new PhraseanetTransportException('HTTP request was Unexecutable', $e->getCode());
    }
    return;
  }

  /**
   * 
   * Destroy stored token
   * 
   * @return PhraseanetClientApi 
   */
  public function logout()
  {
    $this->setAccessToken(null);
    return $this;
  }

  /**
   * 
   * Call a remote Phraseanet API method
   * 
   * @param string $path remote path
   * @param array $args request parameters
   * @param string $http_method http method
   * @return PhraseanetApiResponse
   * 
   * @throws PhraseanetApiException if error occurs with phraseanet API
   * @throws PhraseanetTransportException if problem occurs with transport layer
   */
  public function call($path, $args = array(), $http_method = 'POST')
  {
    $this->getCurl()->addHeader('Accept', 'application/json');

    //Unauthenticated request
    $url = sprintf('%s%s', $this->apiEndpointUrl, $path);

    if ($this->getAccessToken() !== null)
    {
      $url = sprintf('%s?oauth_token=%s', $url, $this->getAccessToken());
    }

    try
    {
      switch (strtoupper($http_method))
      {
        case 'POST' :
          $response = $this->getCurl()->post($url, $args);
          break;
        case 'GET' :
          $response = $this->getCurl()->get($url, $args);
          break;
        case 'HEAD' :
        case 'PUT' :
        case 'DELETE' :
        case 'PUT' :
        case 'TRACE' :
        case 'CONNECT' :
          throw new PhraseanetApiException(sprintf('Phraseanet API do not support %s method', $http_method));
          break;
        default :
          throw new PhraseanetTransportException(sprintf('Unknow %s HTTP method', $http_method));
          break;
      }
      return new PhraseanetApiResponse(json_decode($response));
    }
    catch (CurlWrapperException $e)
    {
      throw new PhraseanetTransportException('HTTP request was Unexecutable', $e->getCode());
    }
  }

  /**
   * Returns the current URL, removing of known OAuth parameters that should not persist.
   *
   * @return String the current URL
   */
  protected function getCurrentUrl()
  {
    $secure = false;
    if (isset($_SERVER['HTTPS']))
    {
      $secure = strtolower($_SERVER['HTTPS']) === 'on' || $_SERVER['HTTPS'] == 1;
    }
    elseif (isset($_SERVER['HTTP_SSL_HTTPS']))
    {
      $secure = strtolower($_SERVER['HTTP_SSL_HTTPS']) === 'on' || $_SERVER['HTTP_SSL_HTTPS'] == 1;
    }
    elseif (isset($_SERVER['HTTP_X_FORWARDED_PROTO']))
    {
      $secure = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https';
    }
    $scheme = $secure ? 'https://' : 'http://';
    $currentUrl = $scheme . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

    $parts = parse_url($currentUrl);

    // Remove oauth callback params
    $query = '';
    if ($parts['query'] !== '')
    {
      parse_str($parts['query'], $params);
      foreach (array('code', 'scope', 'error', 'error_description') as $name)
      {
        unset($params[$name]);
      }
      if (count($params) > 0)
      {
        $query = '?' . http_build_query($params, null, '&');
      }
    }
    // Use port if non default
    $port = isset($parts['port']) && ($secure ? $parts['port'] !== 80 : $parts['port'] !== 443) ? ':' . $parts['port'] : '';
    // rebuild
    return $scheme . $parts['host'] . $port . $parts['path'] . $query;
  }

  /**
   * Check if an url is valid
   * @param array $url 
   * @return boolean
   */
  private function isValidUrl($url)
  {
    return filter_var($url, FILTER_VALIDATE_URL);
  }

}

/**
 * 
 * Handle Response from a Phraseanet API call
 */
class PhraseanetApiResponse
{

  /**
   *
   * @var stdClass
   */
  protected $result;

  /**
   *
   * @var stdClass
   */
  private $meta;

  /**
   *
   * @param stdClass $response 
   */
  public function __construct(stdClass $response)
  {
    if (!isset($response->meta))
    {
      throw new PhraseanetApiException('An Error occured from api server');
    }

    if (!isset($response->response))
    {
      throw new PhraseanetApiException('An Error occured from api server');
    }

    $this->meta = $response->meta;
    $this->result = $response->response;
  }

  /**
   * Return the result of the response
   * @return stdClass 
   */
  public function getResult()
  {
    return $this->result;
  }

  /**
   * Return the HTTP code
   * @return int 
   */
  public function getHttpStatusCode()
  {
    return (int) $this->meta->http_code;
  }

  /**
   * Check id the Response is a success
   * @return int 
   */
  public function isOk()
  {
    return floor($this->getHttpStatusCode() / 100) < 4;
  }

  /**
   * Get error message if present
   * @return mixed 
   * Return the Error message if present
   * Return null
   */
  public function getErrorMessage()
  {
    return $this->meta->error_message;
  }

  /**
   * Get error detail if present
   * @return mixed 
   * Return the Error details if present
   * Return null
   */
  public function getErrorDetails()
  {
    return $this->meta->error_details;
  }

  /**
   * Get Response time 
   * @return DateTime 
   */
  public function getResponseTime()
  {
    return new DateTime($this->meta->response_time);
  }

  /**
   * Get requested URI
   * @return string
   */
  public function getUri()
  {
    $request = explode(' ', $this->meta->request);
    return $request[1];
  }

  /**
   * Get Requested method
   * @return string 
   */
  public function getMethod()
  {
    $request = explode(' ', $this->meta->request);
    return $request[0];
  }

  /**
   * Get Response charset
   * @return string 
   */
  public function getCharset()
  {
    return $this->meta->charset;
  }

  /**
   * get API version
   * @return string 
   */
  public function getApiVersion()
  {
    return $this->meta->api_version;
  }

}

class PhraseanetApiException extends Exception
{
  
}

class PhraseanetTransportException extends PhraseanetApiException
{
  
}

class PhraseanetAuthException extends PhraseanetApiException
{
  
}

class PhraseanetAuthRequiredException extends PhraseanetAuthException
{
  
}

