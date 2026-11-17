(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  if(!location.hash)window.scrollTo({top:0,left:0,behavior:'instant'});
  window.addEventListener('pageshow',function(){if(!location.hash)window.scrollTo({top:0,left:0,behavior:'instant'})});})();
(function(){
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});els.forEach(function(e){io.observe(e)})}
  else els.forEach(function(e){e.classList.add('in')});
  var lb=document.getElementById('lb'),li=lb.querySelector('img');
  // owner unlock: open any project once with ?owner in the address and this browser keeps full zoom
  var owner=false;try{if(/[?&]owner\b/.test(location.search))localStorage.setItem('tt-owner','1');owner=localStorage.getItem('tt-owner')==='1'}catch(e){}
  var noz=document.body.hasAttribute('data-nozoom')&&!owner;
  if(noz){document.body.classList.add('nozoom');document.addEventListener('contextmenu',function(e){if(e.target.closest('.work,.phone,.hero'))e.preventDefault()});document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault()})}
  else document.querySelectorAll('.work img').forEach(function(im){im.addEventListener('click',function(){li.src=im.currentSrc||im.src;li.alt=im.alt;lb.hidden=false})});
  // phone mockups: build screens from data-screens, cycle when more than one
  document.querySelectorAll('.phone[data-screens]').forEach(function(ph,pi){var list=ph.getAttribute('data-screens').split(',');var scr=document.createElement('div');scr.className='scr'+(ph.hasAttribute('data-fill')?' fill':'');ph.appendChild(scr);
    var sls=list.map(function(src,k){var d=document.createElement('div');d.className='sl'+(k===0?' on':'');var bg=document.createElement('div');bg.className='bg';bg.style.backgroundImage='url("'+src+'")';var im=document.createElement('img');im.src=src;im.alt=ph.getAttribute('aria-label')||'';im.loading='lazy';d.appendChild(bg);d.appendChild(im);scr.appendChild(d);return d});
    if(ph.hasAttribute('data-ig')){var ig=document.createElement('div');ig.className='ig';ig.innerHTML='<i></i>'+ph.getAttribute('data-ig');scr.appendChild(ig)}
    var dots=null;if(list.length>1){dots=document.createElement('div');dots.className='dots';list.forEach(function(x,k){var b=document.createElement('b');if(!k)b.className='on';dots.appendChild(b)});scr.appendChild(dots)}
    var fr=document.createElement('img');fr.className='frame';fr.src=ph.getAttribute('data-frame')||'../mock/front.webp';fr.alt='';ph.appendChild(fr);
    if(list.length>1){var a=0;setTimeout(function(){setInterval(function(){if(document.hidden)return;sls[a].classList.remove('on');dots.children[a].classList.remove('on');a=(a+1)%list.length;sls[a].classList.add('on');dots.children[a].classList.add('on')},3200)},pi*900)}
    if(!noz)scr.addEventListener('click',function(){var on=scr.querySelector('.sl.on img');li.src=on.src;li.alt=on.alt;lb.hidden=false})});
  lb.addEventListener('click',function(){lb.hidden=true});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.hidden=true});
})();

/* header: visible while scrolling (and at the top of the page), hidden when scrolling stops */
(function(){var t=0,near=false,b=document.body;
  function hide(){if(window.scrollY>80&&!near&&!b.classList.contains('editing')&&!(document.activeElement&&document.activeElement.closest&&document.activeElement.closest('.tl,.tc,.tr')))b.classList.add('hdr-hide')}
  function show(){b.classList.remove('hdr-hide');clearTimeout(t);t=setTimeout(hide,1200)}
  window.addEventListener('scroll',show,{passive:true});
  window.addEventListener('mousemove',function(e){var n=e.clientY<70;if(n!==near){near=n;if(n)show();else{clearTimeout(t);t=setTimeout(hide,1200)}}},{passive:true});
  document.addEventListener('focusin',function(e){if(e.target.closest&&e.target.closest('.tl,.tc,.tr'))b.classList.remove('hdr-hide')});
  t=setTimeout(hide,1200);})();

/* mobile: arrows + dots under each phone row, synced to the swipe */
(function(){document.querySelectorAll('.phones').forEach(function(row){var ph=row.querySelectorAll('.phone');if(ph.length<2)return;
  var c=document.createElement('div');c.className='ph-ctl';c.innerHTML='<button type="button" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><span class="pd"></span><button type="button" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>';
  row.parentNode.insertBefore(c,row.nextSibling);var pd=c.querySelector('.pd');ph.forEach(function(){pd.appendChild(document.createElement('i'))});
  function cur(){var r=row.getBoundingClientRect(),mid=r.left+r.width/2,best=0,d=1e9;ph.forEach(function(p,k){var b=p.getBoundingClientRect(),dd=Math.abs(b.left+b.width/2-mid);if(dd<d){d=dd;best=k}});return best}
  function mark(){var k=cur();[].forEach.call(pd.children,function(i,j){i.classList.toggle('on',j===k)})}
  function go(k){k=Math.max(0,Math.min(ph.length-1,k));var p=ph[k];row.scrollTo({left:p.offsetLeft-(row.clientWidth-p.offsetWidth)/2,behavior:'smooth'})}
  c.children[0].addEventListener('click',function(){go(cur()-1)});c.children[2].addEventListener('click',function(){go(cur()+1)});
  row.addEventListener('scroll',function(){requestAnimationFrame(mark)},{passive:true});mark();
  // touch swipe fallback (works even where native horizontal scroll is swallowed)
  var sx=0,sy=0;row.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  row.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){var k=cur();setTimeout(function(){if(cur()===k)go(k+(dx<0?1:-1))},120)}},{passive:true});
})})();
/* lazy videos: load and play only when near the screen, pause when away */
(function(){var vs=document.querySelectorAll('video[data-src]');if(!vs.length)return;
  if(!('IntersectionObserver' in window)){vs.forEach(function(v){v.src=v.dataset.src});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){if(!v.getAttribute('src')){v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.src=v.dataset.src;v.load()}var p=v.play();if(p&&p.catch)p.catch(function(){})}else if(v.getAttribute('src'))v.pause()})},{rootMargin:'300px 0px'});
  vs.forEach(function(v){io.observe(v)})})();

