// ZensCars Newquay — interactions
(function(){
  "use strict";

  // Nav solid-on-scroll
  var nav = document.querySelector('.nav');
  var onScroll = function(){
    if(!nav) return;
    if(window.scrollY > 40){ nav.classList.add('solid'); } else { nav.classList.remove('solid'); }
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // Animated stat counters
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1400, start = null;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target < 10 && target % 1 !== 0 ? (target * eased).toFixed(1) : Math.floor(target * eased);
          el.textContent = val + suffix;
          if(p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, {threshold:.5});
    counters.forEach(function(el){ cio.observe(el); });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    if(!q) return;
    q.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function(i){
        i.classList.remove('open');
        var qq = i.querySelector('.faq-q');
        if(qq) qq.setAttribute('aria-expanded', 'false');
      });
      if(!wasOpen){
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
    // A div[role=button] does not synthesise a click from Enter/Space the way a
    // native <button> does, so without this the accordion is mouse-only.
    q.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
        e.preventDefault();   // stop Space scrolling the page
        q.click();
      }
    });
  });

  // Contact form (static demo — wires up to mailto/WhatsApp until a form backend is connected)
  var form = document.getElementById('bookingForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var name = data.get('name') || '';
      var pickup = data.get('pickup') || '';
      var dropoff = data.get('dropoff') || '';
      var when = data.get('when') || '';
      var notes = data.get('notes') || '';
      var msg = 'Hi Wayne, booking enquiry from the website:%0A' +
        'Name: ' + encodeURIComponent(name) + '%0A' +
        'Pickup: ' + encodeURIComponent(pickup) + '%0A' +
        'Drop-off: ' + encodeURIComponent(dropoff) + '%0A' +
        'Date/time: ' + encodeURIComponent(when) + '%0A' +
        'Notes: ' + encodeURIComponent(notes);
      window.location.href = 'https://wa.me/447376299060?text=' + msg;
    });
  }

  // Current year in footer
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

})();
