------------------------------
------------------------------

#DUE TO INSTAGRAM UPDATING THEIR API ON THE 01/06/2016, THIS PLUGIN CAN NO LONGER USE THE CLIENT ID TOKEN TO ACCESS THE INSTAGRAM API, SO WILL NOT DISPLAY ANY PROFILE INFORMATION OR IMAGES

------------------------------
------------------------------



#Instagram Profile Widget

A jQuery Instagram profile widget for your website.

##Usage

**Firstly, to be able to use this plugin, you must head over to the Instagram Developer area and create a new client as you will need a client ID to be able to fetch data from Instagram. It is easy to do and will only take a few minutes. http://instagram.com/developer/clients/register/**

**Make a note of the client ID you are given once you have registered as you will need it later.**

Add the following tags into the head element of your website:

```html
<head>
	<link href='http://fonts.googleapis.com/css?family=Lato:300,400|Roboto:400,500,600,700' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="css/profile-widget.min.css">
	<script type="text/javascript" src="js/jquery.profile-widget.min.js"></script>
</head>
```

The container for the plugin is just an empty `div` placed where you want the widget to appear on the page.

```html
<div id="widget"></div>
```

To initiate the plugin add the following code into your document.ready function. Replace the username with your Instagram username and the clientID with the one you were given when you registered your client on the Instagram Developer page.

```javascript
$("#widget").ProfileWidget({
	username: "user123",
	clientID: "xxxxxxxxxxxxxxxxxxxxxx"
});
```

##Demo

You can see a live demo here: http://pconnor88.github.io