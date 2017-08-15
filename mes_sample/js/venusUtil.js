/*===============================================
*Copyright(c) 2015 POSCO/POSCO ICT
*
*@ProcessChain : M51
*
*@File        : venusUtil.js
*
*@FileName : 
*
*Change history 
*@LastModifier      :  정해성
*@수정 날짜;SCR_NO;수정자;수정내용
*@2015-10-19;;;최초생성
====================================================*/

'use strict';

//디버깅을 위한 console
console = window.console || {
	log:function(){},
	debug:function(){},
	warn:function(){},
	error:function(){}
};

var ajaxEvents = 0;
$(document).ready(function() {	
	//ajax 전송 전/후 로딩 이미지 설정
	$(document).on({
		ajaxSend: function(e){
			$("body").setLoading(true);
			ajaxEvents++;
		},
		ajaxComplete: function(e){
			if (ajaxEvents == 1) {
				$("body").setLoading(false);			
			}
			ajaxEvents--;
		},
		ajaxError: function(e){
			ajaxEvents = 0;
			$("body").setLoading(false);
		}
	});
	
	$('.well.mes-condition table th').addBullet();
	$('.well.mes-condition-basic table th').addBullet();
});


/**
 * jQuery number plug-in 2.1.3
 * Copyright 2012, Digital Fusion
 * Licensed under the MIT license.
 * http://opensource.teamdf.com/license/
 *
 * A jQuery plugin which implements a permutation of phpjs.org's number_format to provide
 * simple number formatting, insertion, and as-you-type masking of a number.
 * 
 * @author	Sam Sehnert
 * @docs	http://www.teamdf.com/web/jquery-number-format-redux/196/
 */
