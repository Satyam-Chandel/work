import { wfCustomElementsWrapper } from '@broadridge/components';
import PageApp from './PageApp';

// Determine if running in standalone mode via environment variable
const isStandalone = process.env.WF_STANDALONE_BUILD === 'true';

customElements.define(
  'trade-blotter-widget',
  wfCustomElementsWrapper({ Component: PageApp, initialized: isStandalone })
);
