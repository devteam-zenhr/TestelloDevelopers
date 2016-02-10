---
layout: post
title:  "API Documentation"
style: bootstrap.css
---

<div id="sidebar-wrapper" markdown='1'>
* Table of Content
{:toc}
</div>

<div markdown='1' id='documentation'>
<div class="container-fluid" markdown='1'>
<div class="row" markdown='1'>
<div class="col-lg-12" markdown='1'>

# Core Concepts

## Authentication

All Testello API calls regardless GET or POST requests must be sent with a parameter that is called signed_request. This parameter must be the concatenation of three strings: a base64 url-encoded HMAC SHA-256 signature, a period, and a base64 url-encoded JSON string (the JSON string is the request string and is henceforth referred to as the payload). The signature provides a way to verify the authenticity of all the incoming requests by verifying the sender's identity.

Testello will provide you with a private key (secret) which must be used to sign your requests (generate the signature). All requests sent by you to the API must be signed correctly, otherwise, you will receive an error.

The appendix contains examples for signing requests in different programming languages which will demonstrate generating a signed_request and sending it to Testello.

A sample signed request string is provided below (each of the three parts is placed on a separate line to help identify them):

{% highlight bash %}
YjFmYTk2YzgzZWQwODE3YmU5ZTZiY2M3MWJjYTNjMjI3YzczMDMyYTk0N2M5NDc3NDQ5ZGQ3MzRkMjEzMWZjNw==
.
eyJjb21wYW55X2lkIjoxfQ==
{% endhighlight %}

The payload string must be a JSON-encoded hash (associative array, dictionary, etc.) which contains the request data. Each action will have different requirements for this hash. However, the following key is required by Testello’s API for all the requests it receives:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

## API Call Responses
Testello will respond to all API calls with a JSON encoded hash. The simplest response would be an empty hash, simply indicating success or no content, success responses will have a 200 response code for GET requests, 201 response code for POST requests, and a 204 response code for no content. However, the hash might contain one of the following keys:

* * *

|-------+-----------|
|Action |Description|
|-------|-----------|
|errors |The presence of this key indicates that an error occurred. This field’s value will be an array of strings.|
|data |For API calls that require a response with data, a data field will be provided that contains the requested data. The value of this field depends on the action, so check the relevant section for each action to learn more about its response’s data field.|
|-------+-----------|

* * *

# Company API
The Company API can be accessed with the following URL:
<p id="url">http://testello.com/api/v1/company</p>

The following table lists the keys that are required to request the company API:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents your company's information.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|credit   |This will be a hash that includes the quantity of your credits and it's expiry date, the quantity and expiry date will be your indicator in creating new sessions later on|
|test_taker_params |This will be a hash of hashes that includes your customized test taker schema, each hash will have the keys: “ar” and “en”. Each one’s value will be the name of your customized test taker attributes in Arabic and in English respectively, by default this hash will include first_name, last_name, and email|
|-----+-----------|

* * *

### Examples
The following code retrieves credit and test_taker_params for a company with ID **16**:  

#### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16 }

# Sending the signed request:
send_request(payload, 'company', @secret)
{% endhighlight %}

#### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, company_id' => 16));

// Sending the signed request:
sendRequest($payload, 'company', $secret, "GET");
{% endhighlight %}

#### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id': 22, 'company_id': 16 }

