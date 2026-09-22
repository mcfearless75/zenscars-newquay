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
    var setMenu = function(open, returnFocus){
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      if(open){
        var first = links.querySelector('a');
        if(first) first.focus();
      } else if(returnFocus){
        toggle.focus();
      }
    };

    toggle.addEventListener('click', function(){
      setMenu(!links.classList.contains('open'), true);
    });

    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setMenu(false, false); });
    });

    // Escape closes the panel and hands focus back to the button.
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')) setMenu(false, true);
    });

    // Keep Tab inside the open panel — otherwise focus walks into the page
    // behind it, which is invisible to a keyboard user.
    links.addEventListener('keydown', function(e){
      if(e.key !== 'Tab' || !links.classList.contains('open')) return;
      var items = [toggle].concat(Array.prototype.slice.call(links.querySelectorAll('a')));
      var first = items[0], last = items[items.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
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
  // The CSS media query kills transitions, but this counter is scripted motion
  // and has to opt out on its own.
  var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length && noMotion){
    counters.forEach(function(el){
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  } else if(counters.length && 'IntersectionObserver' in window){
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
