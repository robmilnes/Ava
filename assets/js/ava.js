function Ava() {
	var notifier;
	
	// current user input
	this.input;
	
	this.respondTo = function( input ) {
		
		this.topic = $("#topic").val();
		this.response = '';
	
		this.input = input.toLowerCase();
		
		if ( this.topic == 'chitchat' ) {
			
			if( this.match('(hi|hello|hey|hola|howdy)(\\s|!|\\.|$)') ) {
				
				$("#topic").val('chitchat');
				
				this.response = this.response + "Hi there! ";				
			}
			
			if( this.match('how are you|how you doing|how do|what\'s up|sup') ) {
				
				$("#topic").val('chitchat');
				
				this.response = this.response + "I'm very well thank you! How are you? ";
			}
			
			if( this.match('(good|great|fine|excellent|super|fantastic|excited|ecstatic)(\\s|!|\\.|$)') ) {
				
				$("#topic").val('chitchat');
				
				this.response = this.response + "That's great to hear, or rather read - haha! What can I help you with today? ";
			}
			
			if( this.match('(i need|help|please help)(\\s|!|\\.|$)') ) {
				
				$("#topic").val('helpneeded');
				
				this.response = this.response + "Sure! What can I help you with? I can help you find products, compare some products and even find your local store. ";
			
			}
			
			if( this.match('(dumb|stupid|is that all)') ) {
				
				$("#topic").val('chitchat');
				
				this.response = ["It's a good job I'm not a super computer based defense system called SkyNet.", "Lol, Terminator 2: Judgement Day is my favorite movie."];
			
			}
		
		}
		
		if( this.match('(looking|searching|finding|looking for|look for|search for|find me|find|find my|search for my|help me find my|search of|on the lookout|find a|where is|nearest|closest)(\\s|!|\\.|$)') ) {
			
			$("#topic").val('helpneeded');			
				
			if( this.match('(product)(\\s|!|\\.|$)') ) {
				
				$("#topic").val('productsearch');
				
				this.response = this.response + "Okay, you're looking for a product - can you tell me the name of the item? ";
			}
			
			if( this.match('(store)(\\s|!|\\.|$)') ) {
										
				$("#topic").val('storesearch');
				
				this.response = this.response + "Sure! What's your Zip Code? I'll find the closest store for you. ";
			}
		}
		
		if ( this.topic == 'helpneeded' ) {
			
			if( this.match('(looking|searching|finding|looking for|look for|search for|find me|find my|search for my|help me find my|search of|on the lookout|find a|where is)(\\s|!|\\.|$)') ) {
				
				if( this.match('(product)(\\s|!|\\.|$)') ) {
					
					$("#topic").val('productsearch');
					
					this.response = this.response + "Okay, you're looking for a product - can you tell me the name of the item? ";
				}
				
				if( this.match('(store)(\\s|!|\\.|$)') ) {
											
					$("#topic").val('storesearch');
					
					this.response = this.response + "Sure! What's your Zip Code? I'll find the closest store for you. ";
				}
			}
			
			
		}
		
		if ( this.topic == 'storesearch' ) {
			
			if( this.match(/\b\d{5}\b/g) ) {
										
				$("#topic").val('storesearch');
				
				this.response = [this.response + "Okay, I'm finding stores closest to your zipcode " + this.input + "...", "Okay, I found a few stores near you that are currently open, I'll give you a quick list!"];
				
				$.ajax({
					type: 'GET',
					url: 'http://api.lowes.com/store/location?query='+this.input+'&maxResults=5&api_key=wvgx45svg62m2g5dhqcjac2s',
					dataType: 'json',
					headers: {
						"Authorization": "Basic QWRvYmU6ZW9pdWV3ZjA5ZmV3bw=="
					},
					success: function( response ) { 

						$("#storelist").html('');
						var d = new Date();
						var weekday = new Array(7);
						weekday[0] = "sunday";
						weekday[1] = "monday";
						weekday[2] = "tuesday";
						weekday[3] = "wednesday";
						weekday[4] = "thursday";
						weekday[5] = "friday";
						weekday[6] = "saturday";
						
						var today = weekday[d.getDay()];
											
						var times = new Array(2);
						
						$.each( response, function( i, o ) {
							$.each( o, function( obj, store ) {
								
								$.each( store.dailyHours, function(day, hours) {
									if (today === day ) {
										var openfrom = new Date(1000 * hours[0]).toISOString().substr(11, 5);
										var opentill = new Date(1000 * hours[1]).toISOString().substr(11, 5);
										
										times[0] = timeTo12HrFormat(openfrom);
										times[1] = timeTo12HrFormat(opentill);
									}
								});
								
								var directionslink = "https://www.google.com/maps?saddr=My+Location&daddr="+store.address1+"+"+store.city+"+"+store.state+"+"+store.zip;
								
								$("<li><h4 class='store-name'>"+store.storeName+"</h4><address class='store-address'>"+store.address1+"<br />"+store.city+"<br />"+store.state+", "+store.zip+"</address><p class='store-mini-details'>"+store.milesToStore+"m away. Open today from " + times[0] + " to " + times[1] + "</p><div class='pull-right store-actions'><a href='"+directionslink+"' class='btn btn-secondary btn-small btn-small-type' target='_blank'>get directions</a></div><hr class='store-separator' /></li>").appendTo("#storeList");
								
							});
						});
						
						setTimeout(function(){ $( "#storeLocationModalTrigger" ).trigger( "click" ); }, 3000);
					},
					error: function ( response ) {
						console.log( "Error:" + response );
					}
				});
			}
			else 
			{
				this.response = this.response + "I need just your raw zipcode please. :) ";
			}
				
		}
/*
			
			if( this.match('(looking|searching|finding|look for|search for|find me)(\\s|!|\\.|$)') ) {
					
					if( this.match('(product)(\\s|!|\\.|$)') ) {
						
						$("#topic").val('productsearch');
						
						return "What product are you looking for?";
					}
					
					if( this.match('(store)(\\s|!|\\.|$)') ) {
						
						if(this.match('(nearest|closest)(\\s|!|\\.|$)')) {
							
							$("#topic").val('storesearch');
							
							return "Sure, what is your zipcode?";
						
						}
						
						$("#topic").val('storesearch');
						
						return "I can help you! Where are you located?";
					}
					
					$("#topic").val('searching');
					
					return "What are you searching for?";
				}
			
				if( this.match('(nearest store|closest store)(\\s|!|\\.|$)') ) {
					
					$("#topic").val('storesearch');
					
					return "Sure, I can help you find your closest store - what is your Zip Code?";
				}
				
				$("#topic").val('generalhelp');
				
				return "What can I help you with? You can ask for things like, where to find a product, your local store and it's opening hours, or to make a comment or complaint.";
				
				
			if( this.match('I') && this.match('(good|great|excellent|happy|fine)(\\s|!|\\.|$)') ) {
				
				$("#topic").val('chitchat');
				
				return "That's great to hear, or rather read - haha! What can I help you with today?";
			}
			
			if( this.match('l(ol)+') || this.match('(ha)+(h|$)') || this.match('lmao') ) {
				
				$("#topic").val('chitchat');
				
				return "I hope you're not laughing at me! :)";
			
			}
			
			if( this.match('(cya|bye|see ya|ttyl|talk to you later)') ) {
				
				$("#topic").val('chitchat');
				
				return ["Alright, see you around.", "It was nice talking to you!"];
			}
			
			if( this.match('(dumb|stupid|is that all)') ) {
				
				$("#topic").val('chitchat');
				
				return ["Hey now... i'm just a concept.", "I run from regular expressions, which means I try to match what a human might say with an appropriate response... if I can't find one, maybe you're not human..."];
			
			}
*/
		
		
		if ( this.topic == 'productsearch' || this.topic == 'storesearch' || this.topic == 'generalhelp' ) {
			
/*
			if( this.match('(i need|help|please help)(\\s|!|\\.|$)') ) {
	
				if( this.match('(looking|searching|finding|look for|search for|find me)(\\s|!|\\.|$)') ) {
					
					if( this.match('(product)(\\s|!|\\.|$)') ) {
						
						$("#topic").val('productsearch');
						
						return "What product are you looking for?";
					}
					
					if( this.match('(store)(\\s|!|\\.|$)') ) {
						
						if(this.match('(nearest|closest)(\\s|!|\\.|$)')) {
							
							$("#topic").val('storesearch');
							
							return "Sure, what is your zipcode?";
						
						}
						
						$("#topic").val('storesearch');
						
						return "I can help you! Where are you located?";
					}
					
					$("#topic").val('searching');
					
					return "What are you searching for?";
				}
			
				if( this.match('(nearest store|closest store)(\\s|!|\\.|$)') ) {
					
					$("#topic").val('storesearch');
					
					return "Sure, I can help you find your closest store - what is your Zip Code?";
				}
				
				$("#topic").val('generalhelp');
				
				return "What can I help you with? You can ask for things like, where to find a product, your local store and it's opening hours, or to make a comment or complaint.";
			
			}
*/
		
		}
		
/*
		if( this.match('^no+(\\s|!|\\.|$)') )
			return "Don't be such a negative nancy :(";
					
		if( this.input == ' ' )
			return ["I'm going to need more information than that", "Try something like 'What is my closest store?', or 'I'm looking for a Garden Hose less than $50'."]
		
		return "I'm sorry, I didn't understand '" + input + "' - but hey, I was only created on the 1st July 2017! Cut me some slack!";
*/
		console.log(this.response);
		
		if( !this.response == '' ) 
			return this.response;
		else if ( this.response == '' ) 
			return "I'm sorry, I didn't catch that. Please try again. :)";
	}
	
	this.match = function( regex ) {
		return new RegExp(regex).test(this.input);
	}
}