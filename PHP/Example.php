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

require_once dirname(__FILE__) . 'Client.php';

$url = 'https://mydomain.tld/';
$clientId = '';
$clientSecret = '';

try
{
  //Configure transport object
  $curl = new CurlWrapper();
  $curl->setDefaultOptions();

  //Init p4 client
  $client = new PhraseanetClientApi($url, $clientId, $clientSecret, $curl);

  //Request
  $response = $client->call('/databoxes/list/', array(), 'GET');

  //Check response
  if ($response->isOk())
  {
    //Handle response content
    foreach ($response->getResult()->databoxes as $databox)
    {
      print "DATABOX " . $databox->databox_id . "\n";
      print "NAME " . $databox->name . "\n";
      print "VERSION " . $databox->version . "\n";
    }
  }
  else
  {
    //Handle response errors
    print $response->getHttpStatusCode() . "\n";
    print $response->getErrorMessage() . "\n";
    print $response->getErrorDetails() . "\n";
  }
}
catch (PhraseanetTransportException $e)
{
  //Handle transport errors
  print $e->getMessage() . "\n";
  //Get CURL exception
  if ($e->getPrevious() !== null)
    print $e->getPrevious->getMessage() . "\n";
}
catch (PhraseanetAuthException $e)
{
  //Handle Api Authentification errors
  print $e->getMessage() . "\n";
}
catch (PhraseanetApiException $e)
{
  //Handle Api errors
  print $e->getMessage() . "\n";
}
