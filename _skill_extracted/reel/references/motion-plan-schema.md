# motion-plan.json schema

The motion plan is the single source of truth for a Reel run. It feeds:

- `tools/sample-timeline.mjs` → `frames.json` (drives storyboard frame layouts)
- `tools/compose-export.mjs` → preview HTML + export JS (drives runtime motion)
- `tools/validate-export.mjs` → recipe signature + plan completeness gate
- `chrome-templates/citation-slab.html` parameter rail (Phase 5)
- diff mode (Phase 6) — comparison and unchanged-frame detection

If you can't express it in motion-plan.json, you can't render it. Add to the schema before improvising.

## Top-level shape

| Key | Type | Required | Notes |
|---|---|---|---|
| `version` | int | yes | currently `1` |
| `timestamp` | string | yes | matches the file stem |
| `parent` | string \| null | yes | timestamp of the v1 this iterates from, or null |
| `viewport` | `{ w, h }` | yes | matches the SOURCE/frame aspect ratio |
| `duration` | number | yes | seconds; drives SMPTE timecodes |
| `citations` | `Citation[]` | yes | drives MOTION PLAN slabs |
| `timeline` | `TimelineEntry[]` | yes | drives sampler + composer |
| `params` | `{ [recipeId]: Params }` | yes | drives parameter rail and completeness gate |
| `captions` | `string[8]` | yes | one per storyboard frame |

## Citation

```ts
{
  recipeId: string,            // 'mwg_010'
  role: 'PRIMARY' | 'SECONDARY' | 'TERTIARY',
  category: 'CARD SCROLL' | 'TEXT',
  opts: { [key]: any }         // satisfies recipe.requiredOpts
}
```

## TimelineEntry

```ts
{
  id: string,                  // unique within the plan
  recipeId: string,            // matches one of citations[].recipeId
  scrollRange: [start, end],   // 0..100, the scroll % window this entry spans
  primitives: Primitive[]
}
```

## Primitive

```ts
{
  kind: 'translateX' | 'translateY' | 'scale' | 'opacity' | 'rotate' | 'width' | 'height',
  selector: string,            // CSS selector targeting one or many elements
  from: number,
  to: number,
  ease: string,                // GSAP ease name, e.g. 'power2.out', 'back.inOut(3)'
  stagger?: { count: number, amount: number }   // amount in scroll-fraction units
}
```

When `stagger` is present, each of `count` matched elements gets a per-index scroll offset of `index × amount × (scrollRange.end - scrollRange.start) / 100`.

## Params

```ts
{
  pin?: boolean,
  scrub?: boolean | number,
  ease?: string,               // recipe-level default ease (informational)
  start?: string,              // ScrollTrigger start
  end?: string                 // ScrollTrigger end
}
```

Each recipe declares a `meaningfulParams: string[]` — every key in that list must be set in `params[recipeId]` or the validator rejects the plan.

## Validation

Use `tools/lib/motion-plan-schema.mjs → validateMotionPlan(plan)` for shape. Use `tools/validate-export.mjs → validateMotionPlanCompleteness(plan, { recipeRoot })` for the params completeness gate. Both return `string[]` of errors; empty array means valid.
