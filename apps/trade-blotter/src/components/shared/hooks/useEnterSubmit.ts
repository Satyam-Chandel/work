import { useEffect } from 'react';

interface UseEnterSubmitOptions {
  enabled?: boolean;
  onFallbackSubmit?: () => void;
  scopeSelector?: string;
  submitTargetSelector?: string;
}

const DEFAULT_SCOPE_SELECTOR =
  "[data-enter-submit-scope], [role='dialog'], [aria-modal='true'], [class*='drawer' i], [id*='drawer' i], [class*='modal' i], [id*='modal' i], [class*='popup' i], [id*='popup' i]";
const DEFAULT_SUBMIT_TARGET_SELECTOR = "[data-enter-submit-target], button[type='submit'], input[type='submit']";
const NEGATIVE_ACTION_TEXT_PATTERN = /cancel|close|back|clear/i;
const POSITIVE_ACTION_HINT_PATTERN = /submit|confirm|enter|update|save|apply|correct|dismiss/i;

const isVisible = (element: HTMLElement): boolean => {
  if (!element.isConnected) {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }

  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

const isDisabled = (element: HTMLElement): boolean => {
  if (element.hasAttribute('disabled')) {
    return true;
  }

  return element.getAttribute('aria-disabled') === 'true';
};

/** Dropdown/combobox toggles can be plain buttons; never treat them as submit actions. */
const isDropdownLikeTrigger = (element: HTMLElement): boolean => {
  const ariaHasPopup = element.getAttribute('aria-haspopup')?.toLowerCase();
  if (ariaHasPopup && ariaHasPopup !== 'false') {
    return true;
  }

  const role = element.getAttribute('role')?.toLowerCase();
  if (role === 'combobox' || role === 'listbox' || role === 'option' || role === 'menu') {
    return true;
  }

  const combined = `${element.id || ''} ${element.className?.toString() || ''} ${
    element.getAttribute('aria-label') || ''
  }`;
  return /dropdown|combobox|select/i.test(combined);
};

/** Regions that handle Enter themselves (e.g. trade-action drawer body). Do not rank inner buttons as submit. */
const isInsideEnterSubmitOptOutRegion = (element: HTMLElement): boolean =>
  Boolean(element.closest("[data-enter-submit='false']"));

/** Trade actions drawer: avoid onFallbackSubmit (trade entry) when this overlay is open but no target was found. */
const isTradeActionDrawerVisible = (): boolean => {
  const el = document.getElementById('drawer-tb-action');
  return el instanceof HTMLElement && isVisible(el);
};

const canUseEnterSubmit = (target: HTMLElement | null): boolean => {
  if (!target) {
    return false;
  }

  if (target.closest("[data-enter-submit='false']")) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  if (tagName === 'textarea' || target.isContentEditable) {
    return false;
  }

  return true;
};

/** Opt-out: any ancestor on composedPath may be the opt-out root (closest() alone misses from inside shadow). */
const isEventInsideEnterSubmitOptOut = (event: KeyboardEvent): boolean => {
  const path = event.composedPath?.() ?? [];
  return path.some(
    (node) => node instanceof HTMLElement && node.matches("[data-enter-submit='false']")
  );
};

const getEventTarget = (event: KeyboardEvent): HTMLElement | null => {
  const path = event.composedPath?.() ?? [];
  for (const pathNode of path) {
    if (pathNode instanceof HTMLElement) {
      return pathNode;
    }
  }

  return event.target instanceof HTMLElement ? event.target : null;
};

/**
 * When a dropdown/list is open or an option is highlighted, Enter must select the option — not submit the form.
 * Also covers comboboxes that keep focus on the input while the list is portaled (aria-activedescendant).
 */
const shouldDeferEnterToNativeControl = (event: KeyboardEvent): boolean => {
  if (event.target instanceof HTMLElement) {
    const rawTarget = event.target;
    if (rawTarget.tagName === 'TEXTAREA' || rawTarget.isContentEditable) {
      return true;
    }
  }

  const path = event.composedPath?.() ?? [];
  for (const node of path) {
    if (!(node instanceof HTMLElement)) {
      continue;
    }
    const role = node.getAttribute('role')?.toLowerCase();
    if (
      role === 'option' ||
      role === 'menuitem' ||
      role === 'menuitemradio' ||
      role === 'menuitemcheckbox'
    ) {
      return true;
    }
    if ((role === 'listbox' || role === 'menu') && isVisible(node)) {
      return true;
    }
  }

  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    if (active.tagName === 'TEXTAREA' || active.isContentEditable) {
      return true;
    }

    const activeDescendantId = active.getAttribute('aria-activedescendant');
    if (activeDescendantId) {
      const highlighted = document.getElementById(activeDescendantId);
      if (highlighted instanceof HTMLElement) {
        const hr = highlighted.getAttribute('role')?.toLowerCase();
        if (hr === 'option' || hr === 'menuitem' || hr === 'menuitemradio' || hr === 'menuitemcheckbox') {
          return true;
        }
      }
    }

    if (active.getAttribute('aria-expanded') === 'true') {
      const ar = active.getAttribute('role')?.toLowerCase();
      if (ar === 'combobox') {
        return true;
      }
      const hasPopup = active.getAttribute('aria-haspopup')?.toLowerCase();
      if (hasPopup === 'listbox' || hasPopup === 'menu' || hasPopup === 'true') {
        return true;
      }
    }

    if (active.closest('[role="listbox"], [role="menu"]')) {
      return true;
    }
  }

  return false;
};

