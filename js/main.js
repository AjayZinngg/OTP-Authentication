var contacts;
var key			='fd9727f3-5730-11e7-94da-0200cd936042';
var sent		=false;										//Flag to indicate if OTP was sent for current recepient

$.getJSON('json/contacts.json',function(data){
	//Load the json file
	contacts=data;
	contacts.sort(sort);

	//Display the contacts in groups
	var html=[];
	var currentLetter=' ';
	for(var i=0,n=contacts.length;i<n;++i){
		var c=contacts[i].firstName[0];
		if(c!=currentLetter){
			currentLetter=c;
			html.push('<div class="contact-header">'+currentLetter+'</div>');
		}
		html.push('<div id="c'+i+'" class="contact" onclick="showScreen(this)">'+contacts[i].firstName+' '+contacts[i].lastName+'</div>');
	}
	$('#contacts').html(html.join(''));
});

function sort(a,b){
	if(a.firstName<b.firstName)			return -1;
	else if(a.firstName>b.firstName)	return 1;
	else if(a.lastName<b.lastName)		return -1;
	else								return 1;
}

//Function that handles tab switching
$('.tab').click(function(){
	$('#current').removeAttr('id');
	$(this).attr('id','current');

	switch($(this).text()){
		case 'Contacts':$('#contacts').css('display','flex');	//If contacts tab was selected, display contacts
						$('#messages').css('display','none');
						break;
		case 'Messages':$('#contacts').css('display','none');	//If messages tab was selected, display messages
						$('#messages').css('display','flex');
						break;
	}
});

//Showing the modal window
function showScreen(div){
	var c=contacts[$(div).attr('id').substring(1)];
	$('#first-name').text(c.firstName);
	$('#last-name').text(c.lastName);
	$('#phone-number').text(c.phoneNumber);
	$('#otp').val(c.phoneNumber.substring(c.phoneNumber.length-6));	//Insert OTP algorithm here
	$('#otp-status').text('');
	$('#send').text('Send >');
	sent=false;

	$('#screen').css('display','flex');
	$('#screen').animate({opacity:'1'},250,'linear');
};

//Closing the modal window
$('#cross').click(function(){
	$('#screen').animate({opacity:'0'},250,'linear',function(){
		$('#screen').css('display','none');
	});
});

//Send OTP
$('#send').click(function(){
	if(!sent){
		var url='https://2factor.in/API/V1/'+key+'/SMS/'+$('#phone-number').text()+'/'+"Offer wala kaam go gaya?";
		//$('#contact-details').append('<object id="site" data="'+url+'"></object>');
		$.getJSON(url,function(data){
			sentOtp(data);
		});
		sent=true;
	}
});

//Post OTP sent function
function sentOtp(data){
	$('#otp-status').text(data.Status);
	if(data.Status=='Success'){
		var h={};
		h.timestamp=new Date();
		h.firstName=$('#first-name').text();
		h.lastName=$('#last-name').text();
		h.phoneNumber=$('#phone-number').text();
		h.otp=$('#otp').val();
		$('#messages').prepend('\
									<div class="message">\
										<div>Sent on '+h.timestamp.toLocaleTimeString()+', '+h.timestamp.toDateString()+'</div>\
										<div class="recipient">'+h.firstName+' '+h.lastName+'</div>\
										<div class="recipient-number">'+h.phoneNumber+'</div>\
										<div class="recipient-otp">'+h.otp+'</div>\
									</div>\
								');
		$('#send').text('Sending');
	}
}
