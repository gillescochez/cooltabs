/*!
 * jQuery Cooltabs 1.0
 *    - http://cooltabs.codeserenity.com/
 *
 * Copyright 2010, Gilles Cochez
 * Dual licensed under the MIT and GPL licenses.
 *    - http://www.opensource.org/licenses/mit-license.php
 *    - http://www.gnu.org/copyleft/gpl.html
 */

// bof closure
;(function($) {

	// list of classes for the design elements, those will be generated automatically based on that list
	var list = 'content-wrap,wrap,left,middle,tab,tab-left,tab-middle,tab-right,right,arrow,clear'.split(","); 
	
	// plugin declaration
	x = $.fn.cooltabs = function(o) {
	
		// merge passed option with defaults
		o = $.extend({}, $.fn.cooltabs.defaults, o);
		
		// enable chainability
		return $(this).each(function() {
		
			// some variables/caching/element creation
			var 
				n = 0, // counter (used for span counting)
				e = {}, // object that store cached elements
				span = [], // store span data (left and width)
				cwidth = 0, // store the cooltabs-content set width
				height = 0, // use to calculate maximum height of the content
				$ul = $('<ul>'), // create a ul element we will use to store tab links
				$content = $(this).children('div.'+o.prefix+'content'); // grab the content tabs
				
				
			// clever (aka lazy) elements creation and caching
			$.each(list, function(i) { 
				e[list[i].replace("-","_")] = $('<div>').addClass(o.prefix+list[i]); 
			});
			
			// clone tab element and set opacity
			e.tab2 = e.tab.append(
				e.tab_left, e.tab_middle.append(
					e.arrow
				), e.tab_right, e.clear).clone().css('opacity', 0.2);
			
			// build the markup
			e.wrap.append(
				e.left, e.middle.append(
					$ul,e.tab, e.tab2
				), e.right, e.clear
			).prependTo(this);
			
			// loop through headers
			$content.each(function(i) {
				
				// create a new li and set the text for it
				$('<li>').attr('pos', i).html(function() {
					
					// some variables
					var 
						arr = $content.children(o.header).eq(0).text().split(""), // split the string (each character need to be wrapped up!)
						str = ''; // will hold the final label html

					// loop through the letters and wrap them up
					$.each(arr, function(i) { str += "<span>"+arr[i]+"</span>";	});
					
					// return the result
					return str;
				
				}).addClass(i > 0 ? o.prefix+'inactive' : o.prefix+'active')
					.click(function() { anim($(this)); this.className = o.prefix+'active'; })
						.hover(function(){ anim($(this), o.hover_fx); }, 
							function() { anim($ul.children('li.'+o.prefix+'active').eq(0), o.hover_fx); })
				
				// add the li to the ul, then loop through its span
				.appendTo($ul).children('span').each(function() {
					
					// store span info
					span[n] = {
						left: $(this).position().left,
						width: $(this).innerWidth()
					};
					
					// increase counter
					n++;
				});
				
				// save the height of the highest content
				if (!height || $(this).innerHeight() > height) height = $(this).innerHeight();
				
				// grab the width
				cwidth = $(this).outerWidth();
				
				// fix the width of the container
				$(this).css({
					position:'absolute',
					width: (cwidth-20)+"px",
					left:i*cwidth,
					top:$ul.height()
				}).appendTo(e.content_wrap);
			});
			
			// set height of the container
			$(this).css("height", height+"px").children('.'+o.prefix+'content').remove().end().append(e.content_wrap);
			
			// set the width of the tab to match the first element
			e.tab_middle.css('width', $ul.children(0).innerWidth()+'px');
			
			// cache the <span>s
			//$span = $ul.children().children('span');
			
			// animation function
			function anim(li, hover) {
				
				// set element to use
				var el = hover ? e.tab2 : e.tab, mdl = hover ? e.tab2.children().eq(1) : e.tab_middle, $span = $ul.children().find('span');
				
				// reset the <li>s status to inactive
				if (!hover) $ul.children('li').each(function() { this.className = o.prefix+'inactive'; });
				
				// animate the tab
				el.stop(!hover).animate({left:li.position().left+10}, {
					duration:o.speed, 				
					easing: o.tab_easing ? o.tab_easing : 'swing',
					step: function() {
					
						// only change text on click animation
						if (!hover) {
						
							// grab current location and size
							var data = {
								width:e.tab.innerWidth(),
								left:e.tab.position().left-20
							};
							
							// loop through the spans
							$span.each(function(i) {
								if (span[i].left >= data.left-span[i].width && span[i].left <= data.left+data.width) $span.get(i).className = o.prefix+'on';
								else $span.get(i).className = o.prefix+'off';
							});
						};
					},
					complete: function() {
						if (!hover) li.get().className = o.prefix+'active';
					}
				});
				
				// resize the middle part of the tab
				mdl.stop().animate({width:li.innerWidth()+"px"}, {
					easing: o.tab_easing ? o.tab_easing : 'swing',
					duration:o.speed
				});
				
				// move the content
				if (!hover) e.content_wrap.animate({left:"-"+li.attr('pos')*cwidth+"px"}, {
					easing: o.content_easing ? o.content_easing : 'swing',
					duration: o.speed
				});	
			};		
		});	
	};

	// default options
	$.fn.cooltabs.defaults = {
		content_easing: '', // Easing to use with content (for use qith jquery easing plugin)
		tab_easing: '', // Easing to use with tab (for use qith jquery easing plugin)
		prefix: 'cooltabs-', // CSS class prefix
		hover_fx: true, // onmouseover effect (clone tabbed moving underneath)
		header: 'h3', // header selector
		speed: 500 // animation speed in milliseconds
	};

// eof closure
})(jQuery);