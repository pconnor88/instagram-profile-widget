;(function ( $, window, document, undefined ) {

    // Default settings
    var pluginName = "ProfileWidget",
        defaults = {
			username: null,
			clientID: null
        };

    // Constructor
    function ProfileWidget(element, options) {
        
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.apiurl = "https://api.instagram.com/v1/",
		this.userID = null,
		this.pictures = [],
		this.init();
		
    }

    ProfileWidget.prototype = {

        init: function() {
			
			if((this.settings.username !== null) && (this.settings.clientID !== null)) 
			{
				$(this.element).addClass("insta-profile-widget").append("<div class=\"insta-profile-images\"><div class=\"insta-profile-cell insta-profile-picture-slot\"></div><div class=\"insta-profile-cell insta-profile-picture-slot\"></div><div class=\"insta-profile-cell insta-profile-picture-slot\"></div><div class=\"insta-profile-cell insta-profile-picture-slot\"></div><div class=\"insta-profile-cell insta-profile-picture-slot\"></div><div class=\"insta-profile-cell insta-profile-picture-slot\"></div></div><div class=\"insta-profile-details\"><div class=\"insta-profile-icon\"></div><div class=\"insta-profile-avatar\"></div><h1 class=\"insta-profile-username\"></h1></div><div class=\"insta-profile-stats\"><div class=\"insta-profile-stat\"><strong></strong>Photos</div><div class=\"insta-profile-divider\"></div><div class=\"insta-profile-stat\"><strong></strong>Followers</div><a href=\"#\" class=\"insta-profile-btn\">View Profile</a></div>").find(".insta-profile-cell:nth-child(3n)").addClass("first");
				
				this.sendRequest("users/search",{q:this.settings.username},this.callbackUsername);
			} 
			else 
			{
				alert("Username and ClientID must be supplied");
			}
						
        },
		
		callbackImages: function(data, o) {
			
			$.each(data.data, function(i, item) {
				o.pictures.push(item.images.low_resolution.url);
			});
			
			var startPictures = o.pictures.slice(0);
			var pictureCount = 1;
			var slots = $(o.element).find(".insta-profile-picture-slot");
			
			slots.each(function() {
				
				if(pictureCount <= o.pictures.length) {
				
					var randomPic = Math.floor((Math.random() * startPictures.length));
					var image = startPictures[randomPic];
					
					startPictures.splice(randomPic,1);
					
					var index =  slots.index($(this));
										
					setTimeout(function() {
						o.fadeImage(index,image);
					},200 * pictureCount);
					
					pictureCount++;
				}
				
			});
			
			if(o.pictures.length > 6) {
			
				setInterval(function() {
					
					var unusedPictures = o.pictures.slice(0);
					
					slots.each(function() {
						unusedPictures.splice(unusedPictures.indexOf($(this).data("bg")),1);
					});
								
					var replaceTile = Math.floor((Math.random() * 6));
					var image = unusedPictures[Math.floor((Math.random() * unusedPictures.length))];
					
					o.fadeImage(replaceTile,image);
					
					
				}, 5000);
				
			}
			
		},
		
		callbackUserStats: function(data, o) 
		{

			$(o.element).find(".insta-profile-stat:eq(0) strong").text(data.data.counts.media.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			$(o.element).find(".insta-profile-stat:eq(1) strong").text(data.data.counts.followed_by.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
			o.sendRequest("users/" + o.userID + "/media/recent/", {count:18}, o.callbackImages);
			
		},
		
		callbackUsername: function(data, o) {

			if(data.data.length > 0) 
			{
				o.userID = data.data[0].id;
				$(o.element).find(".insta-profile-username").text(data.data[0].username);
				$(o.element).find(".insta-profile-avatar").append("<a href=\"https://instagram.com/" + data.data[0].username + "\"><img src=\"" + data.data[0].profile_picture + "\"></a>");
				$(o.element).find(".insta-profile-btn").attr("href", "https://instagram.com/" + data.data[0].username);
				o.sendRequest("users/" + o.userID + "/", {}, o.callbackUserStats);
				
			} 
			else 
			{
				alert("No user was found");
			}
			
			
		},
				
		sendRequest: function(url, params, callback) {
			
			params.client_id = this.settings.clientID
			var o = this;
			
			$.ajax({
				method: "GET",
				url: this.apiurl + url,
				data: params,
				dataType: "jsonp",
				success: function(data) {
					callback(data, o);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		},
		
		fadeImage: function(index,image) {
			var newTile = $("<div class=\"insta-profile-cell-image\" style=\"background-image: url(" + image + ");\"></div>");
				$(this.element).find(".insta-profile-picture-slot:eq(" + index + ")").append(newTile).children(".insta-profile-cell-image").fadeIn(500, function() {
				$(this).parent().css("background-image", "url(" + image + ")").data("bg", image);
				$(this).remove();
			});	
		},
		
		destroy: function() {
			
		}
		
    };
		
		

    //Plugin wrapper
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new ProfileWidget( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof ProfileWidget && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
	};
	
	
})( jQuery, window, document );