const cover = document.getElementById('cover');
const invitation = document.getElementById('shaqyru');
const envelope = cover.querySelector('.envelope-button');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let openTimer = 0;

function showCover() {
  window.clearTimeout(openTimer);
  cover.classList.remove('is-opening');
  invitation.inert = true;
  cover.hidden = false;
  document.documentElement.classList.add('cover-visible');
  window.scrollTo(0, 0);
}

function showInvitation(moveFocus) {
  window.clearTimeout(openTimer);
  cover.hidden = true;
  cover.classList.remove('is-opening');
  invitation.inert = false;
  document.documentElement.classList.remove('cover-visible');
  window.scrollTo(0, 0);
  if (moveFocus) {
    invitation.focus({ preventScroll: true });
  }
}

envelope.addEventListener('click', (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  if (cover.classList.contains('is-opening')) {
    return;
  }
  history.pushState(null, '', '#shaqyru');
  if (reducedMotion.matches) {
    showInvitation(true);
    return;
  }
  cover.classList.add('is-opening');
  openTimer = window.setTimeout(() => showInvitation(true), 880);
});

window.addEventListener('popstate', () => {
  if (location.hash === '#shaqyru') {
    showInvitation(true);
  } else {
    showCover();
    envelope.focus({ preventScroll: true });
  }
});

if (location.hash !== '#shaqyru') {
  showCover();
}
