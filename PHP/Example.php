<?php

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
