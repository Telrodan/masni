export const mobileViewTreshold = 577;

export function isMobileView(): boolean {
  return (
    window.innerWidth < mobileViewTreshold ||
    window.outerWidth < mobileViewTreshold
  );
}
