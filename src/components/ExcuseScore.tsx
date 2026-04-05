/* ========================================
   Excuse Quality Score — Lighthouse-style
   gauge (0-100) with jargon density,
   vagueness scoring, and bonus point rules.
   Wraps ExcuseMetrics with the correct API.
   ======================================== */

import ExcuseMetrics from './ExcuseMetrics';

interface Props {
  /** Combined standup text to analyze */
  standupText: string;
}

/* Re-export ExcuseMetrics under the requested name */
export default function ExcuseScore({ standupText }: Props) {
  return <ExcuseMetrics standupText={standupText} />;
}
