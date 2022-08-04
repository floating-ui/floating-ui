import { autoUpdate, computePosition, Placement, Strategy } from '@floating-ui/dom';
import { HTMLAttributes } from 'react';

interface FloatingUICustomElement {
  reference: HTMLElement;
  floating: HTMLElement;
  placement: Placement;
  strategy: Strategy;
  cleanup: () => void;
}

type CustomElement<T> = Partial<T & HTMLAttributes<T> & { children: any }>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ['direct-host-child']: CustomElement<FloatingUICustomElement>;
      ['deep-host-child']: CustomElement<FloatingUICustomElement>;
      ['relative-position-host']: CustomElement<typeof HTMLElement>;
      ['shadowed-floating-owner']: CustomElement<FloatingUICustomElement>;
    }
  }
}

const directHostChildTag = 'direct-host-child';
const deepHostChildTag = 'deep-host-child';
const relativePositionHostTag = 'relative-position-host';
const shadowedFloatingOwnerTag = 'shadowed-floating-owner';
export const useCases = [directHostChildTag, deepHostChildTag]

export function defineElements(): void {
  defineIfNeeded(
    directHostChildTag,
    class DirectHostChild extends HTMLElement implements FloatingUICustomElement {
      static get observedAttributes() { return ['placement', 'strategy', 'style']; }

      reference: HTMLElement;
      floating: HTMLElement;
      placement: Placement = defaultOptions.placement;
      strategy: Strategy = defaultOptions.strategy;
      cleanup!: () => void;

      constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        this.reference = createReferenceElement();
        this.floating = createFloatingElement();
        const style = recreateDocumentStyle();
        shadow.append(style, this.reference, this.floating);
      }

      attributeChangedCallback<N extends Extract<keyof this, 'placement' | 'strategy'>, V extends Placement | Strategy>(name: N, _oldValue: V, value: V): void {
        if (name === 'placement') {
          this.placement = value as Placement;
        } else if (name === 'strategy') {
          this.strategy = value as Strategy;
          this.floating.style.position = value;
        }

        position(this);
      }

      connectedCallback(): void {
        this.cleanup = setUpAutoUpdate(this);
      }

      disconnectedCallback(): void {
        this.cleanup?.();
      }
    }
  );

  defineIfNeeded(
    deepHostChildTag,
    class DeepHostChild extends HTMLElement implements FloatingUICustomElement {
      static get observedAttributes() { return ['placement', 'strategy', 'style']; }

      container: HTMLElement;
      reference: HTMLElement;
      floating: HTMLElement;
      placement: Placement = defaultOptions.placement;
      strategy: Strategy = defaultOptions.strategy;
      cleanup!: () => void;

      constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        this.reference = createReferenceElement();
        this.floating = createFloatingElement();
        this.container = document.createElement('div');
        this.container.append(this.reference, this.floating);
        const style = recreateDocumentStyle();
        shadow.append(style, this.container);
      }

      attributeChangedCallback<N extends Extract<keyof this, 'placement' | 'strategy'>, V extends Placement | Strategy>(name: N, _oldValue: V, value: V): void {
        if (name === 'placement') {
          this.placement = value as Placement;
        } else if (name === 'strategy') {
          this.strategy = value as Strategy;
          this.floating.style.position = value;
        }

        position(this);
      }

      connectedCallback(): void {
        this.cleanup = setUpAutoUpdate(this);
      }

      disconnectedCallback(): void {
        this.cleanup?.();
      }
    }
  );

  defineIfNeeded(
    relativePositionHostTag,
    class RelativePositionHost extends HTMLElement {
      constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        const slot = document.createElement('slot');
        wrapper.append(slot);
        const style = recreateDocumentStyle();
        shadow.append(style, wrapper);
      }
    },
  );

  defineIfNeeded(
    shadowedFloatingOwnerTag,
    class ShadowedFloatingOwner extends HTMLElement implements FloatingUICustomElement {
      static get observedAttributes() { return ['placement', 'strategy', 'style']; }

      reference!: HTMLElement;
      floating: HTMLElement;
      placement: Placement = defaultOptions.placement;
      strategy: Strategy = defaultOptions.strategy;
      cleanup!: () => void;

      constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        this.floating = createFloatingElement();
        const style = recreateDocumentStyle();
        shadow.append(style, this.floating);
      }

      attributeChangedCallback<N extends Extract<keyof this, 'placement' | 'strategy'>, V extends Placement | Strategy>(name: N, _oldValue: V, value: V): void {
        if (name === 'placement') {
          this.placement = value as Placement;
        } else if (name === 'strategy') {
          this.strategy = value as Strategy;
          this.floating.style.position = value;
        }

        position(this);
      }

      connectedCallback(): void {
        this.reference?.remove();
        this.reference = document.querySelector(`#reference`) as HTMLElement;
        this.cleanup = setUpAutoUpdate(this);
      }

      disconnectedCallback(): void {
        this.cleanup?.();
      }
    }
  );
}

function defineIfNeeded(tag: string, customElementConstructor: CustomElementConstructor): void {
  if (!customElements.get(tag)) {
    customElements.define(tag, customElementConstructor);
  }
}

function recreateDocumentStyle(): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = Array.from(document.styleSheets[0].cssRules).map(rule => rule.cssText).join('\n');
  return style;
}

function createReferenceElement(): HTMLDivElement {
  const reference = document.createElement('div');
  reference.innerHTML = 'Reference';
  reference.classList.add('reference');
  return reference;
}

function createFloatingElement(): HTMLDivElement {
  const floating = document.createElement('div');
  floating.innerHTML = 'Floating';
  floating.classList.add('floating');
  return floating;
}

const defaultOptions = {
  strategy: 'absolute',
  placement: 'bottom-end',
} as const;

async function position({ floating, placement, reference, strategy }: FloatingUICustomElement): Promise<void> {
  if (!floating || !reference) {
    return;
  }

  return computePosition(reference, floating, {
        placement,
        strategy,
      }).then(({ x, y }) => {
        Object.assign(floating.style, {
          position: strategy,
          left: `${x ?? 0}px`,
          top: `${y ?? 0}px`,
        });
      });
}

function setUpAutoUpdate(element: FloatingUICustomElement): () => void {
  const { floating, reference } = element;

  if (!floating || !reference) {
    return () => {};
  }

  return autoUpdate(reference, floating, () => position(element), {
      // ensures initial positioning is accurate
      animationFrame: true
    }
  );
}