const rankSubmitCandidate = (element: HTMLElement): number => {
  let score = 0;

  if (element.matches("[data-enter-submit-target]")) {
    score += 100;
  }
  if (element.matches("button[type='submit'], input[type='submit']")) {
    score += 50;
  }

  const id = element.id || '';
  const ariaLabel = element.getAttribute('aria-label') || '';
  const text = element.textContent?.trim() || '';
  const className = element.className?.toString() || '';
  const combined = `${id} ${ariaLabel} ${text} ${className}`;

  if (POSITIVE_ACTION_HINT_PATTERN.test(combined)) {
    score += 20;
  }
  if (NEGATIVE_ACTION_TEXT_PATTERN.test(combined)) {
    score -= 50;
  }
  if (/primary/i.test(className)) {
    score += 10;
  }

  return score;
};

const getRankedTarget = (
  scope: ParentNode,
  submitTargetSelector: string
): HTMLElement | null => {
  const submitTargets = Array.from(scope.querySelectorAll<HTMLElement>(submitTargetSelector)).filter(
    (element) =>
      isVisible(element) &&
      !isDisabled(element) &&
      !isInsideEnterSubmitOptOutRegion(element) &&
      !isDropdownLikeTrigger(element)
  );
  if (submitTargets.length > 0) {
    const [bestSubmitTarget] = submitTargets.sort(
      (a, b) => rankSubmitCandidate(b) - rankSubmitCandidate(a)
    );
    return bestSubmitTarget ?? null;
  }

  const buttonTargets = Array.from(
    scope.querySelectorAll<HTMLElement>('button,input[type="button"],input[type="submit"]')
  ).filter(
    (element) =>
      isVisible(element) &&
      !isDisabled(element) &&
      !isInsideEnterSubmitOptOutRegion(element) &&
      !isDropdownLikeTrigger(element)
  );
  if (buttonTargets.length > 0) {
    const [bestButtonTarget] = buttonTargets.sort((a, b) => rankSubmitCandidate(b) - rankSubmitCandidate(a));
    if (bestButtonTarget != null && rankSubmitCandidate(bestButtonTarget) > 0) {
      return bestButtonTarget;
    }
  }

  return null;
};

const findAncestorActionScope = (target: HTMLElement): HTMLElement | null => {
  let node: HTMLElement | null = target;

  while (node && node !== document.body) {
    const actionButtons = Array.from(
      node.querySelectorAll<HTMLElement>('button,input[type="button"],input[type="submit"]')
    ).filter((element) => isVisible(element) && !isDisabled(element));

    const hasPositiveAction = actionButtons.some((element) => rankSubmitCandidate(element) > 0);
    if (actionButtons.length >= 2 && hasPositiveAction) {
      return node;
    }

    node = node.parentElement;
  }

  return null;
};

const getScopeAncestors = (target: HTMLElement, scopeSelector: string): HTMLElement[] => {
  const scopes: HTMLElement[] = [];
  let node: HTMLElement | null = target;

  while (node && node !== document.body) {
    if (node.matches(scopeSelector)) {
      scopes.push(node);
    }
    node = node.parentElement;
  }

  return scopes;
};

const getVisibleOverlayScopes = (scopeSelector: string): HTMLElement[] => {
  return Array.from(document.querySelectorAll<HTMLElement>(scopeSelector)).filter((scope) => isVisible(scope));
};

const findSubmitTarget = (
  target: HTMLElement,
  scopeSelector: string,
  submitTargetSelector: string
): HTMLElement | null => {
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const candidateScopes: HTMLElement[] = [
    ...getScopeAncestors(target, scopeSelector),
    ...(activeElement ? getScopeAncestors(activeElement, scopeSelector) : []),
  ];

  for (const scope of candidateScopes) {
    const targetInScope = getRankedTarget(scope, submitTargetSelector);
    if (targetInScope) {
      return targetInScope;
    }
  }

  const visibleOverlayScopes = getVisibleOverlayScopes(scopeSelector).reverse();
  for (const scope of visibleOverlayScopes) {
    const targetInScope = getRankedTarget(scope, submitTargetSelector);
    if (targetInScope) {
      return targetInScope;
    }
  }

  const ancestorScope = findAncestorActionScope(target) ?? (activeElement ? findAncestorActionScope(activeElement) : null);
  if (ancestorScope) {
    return getRankedTarget(ancestorScope, submitTargetSelector);
  }

  return null;
};

export const useEnterSubmit = (options?: UseEnterSubmitOptions): void => {
  const { enabled = true, onFallbackSubmit, scopeSelector, submitTargetSelector } = options ?? {};

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const enterHandler = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      if (isEventInsideEnterSubmitOptOut(event)) {
        return;
      }
      if (shouldDeferEnterToNativeControl(event)) {
        return;
      }
      const target = getEventTarget(event);
      if (!canUseEnterSubmit(target)) {
        return;
      }

      if (target) {
        const submitTarget = findSubmitTarget(
          target,
          scopeSelector ?? DEFAULT_SCOPE_SELECTOR,
          submitTargetSelector ?? DEFAULT_SUBMIT_TARGET_SELECTOR
        );
        if (submitTarget) {
          event.preventDefault();
          submitTarget.click();
          return;
        }
      }

      const form = target?.closest('form');
      if (form && form instanceof HTMLFormElement) {
        event.preventDefault();
        form.requestSubmit();
        return;
      }

      if (onFallbackSubmit) {
        if (isTradeActionDrawerVisible()) {
          return;
        }
        event.preventDefault();
        onFallbackSubmit();
      }
    };

    // Document capture runs after window capture so drawer modals (e.g. cancel-correct) can handle Enter first.
    document.addEventListener('keydown', enterHandler, true);
    return () => {
      document.removeEventListener('keydown', enterHandler, true);
    };
  }, [enabled, onFallbackSubmit, scopeSelector, submitTargetSelector]);
};

export default useEnterSubmit;
