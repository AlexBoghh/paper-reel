export function validateMotionPlan(plan) {
  const errs = [];
  if (!plan.version) errs.push('missing version');
  if (!plan.timestamp) errs.push('missing timestamp');
  if (!plan.viewport?.w || !plan.viewport?.h) errs.push('missing viewport.w/h');
  if (!plan.duration) errs.push('missing duration');
  if (!Array.isArray(plan.citations) || plan.citations.length === 0) {
    errs.push('citations must be non-empty array');
  }
  if (!Array.isArray(plan.timeline)) errs.push('timeline must be array');
  if (!Array.isArray(plan.captions) || plan.captions.length !== 8) {
    errs.push('captions must have exactly 8 entries');
  }
  (plan.timeline || []).forEach((t, ti) => {
    if (!t.id) errs.push(`timeline[${ti}]: missing id`);
    if (!t.recipeId) errs.push(`timeline[${ti}]: missing recipeId`);
    if (!Array.isArray(t.scrollRange) || t.scrollRange.length !== 2) {
      errs.push(`timeline[${ti}]: scrollRange must be [start, end]`);
    }
    (t.primitives || []).forEach((p, pi) => {
      if (!p.kind) errs.push(`timeline[${ti}].primitives[${pi}]: missing kind`);
      if (!p.selector) errs.push(`timeline[${ti}].primitives[${pi}]: missing selector`);
      if (p.ease === undefined) errs.push(`timeline[${ti}].primitives[${pi}]: missing ease`);
    });
  });
  // content is OPTIONAL. When present, must be an object keyed by recipeIds
  // that appear in citations[]. Per-recipe contentShape validation is lazy —
  // compose-time concern, not schema-time.
  if (plan.content !== undefined) {
    if (typeof plan.content !== 'object' || plan.content === null || Array.isArray(plan.content)) {
      errs.push('content must be an object keyed by recipeId');
    } else {
      const cited = new Set((plan.citations || []).map(c => c.recipeId));
      for (const key of Object.keys(plan.content)) {
        if (!cited.has(key)) {
          errs.push(`content.${key}: no matching citation with recipeId "${key}"`);
        }
      }
    }
  }
  return errs;
}
