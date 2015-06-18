---
layout: post
title:  "API Documentation"
categories: jekyll update
style: bootstrap.css
---

* Table of Content
{:toc}

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
|company_id: |This is the ID used to identify you by Testello, it will be provided to you along with your secret.|
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

# Tests API
The Tests API can be accessed with the following URL:
  http://testello.com/api/v1/tests
  The Tests API supports the following actions:

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
|company_id: |This is the ID used to identify you by Testello, it will be provided to you along with your secret.|
|-----+-----------|

* * *

If this request is successful, it will return a hash that contains the key **data**, the value of this key will be an array of hashes that represents each test available.

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id   |The test’s ID, this is what should be used in creating sessions or listing test takers results later on|
|name |The name of the test. This will be a hash with the keys: “ar” and “en”. Each one’s value will be the exam’s name in Arabic, and English respectively|
|duration|This will be an integer representing the test’s full time in minutes|
|languages|This will be an array representing languages supported by the test|
|pass_percentage|This will be an integer representing the minimum percentage required to pass, if the test doesn’t have a pass percentage this field will have an empty value|
|-----+-----------|

* * *

### Examples
The following code retrieves all the tests for a company with ID **1**:  

#### Ruby
{% highlight ruby startinline=true %}
payload = { company_id: 1 }

# Sending the signed request:
send_request(payload, 'tests', @secret, "GET")
{% endhighlight %}

#### PHP
{% highlight php startinline=true %}
$payload = (array('company_id' => 1));

// Sending the signed request:
sendRequest($payload, 'tests', $secret, "GET");
{% endhighlight %}

#### Python
{% highlight python startinline=true %}
payload = { 'company_id': 1 }

# Sending the signed request:
send_request(payload, 'tests', secret, "GET")
{% endhighlight %}

