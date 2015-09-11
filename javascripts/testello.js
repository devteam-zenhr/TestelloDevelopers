$(document).ready(function(){
  var $body   = $(document.body);

  $(window).bind('scroll', function(){
    if($(window).scrollTop() > 600) {
      $('#top-link-block').css({top: $(window).height() - ($('#back-to-top').outerHeight(true) + $('footer').outerHeight(true) + 40)});
      $('#top-link-block').show('slow');
    } else {
      $('#top-link-block').fadeOut(1000);
    }
  });

  $('.col-md-4.border-right').affix({
    offset: {
      top: 10,
      bottom: 235
    }
  });

  $body.scrollspy({
    target: '.col-md-4.border-right',
    offset: 10
  });

  /* smooth scrolling sections */
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 50
        }, 1000);
        return false;
      }
    }
  });
});
