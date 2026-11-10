// $app/navigation, inert: islands never navigate (links inside a scripted demo go nowhere).
export const goto = async () => {};
export const invalidate = async () => {};
export const invalidateAll = async () => {};
export const beforeNavigate = () => {};
export const afterNavigate = () => {};
export const onNavigate = () => {};
export const pushState = () => {};
export const replaceState = () => {};
export const preloadData = async () => ({ type: 'loaded', status: 200, data: {} });
export const preloadCode = async () => {};
