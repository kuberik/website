// Shared by check-logo.mjs and check-film-logo.mjs.
// The eyes are the two circles at cx 288.69 and 525.31 and the gear path drawn around the left one (its outline starts at M 215.315 603.094).
export function eyeFills(svg) {
  const fills = [];
  for (const m of svg.matchAll(/<circle\b[^>]*cx=["']?(288\.69|525\.30)[^>]*>/gi)) {
    const f = m[0].match(/fill=["']?(#[0-9a-f]{3,6})/i);
    fills.push(f ? f[1] : 'none');
  }
  for (const m of svg.matchAll(/<path\b[^>]*d=["']?\s*M\s*215\.315[\s,]+603\.094[^>]*>/gi)) {
    const f = m[0].match(/fill=["']?(#[0-9a-f]{3,6})/i);
    fills.push(f ? f[1] : 'none');
  }
  return fills;
}
