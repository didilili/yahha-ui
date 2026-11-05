import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import brandLogo from '../assets/brand/yahha-ui-logo.svg';
import brandLogoOnDark from '../assets/brand/yahha-ui-logo-on-dark.svg';
import motionArtwork from '../assets/brand/yahha-ui-logo-motion.svg?raw';
import { createBrandMotion, type BrandMotionController } from './brand-logo-motion';
import './brand-logo.css';

/** The documentation site's approved F2 logo; it is not a library export. */
export default function BrandLogo({ inactive = false }: { inactive?: boolean }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
  const controllerRef = useRef<BrandMotionController | null>(null);
  const inactiveRef = useRef(inactive);
  const id = useId();

  useEffect(() => {
    inactiveRef.current = inactive;
    if (inactive) controllerRef.current?.stop();
  }, [inactive]);

  // Set up the shared SVG before paint, avoiding an initial image-to-SVG snap.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const image = container?.querySelector('img');
    if (!container || !overlay || !image) return;
    const brandImage = image;
    const controller = createBrandMotion(
      container,
      overlay,
      motionArtwork,
      `yahha-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}-`,
    );
    if (!controller) return;
    controllerRef.current = controller;
    const target = container.closest('a') ?? container;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let imageReady = false;
    let pendingWelcome = true;
    let firstFrame = 0;
    let secondFrame = 0;

    function play() {
      if (
        disposed ||
        !imageReady ||
        !brandImage.complete ||
        !brandImage.naturalWidth ||
        inactiveRef.current ||
        target.closest('[inert]') ||
        document.hidden ||
        reducedMotion.matches
      )
        return;
      if (controller!.play()) pendingWelcome = false;
    }

    function welcome() {
      if (!pendingWelcome || disposed) return;
      if (reducedMotion.matches) {
        pendingWelcome = false;
        return;
      }
      play();
    }

    function scheduleWelcome() {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(welcome);
      });
    }

    function pointerEnter(event: Event) {
      if ((event as PointerEvent).pointerType !== 'touch') play();
    }

    function focus() {
      if (target.matches(':focus-visible')) play();
    }

    function visibilityChange() {
      if (document.hidden) controller!.stop();
      else if (pendingWelcome) scheduleWelcome();
    }

    function preferenceChange() {
      if (reducedMotion.matches) {
        pendingWelcome = false;
        controller!.stop();
      }
    }

    function pageShow(event: PageTransitionEvent) {
      if (!event.persisted) return;
      controller!.stop();
      pendingWelcome = true;
      scheduleWelcome();
    }

    function pageHide() {
      controller!.stop();
    }

    target.addEventListener('pointerenter', pointerEnter);
    target.addEventListener('focus', focus);
    reducedMotion.addEventListener('change', preferenceChange);
    document.addEventListener('visibilitychange', visibilityChange);
    window.addEventListener('pageshow', pageShow);
    window.addEventListener('pagehide', pageHide);
    void brandImage
      .decode()
      .then(() => {
        if (disposed) return;
        imageReady = true;
        scheduleWelcome();
      })
      .catch(() => {
        // A failed image or decode keeps the original picture and does not animate.
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      target.removeEventListener('pointerenter', pointerEnter);
      target.removeEventListener('focus', focus);
      reducedMotion.removeEventListener('change', preferenceChange);
      document.removeEventListener('visibilitychange', visibilityChange);
      window.removeEventListener('pageshow', pageShow);
      window.removeEventListener('pagehide', pageHide);
      controller.destroy();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [id]);

  return (
    <span ref={containerRef} className="brand-logo" data-motion-state="idle">
      <picture className="brand-logo-static">
        <source
          media="(forced-colors: active) and (prefers-color-scheme: dark)"
          srcSet={brandLogoOnDark}
        />
        <img src={brandLogo} width="847" height="280" alt="" />
      </picture>
      <span ref={overlayRef} className="brand-logo-motion" aria-hidden="true" />
    </span>
  );
}