(function($){
	
	"use strict";
	
	/**
	 * Method for selecting a range of characters in an input/textarea.
	 *
	 * @param int rangeStart			: Where we want the selection to start.
	 * @param int rangeEnd				: Where we want the selection to end.
	 *
	 * @return void;
	 */
	function setSelectionRange( rangeStart, rangeEnd )
	{
		// Check which way we need to define the text range.
		if( this.createTextRange )
		{
			var range = this.createTextRange();
				range.collapse( true );
				range.moveStart( 'character',	rangeStart );
				range.moveEnd( 'character',		rangeEnd-rangeStart );
				range.select();
		}
		
		// Alternate setSelectionRange method for supporting browsers.
		else if( this.setSelectionRange )
		{
			this.focus();
			this.setSelectionRange( rangeStart, rangeEnd );
		}
	}
	
	/**
	 * Get the selection position for the given part.
	 * 
	 * @param string part			: Options, 'Start' or 'End'. The selection position to get.
	 *
	 * @return int : The index position of the selection part.
	 */
	function getSelection( part )
	{
		var pos	= this.value.length;
		
		// Work out the selection part.
		part = ( part.toLowerCase() == 'start' ? 'Start' : 'End' );
		
		if( document.selection ){
			// The current selection
			var range = document.selection.createRange(), stored_range, selectionStart, selectionEnd;
			// We'll use this as a 'dummy'
			stored_range = range.duplicate();
			// Select all text
			//stored_range.moveToElementText( this );
			stored_range.expand('textedit');
			// Now move 'dummy' end point to end point of original range
			stored_range.setEndPoint( 'EndToEnd', range );
			// Now we can calculate start and end points
			selectionStart = stored_range.text.length - range.text.length;
			selectionEnd = selectionStart + range.text.length;
			return part == 'Start' ? selectionStart : selectionEnd;
		}
		
		else if(typeof(this['selection'+part])!="undefined")
		{
		 	pos = this['selection'+part];
		}
		return pos;
	}
	
	/**
	 * Substitutions for keydown keycodes.
	 * Allows conversion from e.which to ascii characters.
	 */
	var _keydown = {
		codes : {
			188 : 44,
			109 : 45,
			190 : 46,
			191 : 47,
			192 : 96,
			220 : 92,
			222 : 39,
			221 : 93,
			219 : 91,
			173 : 45,
			187 : 61, //IE Key codes
			186 : 59, //IE Key codes
			189 : 45, //IE Key codes
			110 : 46  //IE Key codes
        },
        shifts : {
			96 : "~",
			49 : "!",
			50 : "@",
			51 : "#",
			52 : "$",
			53 : "%",
			54 : "^",
			55 : "&",
			56 : "*",
			57 : "(",
			48 : ")",
			45 : "_",
			61 : "+",
			91 : "{",
			93 : "}",
			92 : "|",
			59 : ":",
			39 : "\"",
			44 : "<",
			46 : ">",
			47 : "?"
        }
    };
	
	/**
	 * jQuery number formatter plugin. This will allow you to format numbers on an element.
	 *
	 * @params proxied for format_number method.
	 *
	 * @return : The jQuery collection the method was called with.
	 */
	$.fn.number = function( number, decimals, dec_point, thousands_sep ){
	    
	    // Enter the default thousands separator, and the decimal placeholder.
	    thousands_sep	= (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
	    dec_point		= (typeof dec_point === 'undefined') ? '.' : dec_point;
	    decimals		= (typeof decimals === 'undefined' ) ? 0 : decimals;
	    	    
	    // Work out the unicode character for the decimal placeholder.
	    var u_dec			= ('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4)),
	    	regex_dec_num	= new RegExp('[^'+u_dec+'0-9]','g'),
	    	regex_dec		= new RegExp(u_dec,'g');
	    
	    // If we've specified to take the number from the target element,
	    // we loop over the collection, and get the number.
	    if( number === true )
	    {
	    	// If this element is a number, then we add a keyup
	    	if( this.is('input:text') )
	    	{
	    		// Return the jquery collection.
	    		return this.on({
	    			
	    			/**
	    			 * Handles keyup events, re-formatting numbers.
	    			 *
	    			 * @param object e			: the keyup event object.s
	    			 *
	    			 * @return void;
	    			 */
	    			'keydown.format' : function(e){
	    				
	    				// Define variables used in the code below.
	    				var $this	= $(this),
	    					data	= $this.data('numFormat'),
	    					code	= (e.keyCode ? e.keyCode : e.which),
							chara	= '', //unescape(e.originalEvent.keyIdentifier.replace('U+','%u')),
	    					start	= getSelection.apply(this,['start']),
	    					end		= getSelection.apply(this,['end']),
	    					val		= '',
	    					setPos	= false;
	    				
	    				// Webkit (Chrome & Safari) on windows screws up the keyIdentifier detection
	    				// for numpad characters. I've disabled this for now, because while keyCode munging
	    				// below is hackish and ugly, it actually works cross browser & platform.
	    				
//	    				if( typeof e.originalEvent.keyIdentifier !== 'undefined' )
//	    				{
//	    					chara = unescape(e.originalEvent.keyIdentifier.replace('U+','%u'));
//	    				}
//	    				else
//	    				{
	    					if (_keydown.codes.hasOwnProperty(code)) {
					            code = _keydown.codes[code];
					        }
					        if (!e.shiftKey && (code >= 65 && code <= 90)){
					        	code += 32;
					        } else if (!e.shiftKey && (code >= 69 && code <= 105)){
					        	code -= 48;
					        } else if (e.shiftKey && _keydown.shifts.hasOwnProperty(code)){
					            //get shifted keyCode value
					            chara = _keydown.shifts[code];
					        }
					        
					        if( chara == '' ) chara = String.fromCharCode(code);
//	    				}
						

			
	    				
	    				// Stop executing if the user didn't type a number key, a decimal character, or backspace.
	    				if( code !== 8 && chara != dec_point && !chara.match(/[0-9]/) )
	    				{
	    					// We need the original keycode now...
	    					var key = (e.keyCode ? e.keyCode : e.which);
	    					if( // Allow control keys to go through... (delete, etc)
	    						key == 46 || key == 8 || key == 9 || key == 27 || key == 13 || 
	    						// Allow: Ctrl+A, Ctrl+R
	    						( (key == 65 || key == 82 ) && ( e.ctrlKey || e.metaKey ) === true ) || 
	    						// Allow: Ctrl+V, Ctrl+C
	    						( (key == 86 || key == 67 ) && ( e.ctrlKey || e.metaKey ) === true ) || 
	    						// Allow: home, end, left, right
	    						( (key >= 35 && key <= 39) )
							){
								return;
							}
							// But prevent all other keys.
							e.preventDefault();
							return false;
	    				}
	    				
	    				// The whole lot has been selected, or if the field is empty...
	    				if( start == 0 && end == this.value.length || $this.val() == 0 )
	    				{
	    					if( code === 8 )
	    					{
		    					// Blank out the field, but only if the data object has already been instanciated.
	    						start = end = 1;
	    						this.value = '';
	    						
	    						// Reset the cursor position.
		    					data.init = (decimals>0?-1:0);
		    					data.c = (decimals>0?-(decimals+1):0);
		    					setSelectionRange.apply(this, [0,0]);
		    				}
		    				else if( chara === dec_point )
		    				{
		    					start = end = 1;
		    					this.value = '0'+ dec_point + (new Array(decimals+1).join('0'));
		    					
		    					// Reset the cursor position.
		    					data.init = (decimals>0?1:0);
		    					data.c = (decimals>0?-(decimals+1):0);
		    				}
		    				else if( this.value.length === 0 )
		    				{
		    					// Reset the cursor position.
		    					data.init = (decimals>0?-1:0);
		    					data.c = (decimals>0?-(decimals):0);
		    				}
	    				}
	    				
	    				// Otherwise, we need to reset the caret position
	    				// based on the users selection.
	    				else
	    				{
	    					data.c = end-this.value.length;
	    				}
	    				
	    				// If the start position is before the decimal point,
	    				// and the user has typed a decimal point, we need to move the caret
	    				// past the decimal place.
	    				if( decimals > 0 && chara == dec_point && start == this.value.length-decimals-1 )
	    				{
	    					data.c++;
	    					data.init = Math.max(0,data.init);
	    					e.preventDefault();
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If the user is just typing the decimal place,
	    				// we simply ignore it.
	    				else if( chara == dec_point )
	    				{
	    					data.init = Math.max(0,data.init);
	    					e.preventDefault();
	    				}
	    				
	    				// If hitting the delete key, and the cursor is behind a decimal place,
	    				// we simply move the cursor to the other side of the decimal place.
	    				else if( decimals > 0 && code == 8 && start == this.value.length-decimals )
	    				{
	    					e.preventDefault();
	    					data.c--;
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If hitting the delete key, and the cursor is to the right of the decimal
	    				// (but not directly to the right) we replace the character preceeding the
	    				// caret with a 0.
	    				else if( decimals > 0 && code == 8 && start > this.value.length-decimals )
	    				{
	    					if( this.value === '' ) return;
	    					
	    					// If the character preceeding is not already a 0,
	    					// replace it with one.
	    					if( this.value.slice(start-1, start) != '0' )
	    					{
	    						val = this.value.slice(0, start-1) + '0' + this.value.slice(start);
	    						$this.val(val.replace(regex_dec_num,'').replace(regex_dec,dec_point));
	    					}
	    					
	    					e.preventDefault();
	    					data.c--;
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If the delete key was pressed, and the character immediately
	    				// before the caret is a thousands_separator character, simply
	    				// step over it.
	    				else if( code == 8 && this.value.slice(start-1, start) == thousands_sep )
	    				{
	    					e.preventDefault();
	    					data.c--;
	    					
	    					// Set the selection position.
	    					setPos = this.value.length+data.c;
	    				}
	    				
	    				// If the caret is to the right of the decimal place, and the user is entering a
	    				// number, remove the following character before putting in the new one. 
	    				else if(
	    					decimals > 0 &&
	    					start == end &&
	    					this.value.length > decimals+1 &&
	    					start > this.value.length-decimals-1 && isFinite(+chara) &&
		    				!e.metaKey && !e.ctrlKey && !e.altKey && chara.length === 1
	    				)
	    				{
	    					// If the character preceeding is not already a 0,
	    					// replace it with one.
	    					if( end === this.value.length )
	    					{
	    						val = this.value.slice(0, start-1);
	    					}
	    					else
	    					{
	    						val = this.value.slice(0, start)+this.value.slice(start+1);
	    					}
	    					
	    					// Reset the position.
	    					this.value = val;
	    					setPos = start;
	    				}
	    				
	    				// If we need to re-position the characters.
	    				if( setPos !== false )
	    				{
	    					//console.log('Setpos keydown: ', setPos );
	    					setSelectionRange.apply(this, [setPos, setPos]);
	    				}
	    				
	    				// Store the data on the element.
	    				$this.data('numFormat', data);
	    				
	    			},
	    			
	    			/**
	    			 * Handles keyup events, re-formatting numbers.
	    			 *
	    			 * @param object e			: the keyup event object.s
	    			 *
	    			 * @return void;
	    			 */
	    			'keyup.format' : function(e){
	    				
	    				// Store these variables for use below.
	    				var $this	= $(this),
	    					data	= $this.data('numFormat'),
	    					code	= (e.keyCode ? e.keyCode : e.which),
	    					start	= getSelection.apply(this,['start']),
	    					setPos;
	    				    				    			
	    				// Stop executing if the user didn't type a number key, a decimal, or a comma.
	    				if( this.value === '' || (code < 48 || code > 57) && (code < 96 || code > 105 ) && code !== 8 ) return;
	    				
	    				// Re-format the textarea.
	    				$this.val($this.val());

	    				if( decimals > 0 )
	    				{
		    				// If we haven't marked this item as 'initialised'
		    				// then do so now. It means we should place the caret just 
		    				// before the decimal. This will never be un-initialised before
		    				// the decimal character itself is entered.
		    				if( data.init < 1 )
		    				{
		    					start		= this.value.length-decimals-( data.init < 0 ? 1 : 0 );
		    					data.c		= start-this.value.length;
		    					data.init	= 1;
		    					
		    					$this.data('numFormat', data);
		    				}
		    				
		    				// Increase the cursor position if the caret is to the right
		    				// of the decimal place, and the character pressed isn't the delete key.
		    				else if( start > this.value.length-decimals && code != 8 )
		    				{
		    					data.c++;
		    					
		    					// Store the data, now that it's changed.
		    					$this.data('numFormat', data);
		    				}
	    				}
	    				
	    				//console.log( 'Setting pos: ', start, decimals, this.value.length + data.c, this.value.length, data.c );
	    				
	    				// Set the selection position.
	    				setPos = this.value.length+data.c;
	    				setSelectionRange.apply(this, [setPos, setPos]);
	    			},
	    			
	    			/**
	    			 * Reformat when pasting into the field.
	    			 *
	    			 * @param object e 		: jQuery event object.
	    			 *
	    			 * @return false : prevent default action.
	    			 */
	    			'paste.format' : function(e){
	    				
	    				// Defint $this. It's used twice!.
	    				var $this		= $(this),
	    					original	= e.originalEvent,
	    					val		= null;
						
						// Get the text content stream.
						if (window.clipboardData && window.clipboardData.getData) { // IE
							val = window.clipboardData.getData('Text');
						} else if (original.clipboardData && original.clipboardData.getData) {
							val = original.clipboardData.getData('text/plain');
						}
						
	    				// Do the reformat operation.
	    				$this.val(val);
	    				
	    				// Stop the actual content from being pasted.
	    				e.preventDefault();
	    				return false;
	    			}
	    		
	    		})
	    		
	    		// Loop each element (which isn't blank) and do the format.
    			.each(function(){
    			
    				var $this = $(this).data('numFormat',{
    					c				: -(decimals+1),
    					decimals		: decimals,
    					thousands_sep	: thousands_sep,
    					dec_point		: dec_point,
    					regex_dec_num	: regex_dec_num,
    					regex_dec		: regex_dec,
    					init			: false
    				});
    				
    				// Return if the element is empty.
    				if( this.value === '' ) return;
    				
    				// Otherwise... format!!
    				$this.val($this.val());
    			});
	    	}
	    	else
	    	{
		    	// return the collection.
		    	return this.each(function(){
		    		var $this = $(this), num = +$this.text().replace(regex_dec_num,'').replace(regex_dec,'.');
		    		$this.number( !isFinite(num) ? 0 : +num, decimals, dec_point, thousands_sep );
		    	});
	    	}
	    }
	    
	    // Add this number to the element as text.
	    return this.text( $.number.apply(window,arguments) );
	};
	
	//
	// Create .val() hooks to get and set formatted numbers in inputs.
	//
	
	// We check if any hooks already exist, and cache
	// them in case we need to re-use them later on.
	var origHookGet = null, origHookSet = null;
	 
	// Check if a text valHook already exists.
	if( $.isPlainObject( $.valHooks.text ) )
	{
	    // Preserve the original valhook function
	    // we'll call this for values we're not 
	    // explicitly handling.
	    if( $.isFunction( $.valHooks.text.get ) ) origHookGet = $.valHooks.text.get;
	    if( $.isFunction( $.valHooks.text.set ) ) origHookSet = $.valHooks.text.set;
	}
	else
	{
	    // Define an object for the new valhook.
	    $.valHooks.text = {};
	} 
	
	/**
	 * Define the valHook to return normalised field data against an input
	 * which has been tagged by the number formatter.
	 *
	 * @param object el			: The raw DOM element that we're getting the value from.
	 *
	 * @return mixed : Returns the value that was written to the element as a
	 *				   javascript number, or undefined to let jQuery handle it normally.
	 */
	$.valHooks.text.get = function( el ){
		
		// Get the element, and its data.
		var $this	= $(el), num,
			data	= $this.data('numFormat');
		
        // Does this element have our data field?
        if( !data )
        {
            // Check if the valhook function already existed
            if( $.isFunction( origHookGet ) )
            {
                // There was, so go ahead and call it
                return origHookGet(el);
            }
            else
            {
                // No previous function, return undefined to have jQuery
                // take care of retrieving the value
                return undefined;
			}
		}
		else
		{			
			// Remove formatting, and return as number.
			if( el.value === '' ) return '';
			
			// Convert to a number.
			num = +(el.value
				.replace( data.regex_dec_num, '' )
				.replace( data.regex_dec, '.' ));
		
			// If we've got a finite number, return it.
			// Otherwise, simply return 0.
			// Return as a string... thats what we're
			// used to with .val()
			return ''+( isFinite( num ) ? num : 0 );
		}
	};
	
	/**
	 * A valhook which formats a number when run against an input
	 * which has been tagged by the number formatter.
	 *
	 * @param object el		: The raw DOM element (input element).
	 * @param float			: The number to set into the value field.
	 *
	 * @return mixed : Returns the value that was written to the element,
	 *				   or undefined to let jQuery handle it normally. 
	 */
	$.valHooks.text.set = function( el, val )
	{
		// Get the element, and its data.
		var $this	= $(el),
			data	= $this.data('numFormat');
		
		// Does this element have our data field?
		if( !data )
		{
		    
		    // Check if the valhook function already exists
		    if( $.isFunction( origHookSet ) )
		    {
		        // There was, so go ahead and call it
		        return origHookSet(el,val);
		    }
		    else
		    {
		        // No previous function, return undefined to have jQuery
		        // take care of retrieving the value
		        return undefined;
			}
		}
		else
		{
			// Otherwise, don't worry about other valhooks, just run ours.
			return el.value = $.number( val, data.decimals, data.dec_point, data.thousands_sep );
		}
	};
	
	/**
	 * The (modified) excellent number formatting method from PHPJS.org.
	 * http://phpjs.org/functions/number_format/
	 *
	 * @modified by Sam Sehnert (teamdf.com)
	 *	- don't redefine dec_point, thousands_sep... just overwrite with defaults.
	 *	- don't redefine decimals, just overwrite as numeric.
	 *	- Generate regex for normalizing pre-formatted numbers.
	 *
	 * @param float number			: The number you wish to format, or TRUE to use the text contents
	 *								  of the element as the number. Please note that this won't work for
	 *								  elements which have child nodes with text content.
	 * @param int decimals			: The number of decimal places that should be displayed. Defaults to 0.
	 * @param string dec_point		: The character to use as a decimal point. Defaults to '.'.
	 * @param string thousands_sep	: The character to use as a thousands separator. Defaults to ','.
	 *
	 * @return string : The formatted number as a string.
	 */
	$.number = function( number, decimals, dec_point, thousands_sep ){
		// Set the default values here, instead so we can use them in the replace below.
		thousands_sep	= (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
		dec_point		= (typeof dec_point === 'undefined') ? '.' : dec_point;
		decimals		= !isFinite(+decimals) ? 0 : Math.abs(decimals);
		
		// Work out the unicode representation for the decimal place and thousand sep.	
		var u_dec = ('\\u'+('0000'+(dec_point.charCodeAt(0).toString(16))).slice(-4));
		var u_sep = ('\\u'+('0000'+(thousands_sep.charCodeAt(0).toString(16))).slice(-4));
		
		// Fix the number, so that it's an actual number.
		number = (number + '')
			.replace('\.', dec_point) // because the number if passed in as a float (having . as decimal point per definition) we need to replace this with the passed in decimal point character
			.replace(new RegExp(u_sep,'g'),'')
			.replace(new RegExp(u_dec,'g'),'.')
			.replace(new RegExp('[^0-9+\-Ee.]','g'),'');
		
		var n = !isFinite(+number) ? 0 : +number,
		    s = '',
		    toFixedFix = function (n, decimals) {
		        var k = Math.pow(10, decimals);
		        return '' + Math.round(n * k) / k;
		    };
		
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (decimals ? toFixedFix(n, decimals) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
		    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousands_sep);
		}
		if ((s[1] || '').length < decimals) {
		    s[1] = s[1] || '';
		    s[1] += new Array(decimals - s[1].length + 1).join('0');
		}
		return s.join(dec_point);
	}
	
})(jQuery);


/**
 * @preserve IntegraXor Web SCADA - JavaScript Number Formatter
 * http://www.integraxor.com/
 * author: KPL, KHL
 * (c)2011 ecava
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

////////////////////////////////////////////////////////////////////////////////
// param: Mask & Value
////////////////////////////////////////////////////////////////////////////////

window['formatNumber'] = function( m, v ){ 
    if (!m || isNaN(+v)) {
        return v; //return as it is.
    }
    if (m.indexOf('.') == -1) {
    	m += '.';
    }
    //convert any string to number according to formation sign.
    var v = m.charAt(0) == '-'? -v: +v;
    var isNegative = v<0? v= -v: 0; //process only abs(), and turn on flag.
    
    //search for separator for grp & decimal, anything not digit, not +/- sign, not #.
    var result = m.match(/[^\d\-\+#]/g);
    var Decimal = (result && result[result.length-1]) || '.'; //treat the right most symbol as decimal 
    var Group = (result && result[1] && result[0]) || ',';  //treat the left most symbol as group separator
    
    //split the decimal for the format string if any.
    var m = m.split( Decimal);
    //Fix the decimal first, toFixed will auto fill trailing zero.
    v = v.toFixed( m[1] && m[1].length);
    v = +(v) + ''; //convert number to string to trim off *all* trailing decimal zero(es)
    
    //fill back any trailing zero according to format
	var pos_trail_zero = m[1] && m[1].lastIndexOf('0'); //look for last zero in format
	var part = v.split('.');
	//integer will get !part[1]
	if (!part[1] || part[1] && part[1].length <= pos_trail_zero) {
		v = (+v).toFixed( pos_trail_zero+1);
	}
    var szSep = m[0].split( Group); //look for separator
    m[0] = szSep.join(''); //join back without separator for counting the pos of any leading 0.

    var pos_lead_zero = m[0] && m[0].indexOf('0');
    if (pos_lead_zero > -1 ) {
        while (part[0].length < (m[0].length - pos_lead_zero)) {
            part[0] = '0' + part[0];
        }
    }
    else if (+part[0] == 0){
        part[0] = '';
    }
    
    v = v.split('.');
    v[0] = part[0];
    
    //process the first group separator from decimal (.) only, the rest ignore.
    //get the length of the last slice of split result.
    var pos_separator = ( szSep[1] && szSep[ szSep.length-1].length);
    if (pos_separator) {
        var integer = v[0];
        var str = '';
        var offset = integer.length % pos_separator;
        for (var i=0, l=integer.length; i<l; i++) { 
            
            str += integer.charAt(i); //ie6 only support charAt for sz.
            //-pos_separator so that won't trail separator on full length
            if (!((i-offset+1)%pos_separator) && i<l-pos_separator ) {
                str += Group;
            }
        }
        v[0] = str;
    }

    v[1] = (m[1] && v[1])? Decimal+v[1] : "";
    return (isNegative?'-':'') + v[0] + v[1]; //put back any negation and combine integer and fraction.
};


//이벤트 바인딩
$(document).on('keyup', function(e) {
	var $$ = $(e.target);
	if ($$.hasClass('upper-case')) {
		$$.val($$.val().toUpperCase());
	}
});


String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|HH|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 100).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.parseDate = function(f) {
	if (f == "yyyyMMdd") {
		return new Date(this.substr(0,4), this.substr(4,2)-1, this.substr(6,2));
	}
	else if (f == "yyyyMMddHHmmss") {
		return new Date(this.substr(0,4), this.substr(4,2)-1, this.substr(6,2), this.substr(8,2), this.substr(10,2), this.substr(12,2));
	}
	else if (f == "yyyy-MM-dd") {
		return new Date(this.substr(0,4), this.substr(5,2)-1, this.substr(8,2));
	}
	else {
		//default format 'yyyy-MM-dd HH:mm:ss'
		return new Date(this.substr(0,4), this.substr(5,2)-1, this.substr(8,2), this.substr(11,2), this.substr(14,2), this.substr(17,2));
	}
};

String.prototype.toDateString = function(org, to) {
	return this.parseDate(org).format(to);
}

Number.prototype.format = function(pattern) {
	return formatNumber(pattern, this);
};


/**
 * Helpers for `columns.render`.
 *
 * The options defined here can be used with the `columns.render` initialisation
 * option to provide a display renderer. The following functions are defined:
 *
 * * `phoneNumber` - Will format phone number data (defined by `columns.data`) for
 *   display, retaining the original unformatted data for sorting and filtering.
 *   It takes no parameters:
 *
 * @example
 *   // Column definition using the phoneNumber renderer
 *   {
 *     data: "cellphone",
 *     render: $.fn.dataTable.render.phoneNumber()
 *   }
 *
 * @namespace
 * @deprecated Formatter 객체로 적용
 */
$.extend( true, $.fn.dataTable.render, {
	phoneNumber: function () {
		return {
			display: function ( d ) {
				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}
				return d.toString().replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
			}
		};
	},
	convertDateFormat: function(org, to) {
		return {
			display: function ( d ) {
				return d.toString().toDateString(org, to);
			}
		}
	},
	formatDate: function(pattern) {
		return {
			display: function (d) {
				return new Date(d).format(pattern);
			}
		}
	}
});

//DataTable의 cell 값의 출력 format을 위한 function 정의
var Formatter = {
	phoneNumber: function () {
		return {
			display: function ( d ) {
				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}
				return d.toString().replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
			}
		};
	},
	date: function(orgPattern, newPattern) {
		return {
			display: function (d) {
				if (d == "" || d == null) return "";
				if (newPattern == undefined || newPattern == null) {
					//return new Date(d).format(orgPattern);
					return d.parseDate('yyyy-MM-dd HH:mm:ss').format(orgPattern);
				}
				return d.parseDate(orgPattern).format(newPattern);
			}
		}
	},
	/* 숫자 포맷 */
	number: function ( thousands, decimal, precision, prefix, postfix ) {
		return {
			display: function ( d ) {
				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}
				if ( typeof d === 'string' && d === '') {
					return d;
				}
				if ( d == undefined || d == null) {
					return d;
				}

				var negative = d < 0 ? '-' : '';
				d = Math.abs( parseFloat( d ) );

				var intPart = parseInt( d, 10 );
				var floatPart = precision ? decimal + (d - intPart).toFixed(precision).substring( 2 ) : '';

				return negative 
				     + (prefix||'')
				     + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands)
				     + floatPart
				     + (postfix||'');
			}
		};
	},
	/* 순번 매기기 */
	sequence: function() {
		return {
			display: function ( data, type, row, meta ) {
                return meta.row+1;
            },
			sort: function ( data, type, row, meta ) {
				return meta.row+1;
            }
		}
	}
};

 

function getKey(radioName, getObjName) {
    var objRadio = eval("document.forms[0]." + radioName)
    var objGet = eval("document.forms[0]." + getObjName)

    if (objRadio.length) { //Array
        for(i=0; i<objRadio.length ;i++ ) {
            if(objRadio[i].checked==true) {
                return objGet[i].value
            }
        }
    } else { //단일 Row
    	objRadio.checked = true;
        return objGet.value
    }
    return "";
}


/**
 * HTTP Query String을 json 객체로 변환
 * @param queryString
 * @returns json 객체
 */
function toJson(queryString) {
    var j, q;
    q = queryString.replace(/\?/, "").split("&");
    j = {};
    $.each(q, function(i, arr) {
      arr = arr.split('=');
      return j[arr[0]] = arr[1];
    });
    return j;
};

/**
 * DataTable의 지정 컬럼에 순번 자동 매기기 
 * @param dataTableApi
 * @param columnIndex
 */
function addSeq(dataTableApi, columnIndex) {
	dataTableApi.on('order.dt search.dt page.dt', function () {
		//console.log(dataTableApi.column(columnIndex || 0, { page: 'current'}).nodes());
		dataTableApi.column(columnIndex || 0, {search:'applied', order:'applied', page:'all'}).nodes().each( function (cell, i) {
			cell.innerHTML = i+1;
		} );
	}).draw();
} 

/**
 * 현재 document에서 가장 큰 z-index 구하기
 * @returns
 */
function getMaxZIndex() {
	return Math.max.apply(Math, $.map($('.modal'), function(e,n){return parseInt(isNaN($(e).css('z-index')) ? 1 : $(e).css('z-index'));}));
}

/**
 * 문자열의 function 명으로 function 실행하기 
 * @param functionName
 * @param context
 * @returns
 */
function executeFunctionByName(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

/**
 * 모달창 열기
 * @param params
 */
function openModal(params) {
	var url = params.url;
	
	//Function Key 추출
	var fnKey = "";
	var queryString = url.split("?")[1];
	var urlParams = queryString.split("&");
	for (var i = 0; i < urlParams.length; i++) {
		var param = urlParams[i].split("=");
		if (param[0] === "NS_FKEY") {
			fnKey = param[1];
			break;
		} 
	}
	
	if (fnKey == "") {
		alert('Function Key가 존재하지 않습니다.');
		return;
	}
	
	var newID = fnKey+"_html";
	if ($("#"+newID).length === 0) {
    	var $newDiv = $("<div id='"+newID+"'></div>");
        $("body").append($newDiv);
        $newDiv.load(url, function() {
        	openModal(params);
        });
	} else {
		var serviceName = fnKey.split("_")[0];
		var funcName1 = serviceName + ".open";
		var funcName2 = "open" + serviceName.substr(0,1).toUpperCase() + serviceName.substr(1);
		if ($.isFunction(eval(funcName1))) executeFunctionByName(funcName1, window, params);
		//else if ($.isFunction(eval(funcName2))) executeFunctionByName(funcName2, window, params);
		else alert('모달 창을 띄울 수 없습니다. (' + funcName1 + ", " + funcName2 + ")");
	}
}

/*
 * 모달 창의 폼 입력 값 및 텍스트 값들을 삭제한다.
 */
function clearFormData(form) {
    $.each($(form).find(':input'), function(idx, input) {
        if (input.tagName === 'SELECT') {
        	$(input).find("option").first().prop('selected', true);
        	$(input).val($(input).val()).selectpicker('refresh');
        } else {
        	$(input).val('');
        }            
    });
    
    $.each($('#m510200104pop01 span[data-display]'), function(idx, span) {
    	$(span).text('');
    });
}

	
/**
 * MES의 팝업창 기능과 유사한 모달 창
 */
function VenusModal(id) {
	this.id = id;
	this.$modal = $('#'+id);
	
    this.url;
    this.parameter;
    this.callback;
    this.options = {};
    this.events = {};
    
    this.open = function(params) {
    	this.url = params.url;
        this.parameter = params.data;
        this.callback = params.callback;
        this.options = params.options;
        this.events.shown = params.shown;
        this.events.hidden = params.hidden;
        
    	//모달 DIV 항상 맨위로 열기
        this.setAlwaysOnTop();
        
        if (!this.options) {
            this.options = { 
                backdrop: true, 
                draggable: { handle: ".modal-header", cursor: "move" } 
            };
        }
        if (this.options.draggable) {
            this.$modal.children(".modal-dialog").draggable(this.options.draggable);
        }
        //모달 창 띄우기
    	//this.$modal.modal({backdrop: true});
        this.$modal.modal(this.options);
    };
    
    this.close = function() {
    	this.$modal.modal("hide");
    };
    
    this.$ = function(selector) {
    	return this.$modal.find(selector);
    }
    
    this.$input = function(name) {
    	return this.$modal.find('input[name="'+name+'"]');
    }
        
    this.getParam = function(key) {
        if (this.parameter && this.parameter.hasOwnProperty(key)) {
            return this.parameter[key];
        }
        return "";
    };
    
    this.getParamAll = function(key) {
    	return this.parameter;
    };
    
    this.hasParams = function() {
    	return (this.parameter != undefined && this.parameter != null); 
    }
    
    this.setAlwaysOnTop = function() {
    	this.$modal.css("z-index", getMaxZIndex()+1);
    };
}

VenusModal.prototype.load = function(fn) { 
	this.$modal.one("show.bs.modal", fn);
};
VenusModal.prototype.shown = function(fn) {
    var self = this;
    self.$modal.on("shown.bs.modal", function() {
        if (self.events.shown) self.events.shown(self);
        fn();
	});
};
VenusModal.prototype.hidden = function(fn) { 
    var self = this;
    self.$modal.on("hidden.bs.modal", function() {
        if (self.events.hidden) self.events.hidden(self);
        fn();
	});
};

/**
 * 모달창 열기
 * @param params
 */
function openModalNewly(params) {
	var url = params.url;

	//Function Key 추출
	var fnKey = "";
	var queryString = url.split("?")[1];
	var urlParams = queryString.split("&");
	for (var i = 0; i < urlParams.length; i++) {
		var param = urlParams[i].split("=");
		if (param[0] === "NS_FKEY") {
			fnKey = param[1];
			break;
		}
	}

	if (fnKey == "") {
		alert('Function Key가 존재하지 않습니다.');
		return;
	}

	//항상 신규로 Load하도록 처리.
	var newID = fnKey+"_html";
	if ($("#"+newID).length != 0) {
		$("#"+newID).remove();
	}

	var $newDiv = $("<div id='"+newID+"'></div>");
    $("body").append($newDiv);
    $newDiv.load(url, function() {
    	openModal(params);
    	$("#"+newID).on("hide.bs.modal", function() {
    	    $("#"+newID).detach();
    	});
    });
}
	
//========================================================
// VenusDataTable
//========================================================
function VenusDataTable(dataTable) {
	this.dt = dataTable;
	this.api = dataTable.api();
	
	this.reload = function() {
		this.api.ajax.reload();
		return this;
	};
	
	this.getAjaxParams = function() {
		return this.api.ajax.params();
	};
	
	this.getSelectedRowData = function() {
		return this.api.row( { selected: true } ).data();
	};
	
	this.getAllSelectedRowData = function() {
		return this.api.rows( { selected: true } ).data();
	};
	
	this.selectRow = function(row) {
		this.api.row(row).select();
	};
	
	this.addIndex = function(columnIndex) {
		this.api.on('order.dt search.dt', function (e, settings) {
			var api = new $.fn.dataTable.Api( settings );
			api.column(columnIndex || 0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
				cell.innerHTML = i+1;
			} );
		}).draw();
		return this; //chaining을 위해 this 객체 반환
	};
};

(function($) {
	//jQuery function 정의
	$.fn.VenusDataTable = function(opts) {
		return new VenusDataTable( $(this).dataTable(opts) );
	};
	
	$.fn.populate = function(json) {
		var form = this;
		$.each(json, function(key, value) {
			form.find('input,textarea').filter(function() {
				return key === $(this).attr('data-key');
			}).val(value);
			
			form.find('select').filter(function() {
				return key === $(this).attr('data-key');
			}).val(value).selectpicker('refresh');
			
			var span = form.find('span').filter(function() {
				return key === $(this).attr('data-key');
			});
			if (span.attr('data-number') && span.attr('data-number') != '') {
				var pattern = span.attr('data-number'); 
				span.text(Number(value).format(pattern));
			} else {
				span.text(value);
			}
		});
    };
    
    $.fn.clearForm = function() {
    	$(this).find('input:text, input:password, input:file, select, textarea').val('');
        $(this).find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
        $.each($(this).find('select'), function(idx, select) {
    		var $select = $(select);
    		$select.find("option").first().prop('selected', true);
    		$select.val($select.val()).selectpicker('refresh');
        });
    };
    
    $.fn.clear = function() {
    	var form = this;
    	$.each(form.find(':input[data-key]'), function(idx, input) {
    		var $input = $(input);
            if ($input.is('select')) {
            	$input.find("option").first().prop('selected', true);
            	$input.val($(input).val()).selectpicker('refresh');
            }
            else if ($input.is('[type="checkbox"],[type="radio"]')) {
            	$input.attr('checked', false);
            }
            else {
            	$(input).val('');
            }
        });
        
    	form.find('span[data-key]').text('');
    }
		
	$.fn.serializeRaw = function(traditional) {
		
		var a = this.serializeArray();
		
		var prefix,
			s = [],
			add = function( key, value ) {	
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = key + "=" + value;
			};
	
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" );
	};
	
	/*
	 * form의 input 파라미터를 json 데이터로 변환한다.
	 * DataTable의 ajax.data로 사용할 수 있다.
	 */
	$.fn.serializeJson = function(added) {
		
		var j = {},
		    add = function(key, value) {
				var v = j[key];
				if (v === undefined || v == null) {
					v = [];				
				}
				v[v.length] = value;
				j[key] = v;
			}; 
		
		var sa = this.serializeArray();
		
		// Serialize the form elements
		$.each( sa, function() {
			add(this.name, this.value);
		} );
		
		$.each( j, function(key, val) {
			if (val.length && val.length === 1) {
				j[key] = val[0];
			}
		} );
		
		if (added !== undefined) {
			return $.extend( {}, j, added);
		}		
		return j;
	};
	
	$.fn.addBullet = function() {
		$.each(this, function(i, el) {
			var content = $(el).html();
			content = '<span class="bullet"></span> ' + content;
			$(el).html(content);
		});
	};
	
})(jQuery);
