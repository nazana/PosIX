/* ========================================================================
 * VENUS : setLoading.js v1.0.0
 * http://
 * ========================================================================
 * Copyright 2015-2017 PoscoICT, Inc.
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * ======================================================================== */



/* + It forces the parser to treat the part following the + as an expression. 
 *   This is usually used for functions that are invoked immediately
 *   This API is made using Semantic-UI diimer.js and loader.js
 */

+function ($) { 
  'use strict';

  // LOADING PUBLIC CLASS DEFINITION
  // ==============================
  var Loading = function (element, options) {
    this.options   = $.extend({}, Loading.DEFAULTS, options) 
    
    this.$element = $(element);
    this.$dimmable;
    this.$dimmer;
    
    this.init();
    
    return this
  }

  Loading.VERSION  = '1.0.0'
	  
  Loading.DEFAULTS = {
    page: false,
    text: 'Loading',
    inverted: true,
    loader: true,
    loaderSizeArray: ['mini','tiny','small','large','big','huge','massive', ''],
    loaderSize: 'massive',
    closable: true,
  }
  
  Loading.selector = {
    dimmer   : ' > .dimmer',
    content  : '.dimmer > .content, .dimmer > .content > .center'
  }
  
  Loading.className = {
    dimmable   : 'dimmable',
    dimmer     : 'dimmer',
    loader     : 'loader',
    content    : 'content',
    center     : 'center',
    text       : 'text',
    header     : 'header',
    sub        : 'sub',
    disabled   : 'disabled',
    show       : 'show',
    hide       : 'hide',
    toggle     : 'toggle',
    pageDimmer : 'page',
    inverted   : 'inverted',
    loading    : 'loading',
  }
  
  // init Loading
  Loading.prototype.init = function () {
    var that = this
    var $el = this.$element
    var selector = Loading.selector
    var className = Loading.className

    this.$dimmer   = this.createDimmer();
    this.$dimmable = this.createDimmable();
    if (!this.options.closable || $el.is('body')) this.closable();
  }
  
  // Create Loading Content
  Loading.prototype.createDimmer = function () {
    var $el = this.$element
    var options = this.options
    var className = Loading.className

    var page            = ($el.is('body') || options.page) ? className.pageDimmer : ''
    var inverted        = (options.inverted) ? className.inverted : ''
    var closable        = (options.closable) ? options.closable : false
    var toggleId        = options.toggleId
    var text            = options.text
    var loader          = options.loader
    var loaderSizeArray = options.loaderSizeArray;
    var loaderSize = ($.inArray(options.loaderSize, loaderSizeArray) >= 0) ? options.loaderSize : loaderSizeArray[6];
        
    
    var headerTextContent = $(document.createElement('div'))
                            .addClass(className.header)
                            .html(text)

    var subTextContent    = $(document.createElement('div'))
                            .addClass(className.sub)
                            .html(text)

    var loaderContent     = $(document.createElement('div'))
                            .addClass(className.loader)
                            .addClass(className.text)
                            .addClass(loaderSize)
                            .append($(headerTextContent))
    
    var selectContent     = (loader) ? loaderContent : headerTextContent
    
    var content = $(document.createElement('div'))
                  .addClass(className.content)
                  .append(
                    $(document.createElement('div'))
                    .addClass(className.center)
                    .append($(selectContent))
                  )
    
    var dimmer  = $(document.createElement('div'))
                  .addClass(className.dimmer)
                  .addClass(page)
                  .addClass(inverted)
                  .attr('ID',toggleId)
//                  .data('loadingClosable',loadingClosable)
                  .append($(content));

    return $(dimmer)
  }
  
  // Dimmer Append to Dimmable
  Loading.prototype.createDimmable = function () {
    var $el = this.$element
        
    return $el.append(this.$dimmer);
  }

  Loading.prototype.findElement = function () {
    var $dimmable = this.$element
    var $dimmer
    var options   = this.options
    var selector  = Loading.selector

    if(options.toggleId) {
      $dimmer = $dimmable.find(selector.dimmer).filter('#' + options.toggleId);
    }
    else {
      $dimmer = $dimmable.find(selector.dimmer);
    }

    return $dimmer
  }
    
  Loading.prototype.closable = function () {
    this.findElement().dimmer({closable: false})
  }
  
  Loading.prototype.show = function () {
    this.findElement().dimmer('show')
  }
  
  Loading.prototype.hide = function () {
    this.findElement().dimmer('hide')
  }
  
  Loading.prototype.toggle = function () {
    this.findElement().dimmer('toggle')
  }

  Loading.prototype.remove = function () {
    this.findElement().dimmer('remove')
  }
  
  Loading.prototype.destroy = function () {
    this.findElement().dimmer('destroy')
  }

  // LOADING PLUGIN DEFINITION
  // ========================
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('vs.loading')
      var options = $.extend({}, Loading.DEFAULTS, $this.data(), typeof option == 'object' && option)
      
      if (!data) {
        $this.data('vs.loading', (data = new Loading(this, options)))
      }

      if (option == 'show') data.show()
      else if (option == 'hide') data.hide()
      else if (option == 'toggle') data.toggle()
      else if (option == 'remove') data.remove()
      else if (option == 'destroy') data.destroy()
    })
  }

  var old = $.fn.loading

  $.fn.loading             = Plugin
  $.fn.loading.Constructor = Loading

  // LOADING NO CONFLICT
  // ==================
  $.fn.loading.noConflict = function () {
    $.fn.loading = old
    return this
  }
  

  // LOADING DATA-API
  // ===============
  $(window).on('load.vs.loading.data-api', function () {
    $('.loading').each(function () {
      var $loading = $(this);
      Plugin.call($loading, $loading.data());
    })
  });

  //ajax 전송 전/후 로딩 이미지 설정
  $(document).on({
      ajaxSend: function(e){
          $("body").setLoading('show');
          ajaxEvents++;
      },
      ajaxComplete: function(e){
          if (ajaxEvents == 1) {
              $("body").setLoading('hide');			
          }
          ajaxEvents--;
      },
      ajaxError: function(e){
          ajaxEvents = 0;
          $("body").setLoading('hide');
      }
  });

}(jQuery);
