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

  // About-page photo rotator. Crossfades a small set of photos of Wayne.
  // Auto-advance is suppressed under prefers-reduced-motion, and the toggle
  // gives everyone else a way to stop it (WCAG 2.2.2 Pause, Stop, Hide).
  var rotator = document.querySelector('.photo-rotator');
  if(rotator){
    var slides = Array.prototype.slice.call(rotator.querySelectorAll('.rotator-frame img'));
    var rotToggle = rotator.querySelector('.rotator-toggle');
    var idx = 0, timer = null;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var show = function(n){
      slides[idx].classList.remove('is-active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
    };
    var start = function(){
      if(still || timer || slides.length < 2) return;
      timer = setInterval(function(){ show(idx + 1); }, 4500);
      if(rotToggle) rotToggle.setAttribute('aria-label', 'Pause photo slideshow');
    };
    var stop = function(){
      clearInterval(timer); timer = null;
      if(rotToggle) rotToggle.setAttribute('aria-label', 'Play photo slideshow');
    };

    if(rotToggle){
      if(still){
        rotToggle.hidden = true;          // nothing is moving, so nothing to pause
      } else {
        rotToggle.addEventListener('click', function(){ timer ? stop() : start(); });
      }
    }
    // Hold still while someone is reading or tabbing through it.
    rotator.addEventListener('mouseenter', function(){ if(timer) clearInterval(timer), timer = null; });
    rotator.addEventListener('mouseleave', function(){ if(rotToggle && rotToggle.getAttribute('aria-label').indexOf('Pause') === 0) start(); });
    document.addEventListener('visibilitychange', function(){ document.hidden ? clearInterval(timer) : null; });
    start();
  }

  // Contact form — composes a pre-filled WhatsApp message via a wa.me deep link.
  var form = document.getElementById('bookingForm');
  if(form){
    // The form carries `novalidate`, which switches off the browser's own
    // enforcement of the `required` attributes. Without this check an empty
    // submit still fired, and Wayne received a message with every field blank.
    var setError = function(field, show){
      var err = document.getElementById('err-' + field.id);
      if(err) err.hidden = !show;
      field.setAttribute('aria-invalid', show ? 'true' : 'false');
    };

    form.querySelectorAll('[required]').forEach(function(field){
      field.addEventListener('input', function(){
        if(field.value.trim()) setError(field, false);
      });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();

      var invalid = [];
      form.querySelectorAll('[required]').forEach(function(field){
        var empty = !field.value.trim();
        setError(field, empty);
        if(empty) invalid.push(field);
      });
      if(invalid.length){
        invalid[0].focus();   // land the user on the first thing to fix
        return;
      }

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
