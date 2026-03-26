let _show = null;
let _hide = null;

export const UILoader = {
  register(show, hide) {
    _show = show;
    _hide = hide;
  },

  show(message = '') {
    _show?.(message);
  },

  hide() {
    _hide?.();
  },
};
