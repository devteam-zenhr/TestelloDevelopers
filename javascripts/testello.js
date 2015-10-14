$(document).ready(function(){
  var $body   = $(document.body);

  $(window).bind('scroll', function(){
    if($(window).scrollTop() > 600) {
      $('#top-link-block').css({top: $(window).height() - ($('#back-to-top').outerHeight(true) + $('footer').outerHeight(true) + 40)});
      $('#sidebar-wrapper').css({top: 50});
      $('#top-link-block').show('slow');
    } else {
      $('#sidebar-wrapper').css({top: 160});
      $('#top-link-block').fadeOut(1000);
    }
  });


  $('#sidebar-wrapper').affix({
    offset: {
      top: 5
    }
  });

  $body.scrollspy({
    target: '#sidebar-wrapper',
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