# Sending the signed request:
send_request(payload, 'company', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:
{% highlight javascript %}
{
  "credit": {
    "quantity": 10,
    "expires_at": "2016-06-19T00: 00: 00.000Z"
  },
  "test_taker_params": {
    "first_name": {
      "en": "first_name",
      "ar": "الاسم الأول"
    },
    "last_name": {
      "en": "last_name",
      "ar": "إسم العائلة"
    },
    "email": {
      "en": "email",
      "ar": "البريد الإلكتروني"
    }
  }
}
{% endhighlight %}


# Tests API
The Tests API can be accessed with the following URL:
<p id="url">http://testello.com/api/v1/tests</p>
  The Tests API supports the following action:

* * *

|-------+-----------|
|Action |Description|
|-------|-----------|
|index  |Lists all the tests the company has access to.|
|-------+-----------|

* * *

More details on the exact requirements of each action is provided below.

## Listing Tests
The following table lists the keys that are required to request a list of all tests the company has access to:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents each test available.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The test’s ID, this is what should be used in creating sessions or listing test takers results later on|
|name |The name of the test. This will be a hash with the keys: “ar” and “en”. Each one’s value will be the test’s name in Arabic, and English respectively|
|duration|This will be an integer representing the test’s full time in minutes|
|languages|This will be an array representing languages supported by the test|
|pass_percentage|This will be an integer representing the minimum percentage required to pass, if the test doesn’t have a pass percentage this field will have an empty value|
|-----+-----------|

* * *

### Examples
The following code retrieves all the tests for a company with ID **16**:  

#### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16 }

# Sending the signed request:
send_request(payload, 'tests', @secret)
{% endhighlight %}

#### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, 'company_id' => 16));

// Sending the signed request:
sendRequest($payload, 'tests', $secret, "GET");
{% endhighlight %}

#### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id': 22, 'company_id': 16 }

# Sending the signed request:
send_request(payload, 'tests', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:
{% highlight javascript %}
[
  {
    "id": 24,
    "name": {
      "en": "Numerical Reasoning Test",
      "ar": "الاختبار العددي"
    },
    "duration": 45,
    "pass_percentage": 49,
    "languages": [
      "en"
    ]
  },
  {
    "id": 16,
    "name": {
      "en": "Personality Assessment",
      "ar": "تقييم الشخصيه"
    },
    "duration": 30,
    "pass_percentage": 50,
    "languages": [
      "en",
      "ar"
    ]
  }
]
{% endhighlight %}

# Test Bundles API
The Test Bundles API can be accessed with the following URL:
<p id="url">http://testello.com/api/v1/test_bundles</p>
  The Test Bundles API supports the following action:

* * *

|-------+-----------|
|Action |Description|
|-------|-----------|
|index  |Lists all the test bundles the company have.|
|-------+-----------|

* * *

More details on the exact requirements of each action is provided below.

## Listing Test Bundles
The following table lists the keys that are required to request a list of all test bundles the company have:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents each test bundle available.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The test bundle's ID, this is what should be used in creating sessions or listing test takers results later on|
|name |The name of the test bundle.|
|test_ids|This will be an array representing the tests included in the test bundle|
|-----+-----------|

* * *

### Examples
The following code retrieves all test bundles for a company with ID **16**:  

#### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16 }

# Sending the signed request:
send_request(payload, 'test_bundles', @secret)
{% endhighlight %}

#### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, 'company_id' => 16));

// Sending the signed request:
sendRequest($payload, 'test_bundles', $secret, "GET");
{% endhighlight %}

#### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id': 22, 'company_id': 16 }

# Sending the signed request:
send_request(payload, 'test_bundles', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:

{% highlight javascript %}
[
  {
    "id": 3,
    "name": "Bundle X",
    "test_ids": [
      5,
      6
    ],
    "languages": [
    "en",
    "ar"
    ]
  }
]
{% endhighlight %}


# Sessions API
The Sessions API can be accessed with the following URLs:

<p id="url">http://testello.com/api/v1/sessions</p>
<p id="url">http://testello.com/api/v1/sessions/:session_id</p>

  The Sessions API supports the following actions:

* * *

|-------+-----------|
|Action |Description|
|-------|-----------|
|index  |Lists all *active* sessions the company has.|
|show   |Lists session information including tests that are being taken or already finished including the test takers information.|
|create |Creates a new session (single or mass).|
|-------+-----------|

* * *

More details on the exact requirements of each action is provided below.

## Listing Sessions (index)
The following table lists the keys that are required to request a list of all *active* sessions the company has:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents each *active* session available.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The session’s ID, this is what should be used when listing a session information later on|
|quantity |The quantity of the session. This will be an integer representing how many taken tests can be created from this session|
|link|This will be a string representing the session’s url which will be used to start a new test|
|expires_at|This will be a date and time string representing when the session will be expired|
|test_bundle_id|This will be an integer representing the ID of an exam bundle that this session was created from, if the session doesn’t have an exam bundle this field will have an empty value|
|test_ids|This will be an array representing the ID(s) of exam(s) that are included in this session|
|-----+-----------|

* * *

### Examples
The following code retrieves all the sessions for a company with ID **16**:  

#### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16 }

# Sending the signed request:
send_request(payload, 'sessions', @secret)
{% endhighlight %}

#### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, 'company_id' => 16));

// Sending the signed request:
sendRequest($payload, 'sessions', $secret, "GET");
{% endhighlight %}

#### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id' => 22, 'company_id': 16 }

# Sending the signed request:
send_request(payload, 'sessions', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:

{% highlight javascript %}
[
  {
    "id": 9236,
    "quantity": 16,
    "expires_at": "2015-06-30T12:23:29.000Z",
    "test_bundle_id": 108,
    "link": "http://testello.com/take_test/SYn54JcpC_baf8jCq8BJKw",
    "test_ids": [
      21,
      14,
      3,
      45
    ]
  },
  {
    "id": 9276,
    "quantity": 1,
    "expires_at": "2015-07-10T11:13:02.000Z",
    "test_bundle_id": null,
    "link": "http://testello.com/take_test/e8vBdsDzEBkVpXLZLMYM3A",
    "test_ids": [
      12
    ]
  }
]
{% endhighlight %}

##  List Session Information (show)
The following table lists the keys that are required to request data of an *active* session the company has:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id |This is the ID used to identify a session by Testello.|
|company_id |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents an *active* session information.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The session’s ID, this is what should be used when listing a session information later on|
|quantity |The quantity of the session. This will be an integer representing how many taken tests can be created from this session|
|link|This will be a string representing the session’s url which will be used to start a new test|
|expires_at|This will be a date and time string representing when the session will be expired|
|test_bundle_id|This will be an integer representing the ID of an exam bundle that this session was created from, if the session doesn’t have an exam bundle this field will have an empty value|
|test_ids|This will be an array representing the ID(s) of exam(s) that are included in this session|
|taken_tests|This will be an array containg all taken exams for this session, this object attributes are represented in the table below|
|-----+-----------|

* * *

### Taken tests attributes

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   | The taken test ID, this is what should be used when listing result information for a taken exam|
|score| The score of a taken test. This will be a hash representing the score of the taken test in both English and Arabic languages|
|done | This will be a boolean representing the taken test is finished or not|
|link | This will be a string representing the taken test test url which will be used to continue the test in case something went wrong with your testing machine,  if the test is done this field will have an empty value|
|test_id|This will be an integer representing the ID of the exam taken|
|-----+-----------|

* * *

### Examples
The following code retrieves a session's information for a company with ID **16** and a session ID **9236**:  

#### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16 }

# Sending the signed request:
send_request(payload, 'sessions/9236', @secret)
{% endhighlight %}

#### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, 'company_id' => 16));

// Sending the signed request:
sendRequest($payload, 'sessions/9236', $secret, "GET");
{% endhighlight %}

#### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id': 22, 'company_id': 16 }

# Sending the signed request:
send_request(payload, 'sessions/9236', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:

{% highlight javascript %}
[
  {
    "id": 9236,
    "quantity": 16,
    "expires_at": "2015-06-30T12:23:29.000Z",
    "test_bundle_id": 108,
    "link": "http://testello.com/take_test/SYn54JcpC_baf8jCq8BJKw",
    "test_ids": [
      21,
      14,
      3,
      45
    ]
    "taken_tests": [
      {
        "id": 3187,
        "score": {
          "en": "78.0 - Pass",
          "ar": "78.0 - نجاح"
        }
        "done": true,
        "link": "http://testello.com/start_test/AlaZddcMIvr1LhZx417czw",
        "test_id": 21
      },
      {
        "id": 3188,
        "score": {
          "en": "ESTJ",
          "ar": "ESTJ"
        }
        "done": true,
        "link": "http://testello.com/start_test/CyQ2dbQbZygu0YNOjgo-Jw",
        "test_id": 3
      },
      {
        "id": 3189,
        "score": {},
        "done": false,
        "link": "http://testello.com/start_test/1INCsRU37URAgpOWhKuQEQ",
        "test_id": 14
      }
    ]
  }
]
{% endhighlight %}

##  Create a new session (create)
The following table lists the keys that are required to create a new session:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id |This is the ID used to identify you by Testello.|
|session| This is a hash that contains the data required by Testello for creating a new session, the data needed in this hash are represented in the table below|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|-----+-----------|

* * *

### Session hash data

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|quantity|This field should be an integer, representing how many candidates you want to test in this session|
|expires_at|This field is a DateTime string, representing when do you want this session to be expired, please note that you can't have your session expire after your balance expiry date or time|
|test_id|This field should be an integer, representing the test you want your candidates to take|
|language|This field should be a string, representing the test language you want your candidates to take, if the test language does not exist a response with an error will be returned to you|
|schema_params| This field should be a hash, representing your test_taker_params, in case of mass session you should'nt include it|
|test_bundle_id|This field should be an integer, representing a test bundle you want to create a session from, you should leave the test_id field empty if you want to create a session from a test bundle and vise versa|
|-----+-----------|

* * *



If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that contains the session id and test link, the response *status* for this request will be **201**.

* * *

### Examples

#### Single sessions

##### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16, session: { quantity: 1, schema_params: { first_name: 'Jon', last_name: 'Snow', email: 'jon.snow@testello.com' }, expires_at: Date.today.end_of_month, test_id: 21, language: 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', @secret, "POST")
{% endhighlight %}

##### PHP
{:.no_toc}
{% highlight php startinline=true %}
$expires_at = mktime(0, 0, 0, date("m")+1  , date("d"), date("Y"));
$payload = (array('app_id' => 22, 'company_id' => 16, array('session' => 'quantity' => 1, (array('schema_params' => 'first_name' => 'Jon', 'last_name' => 'Snow', 'email' => 'jon.snow@testello.com')), 'expires_at' => $expires_at, 'test_id' => 21, 'language' => 'en'));

//Sending the signed request:
sendRequest($payload, 'sessions', $secret, "POST");
{% endhighlight %}

##### Python
{:.no_toc}
{% highlight python startinline=true %}
from datetime import date, timedelta

expires_at = date.today() + timedelta(30).strftime('%Y-%m-%d')
payload = { 'app_id': 22, 'company_id': 16, 'session': { 'quantity': 1, 'schema_params': { 'first_name': 'Jon', 'last_name': 'Snow', 'email': 'jon.snow@testello.com' }, 'expires_at': expires_at, 'test_id': 21, 'language': 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', secret, "POST")
{% endhighlight %}

#### Mass sessions

##### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16, session: { quantity: 10, expires_at: Date.today.end_of_month, test_id: 21, language: 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', @secret, "POST")
{% endhighlight %}

##### PHP
{:.no_toc}
{% highlight php startinline=true %}
$expires_at = mktime(0, 0, 0, date("m")+1  , date("d"), date("Y"));
$payload = (array('app_id' => 22, 'company_id' => 16, array('session' => 'quantity' => 10, 'expires_at' => $expires_at, 'test_id' => 21, 'language' => 'en'));

//Sending the signed request:
sendRequest($payload, 'sessions', $secret, "POST");
{% endhighlight %}

##### Python
{:.no_toc}
{% highlight python startinline=true %}
from datetime import date, timedelta

expires_at = date.today() + timedelta(30).strftime('%Y-%m-%d')
payload = { 'app_id': 22, 'company_id': 16, 'session': { 'quantity': 10, 'expires_at': expires_at, 'test_id': 21, 'language': 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', secret, "POST")
{% endhighlight %}

#### Mass test bundle sessions

##### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16, session: { quantity: 3, expires_at: Date.today.end_of_month, test_bundle_id: 108, language: 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', @secret, "POST")
{% endhighlight %}

##### PHP
{:.no_toc}
{% highlight php startinline=true %}
$expires_at = mktime(0, 0, 0, date("m")+1  , date("d"), date("Y"));
$payload = (array('app_id' => 22, 'company_id' => 16, array('session' => 'quantity' => 3, 'expires_at' => $expires_at, 'test_bundle_id' => 108, 'language' => 'en'));

//Sending the signed request:
sendRequest($payload, 'sessions', $secret, "POST");
{% endhighlight %}

##### Python
{:.no_toc}
{% highlight python startinline=true %}
from dateutil.relativedelta import relativedelta
from datetime import datetime

expires_at = datetime.now() + relativedelta(months=1)
payload = { 'company_id': 16, 'session': { 'quantity': 3, 'expires_at': expires_at, 'test_bundle_id': 108, 'language': 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', secret, "POST")
{% endhighlight %}

The following is an example of how a response might look:

{% highlight javascript %}
[
  {
    "id": 18749,
    "test_link": "https://testello.com/en/take_test/omQxvYBGqY4TVpH7dUx9FY2"
  }
]
{% endhighlight %}

# Results API
The Results API can be accessed with the following URL:

  <p id="url">http://testello.com/api/v1/results</p>

  The Results API supports the following actions:

* * *

|-------+-----------|
|Action |Description|
|-------|-----------|
|index  |Lists all results for a certain test and/or for certain taken tests|
|-------+-----------|

* * *

More details on the exact requirements of the action is provided below.

## Listing Results (index)
The following table lists the keys that are required to request a list of results:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|test_id|This field should be an integer and is mandatory for a successful results API call, representing the test you want to retrieve it's results|
|taken_test_ids: |This will be an array representing the ID(s) of taken test(s) you want to retrieve it's results|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents each result for a test.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The taken test ID, this is what should be used when retrieving a result for a certain taken test(s)|
|score |The score of a taken test. This will be a hash representing the score of the taken test in both English and Arabic languages|
|duration|This will be an integer representing the time it took a candidate to finish the test in minutes|
|test_taker|This will be a hash that includes a data hash of your test taker schema. Each one’s value will be the one of your customized test taker attributes, by default the data hash will include first_name, last_name, and email|
|test|This will be a hash that includes the test id, name, and duration|
|-----+-----------|

* * *

### Examples
The following code retrieves the results of a test with ID **21** for a company with ID **16**:

#### Retrieving all results for a test

##### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16, test_id = 21 }

# Sending the signed request:
send_request(payload, 'results', @secret)
{% endhighlight %}

##### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, 'company_id' => 16, 'test_id' => 21));

// Sending the signed request:
sendRequest($payload, 'results', $secret, "GET");
{% endhighlight %}

##### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id': 22, 'company_id': 16, 'test_id': 21 }

# Sending the signed request:
send_request(payload, 'results', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:

{% highlight javascript %}
[
  {
    "id": 13119,
    "start_time": "2015-02-11T18:30:21.566Z",
    "duration": 39,
    "score": {
      "en": "130 - Superior Intelligence"
    },
    "test_taker": {
      "data": {
        "email": "john.jack@testello.com",
        "last_name": "Snake",
        "first_name": "John"
      }
    }
  },
  {
    "id": 13106,
    "start_time": "2015-01-27T09:01:32.915Z",
    "duration": 59,
    "score": {
      "en": "140 - Genius or near genius"
    },
    "test_taker": {
      "data": {
        "email": "jon.snow@testello.com",
        "last_name": "Snow",
        "first_name": "Jon"
      }
    }
  },
  {
    "test": {
      "id": 21,
      "name": {
        "en": "IQ Test",
        "ar": "إختبار الذكاء (IQ)"
      },
      "duration": 60
    }
  }
]
{% endhighlight %}

#### Retrieving all results for taken test(s)

##### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { app_id: 22, company_id: 16, test_id = 21, taken_test_ids: [13106, 13119] }

# Sending the signed request:
send_request(payload, 'results', @secret)
{% endhighlight %}

##### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('app_id' => 22, 'company_id' => 16, 'test_id' => 21, 'taken_test_ids' => array(13106, 13119)));

// Sending the signed request:
sendRequest($payload, 'results', $secret, "GET");
{% endhighlight %}

##### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'app_id': 22, 'company_id': 16, 'test_id': 21, 'taken_test_ids': [13106, 13119] }

# Sending the signed request:
send_request(payload, 'results', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:
{% highlight javascript %}
[
  {
    "id": 13106,
    "score": {
      "en": "140 - Genius or near genius"
    },
    "start_time": "2015-01-27T09:01:32.915Z",
    "duration": 58,
    "test_taker": {
      "data": {
        "email": "jon.snow@testello.com",
        "last_name": "Snow",
        "first_name": "Jon"
      }
    }
  },
  {
    "id": 13119,
    "score": {
      "en": "130 - Superior Intelligence"
    },
    "start_time": "2015-02-11T18:30:21.566Z",
    "duration": 58,
    "test_taker": {
      "data": {
        "email": "john.jack@testello.com",
        "last_name": "Snake",
        "first_name": "John"
      }
    }
  },
  {
    "test": {
      "id": 34,
      "name": {
        "en": "IQ Test",
        "ar": "إختبار الذكاء (IQ)"
      },
      "duration": 60
    }
  }
]
{% endhighlight %}

# Test Takers API
The Test Takers API can be accessed with the following URL:

  <p id="url">http://testello.com/api/v1/test_takers</p>

  The Test Takers API supports the following actions:

* * *

|-------+-----------|
|Action |Description|
|-------|-----------|
|index  |Lists all results for a certain test taker|
|-------+-----------|

* * *

More details on the exact requirements of the action is provided below.

## Listing results for a test taker(index)
The following table lists the keys that are required to request a list of test taker results:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id: |This is the ID used to identify you by Testello.|
|app_id: |This is the id to allow you access the API, it will be provided to you along with your secret.|
|test_taker_email|This field should be a string and is mandatory for a successful test takers API call, representing the test taker email you want to retrieve results for|
|-----+-----------|

* * *

If this request is successful, it will return an Array of hashes, each hash will represent a taken test this test taker has taken.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The taken test ID, this is what should be used when retrieving a result for a certain taken test(s)|
|score |The score of a taken test. This will be a hash representing the score of the taken test in both English and Arabic languages|
|start_time|A time stamp that represent when the test was started|
|duration|This will be an integer representing the time it took a candidate to finish the test in minutes|
|test|This will be a hash that includes the test id, name, and duration|
|result_link| This will be a hash of result links per result language|
|-----+-----------|

* * *

### Examples
The following code retrieves the results of a test taker with email **john.jack@testello.com** for a company with ID **16**:  

#### Retrieving all results for a test

##### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
payload = { company_id: 16, test_taker_email: 'john.jack@testello.com' }

# Sending the signed request:
send_request(payload, 'test_takers', @secret)
{% endhighlight %}

##### PHP
{:.no_toc}
{% highlight php startinline=true %}
$payload = (array('company_id' => 16, 'test_taker_email' => 'john.jack@testello.com'));

// Sending the signed request:
sendRequest($payload, 'test_takers', $secret, "GET");
{% endhighlight %}

##### Python
{:.no_toc}
{% highlight python startinline=true %}
payload = { 'company_id': 16, 'test_taker_email': 'john.jack@testello.com' }

# Sending the signed request:
send_request(payload, 'test_takers', secret, "GET")
{% endhighlight %}

The following is an example of how a response might look:

{% highlight javascript %}
[
  {
    "id": 13119,
    "start_time": "2015-02-11T18:30:21.566Z",
    "duration": 39,
    "score": {
      "en": "130 - Superior Intelligence"
    },
    "test": {
      "id": 21,
      "name": {
        "en": "IQ Test",
        "ar": "إختبار الذكاء (IQ)"
      },
      "duration": 60
    },
    "result_link": {
      "en": "https://testello_results.com/7rmtytFxzq6v9oaL%2FW8L1LYMQwE%3D"
    }
  }
]
{% endhighlight %}
# Appendix

## What we need from you

### Callback URL

Once a Test Taker finishes a test, **Testello** will initiate a POST request to your specified callback URL, the request will be signed with the secret we provided you with, the request body will include a payload hash that contains the test id, taken test id, and result link.

### Redirection URL

Once a Test Taker finishes a test, **Testello** will add a link that will redirect the user back to your website.

## Sending a signed request

Below are simple examples that demonstrate sending an API call to Testello

### Ruby
{:.no_toc}
{% highlight ruby startinline=true %}
def send_request(payload, api, secret, method='GET')
  payload = payload.to_json
  params = { signed_request: "#{Base64.urlsafe_encode64(OpenSSL::HMAC.hexdigest('sha256', secret, payload))}.#{Base64.urlsafe_encode64(payload)}" }
  uri = URI("http://www.testello.com/api/v1/#{api}")
  accept = Mime::JSON
  res = ''

  if method == 'POST'
    req = Net::HTTP::Post.new(uri)
    req['Accept'] = accept
    req.set_form_data(params)

    res = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(req)
    end
  elsif method == 'GET'
    uri.query = URI.encode_www_form(params)
    req = Net::HTTP::Get.new(uri)
    req['Accept'] = accept
    res = Net::HTTP.start(uri.hostname, uri.pori) { |http| http.request(req) }
  else
    raise 'Unsupported method'
  end
  # Do something with res
end
{% endhighlight %}

### PHP
{:.no_toc}
{% highlight php startinline=true %}
<?php
function send_request($data, $api, $secret, $method) { 
  $payload     = json_encode($data);
  $signature   = hash_hmac('sha256', $payload, $secret);
  $b64Payload = base64_encode($payload);
  $b64Sig     = base64_encode($signature);
  $signedRequest = $b64Sig . '.' . $b64Payload;

  $url = 'http://www.testello.com/api/v1' . $api;
  $params = 'signed_request=' . urlencode($signedRequest);

  // Open connection
  $connection = curl_init();

  curl_setopt($connection, CURLOPT_HTTPHEADER, array('Accept' => 'application/json'));
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
  if($method == 'POST') {
    //set the url, number of POST vars, POST data
    curl_setopt($connection, CURLOPT_URL, $url);
    curl_setopt($connection, CURLOPT_POST, 1);
    curl_setopt($connection, CURLOPT_POSTFIELDS, $params);
  } elseif($method == 'GET') {
    curl_setopt($connection, CURLOPT_URL, $url . '?' . $.params);
  } else {
    echo "Unsupported Method";
  }

  // Send request
  $result = curl_exec($connection);

  // Close connection
  curl_close($connection);

  parse_response($result);
}
?>
{% endhighlight %}

### Python
{:.no_toc}
{% highlight python startinline=true %}
import base64
import json
import requests
import hashlib
import hmac
from datetime import date, timedelta

def send_request(payload, api, secret, method='GET'):
    headers = {'Accept': 'application/json'}
    payload = json.dumps(payload)
    signature = base64.urlsafe_b64encode(hmac.new(secret, payload.encode('utf-8'), hashlib.sha256).hexdigest())
    uri = "http://www.testello.com/api/v1/%(api)s" %locals()
    res = requests.request(method, url, params={'signed_request': signature + '.' + base64.urlsafe_b64encode(payload)}, headers=headers)
    # Do something with res
end
{% endhighlight %}


## Debugging

We added support to respond with prettified JSON to help you read the responses you are receiving from our servers.
To receive a prettified JSON response just add   ```pretty: true``` to your payload hash.
</div>
</div>
</div>
</div>