#### ASP .NET C\#
{% highlight c# startinline=true %}
Dictionary<string, int> payload = 
            new Dictionary<string, int>();
payload.Add("company_id", 1);

// Sending the signed request:
sendRequest(payload, "tests", secret, "GET");
{% endhighlight %}

#### ASP .NET C++
{% highlight c++ startinline=true %}
Dictionary<String^, int^>^ payload = 
            gcnew Dictionary<String^, int^>();
payload->Add("company_id", 1);

// Sending the signed request:
sendRequest(payload, "tests", secret, "GET");
{% endhighlight %}

The following is an example of how a response might look:
{% highlight javascript %}
{
  "data": [
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
}
{% endhighlight %}

# Sessions API
The Sessions API can be accessed with the following URL:

  1. GET  http://testello.com/api/v1/sessions
  2. GET  http://testello.com/api/v1/sessions/:session_id
  3. POST http://testello.com/api/v1/sessions

  The Tests API supports the following actions:

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
|company_id: |This is the ID used to identify you by Testello, it will be provided to you along with your secret.|
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
The following code retrieves all the tests for a company with ID **1**:  

#### Ruby
{% highlight ruby startinline=true %}
payload = { company_id: 1 }

# Sending the signed request:
send_request(payload, 'sessions', @secret, "GET")
{% endhighlight %}

#### PHP
{% highlight php startinline=true %}
$payload = (array('company_id' => 1));

// Sending the signed request:
sendRequest($payload, 'sessions', $secret, "GET");
{% endhighlight %}

#### Python
{% highlight python startinline=true %}
payload = { 'company_id': 1 }

# Sending the signed request:
send_request(payload, 'sessions', secret, "GET")
{% endhighlight %}

#### ASP .NET C\#
{% highlight c# startinline=true %}
Dictionary<string, int> payload = 
            new Dictionary<string, int>();
payload.Add("company_id", 1);

// Sending the signed request:
sendRequest(payload, "sessions", secret, "GET");
{% endhighlight %}

#### ASP .NET C++
{% highlight c++ startinline=true %}
Dictionary<String^, int^>^ payload = 
            gcnew Dictionary<String^, int^>();
payload->Add("company_id", 1);

// Sending the signed request:
sendRequest(payload, "sessions", secret, "GET");
{% endhighlight %}

The following is an example of how a response might look:
{% highlight javascript %}
{
  "data": [
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
}
{% endhighlight %}

##  List Session Information (show)
The following table lists the keys that are required to request data of an *active* session the company has:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|id |This is the ID used to identify a session by Testello.|
|company_id |This is the ID used to identify you by Testello, it will be provided to you along with your secret.|
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
|score| This will be a string representing the overall score for this taken test|
|done | This will be a boolean representing the taken test is finished or not|
|link | This will be a string representing the taken test test url which will be used to continue the test in case something went wrong with your testing machine,  if the test is done this field will have an empty value|
|test_id|This will be an integer representing the ID of the exam taken|
|-----+-----------|

* * *

### Examples
The following code retrieves a session's information for a company with ID **1** and a session ID **9236**:  

#### Ruby
{% highlight ruby startinline=true %}
payload = { company_id: 1 }

# Sending the signed request:
send_request(payload, 'sessions/9236', @secret, "GET")
{% endhighlight %}

#### PHP
{% highlight php startinline=true %}
$payload = (array('company_id' => 1));

// Sending the signed request:
sendRequest($payload, 'sessions/9236', $secret, "GET");
{% endhighlight %}

#### Python
{% highlight python startinline=true %}
payload = { 'company_id': 1 }

# Sending the signed request:
send_request(payload, 'sessions/9236', secret, "GET")
{% endhighlight %}

#### ASP .NET C\#
{% highlight c# startinline=true %}
Dictionary<string, int> payload = 
            new Dictionary<string, int>();
payload.Add("company_id", 1);

// Sending the signed request:
sendRequest(payload, "sessions/9236", secret, "GET");
{% endhighlight %}

#### ASP .NET C++
{% highlight c++ startinline=true %}
Dictionary<String^, int^>^ payload = 
            gcnew Dictionary<String^, int^>();
payload->Add("company_id", 1);

// Sending the signed request:
sendRequest(payload, "sessions/9236", secret, "GET");
{% endhighlight %}

The following is an example of how a response might look:
{% highlight javascript %}
{
  "data": [
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
          "score": "78.0",
          "done": true,
          "link": "http://testello.com/start_test/AlaZddcMIvr1LhZx417czw",
          "test_id": 21
        },
        {
          "id": 3188,
          "score": "ESTJ",
          "done": true,
          "link": "http://testello.com/start_test/CyQ2dbQbZygu0YNOjgo-Jw",
          "test_id": 3
        },
        {
          "id": 3189,
          "score": "",
          "done": false,
          "link": "http://testello.com/start_test/1INCsRU37URAgpOWhKuQEQ",
          "test_id": 14
        }
      ]
    }
  ]
}
{% endhighlight %}

##  Create a new session (create)
The following table lists the keys that are required to create a new session:

* * *

|-----+-----------|
|Name |Description|
|-----|-----------|
|company_id |This is the ID used to identify you by Testello, it will be provided to you along with your secret.|
|session| This is a hash that contains the data required by Testello for creating a new session, the data needed in this hash are represented in the table below|
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



If this request is successful, it will return an empty hash, but the response *status* will be **201**.

* * *

### Examples
The following code creates a new session for a company with ID **1**:  

#### Ruby
{% highlight ruby startinline=true %}
payload = { company_id: 1, session: { quantity: 1, schema_params: { first_name: 'Jon', last_name: 'Snow', email: 'jon.snow@testello.com' }, expires_at: Date.today.end_of_month, test_id: 21, language: 'en' } } }

# Sending the signed request:
send_request(payload, 'sessions', @secret, "POST")
{% endhighlight %}

#### PHP
{% highlight php startinline=true %}
{% endhighlight %}

#### Python
{% highlight python startinline=true %}
{% endhighlight %}

#### ASP .NET C\#
{% highlight c# startinline=true %}
{% endhighlight %}

#### ASP .NET C++
{% highlight c++ startinline=true %}
{% endhighlight %}
