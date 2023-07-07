let ready = false;
let cursorEle = null;
let isActive = false;
let styleTag = null;
const position = { x: 0, y: 0 };
const isServer = typeof document === "undefined";
const registeredNodeSet = new Set();
const eventMap = new Map();
const config = getDefaultConfig();
/**
 * Util collection
 */
class Utils {
  static clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
  static isNum(v) {
    return typeof v === "number" || /^\d+$/.test(v);
  }
  static getSize(size) {
    if (this.isNum(size)) return `${size}px`;
    return size;
  }
  static getDuration(duration) {
    if (this.isNum(duration)) return `${duration}ms`;
    return `${duration}`;
  }
  static getColor(color) {
    return color;
  }
  static objectKeys(obj) {
    return Object.keys(obj);
  }
  static style2Vars(style) {
    const map = {
      backdropBlur: "--cursor-bg-blur",
      backdropSaturate: "--cursor-bg-saturate",
      background: "--cursor-bg",
      border: "--cursor-border",
      durationBackdropFilter: "--cursor-blur-duration",
      durationBase: "--cursor-duration",
      durationPosition: "--cursor-position-duration",
      height: "--cursor-height",
      radius: "--cursor-radius",
      scale: "--cursor-scale",
      width: "--cursor-width",
      zIndex: "--cursor-z-index",
    };
    return this.objectKeys(style).reduce((prev, key) => {
      let value = style[key];
      if (value === undefined) return prev;
      const maybeColor = ["background", "border"].includes(key);
      const maybeSize = ["width", "height", "radius", "backdropBlur"].includes(
        key
      );
      const maybeDuration = key.startsWith("duration");
      if (maybeColor) value = this.getColor(value);
      if (maybeSize) value = this.getSize(value);
      if (maybeDuration) value = this.getDuration(value);
      const recordKey = map[key] || key;
      return { ...prev, [recordKey]: value };
    }, {});
  }
  static isMergebleObject(obj) {
    const isObject = (o) => o && typeof o === "object" && !Array.isArray(o);
    return isObject(obj) && Object.keys(obj).length > 0;
  }
  static mergeDeep(obj, ...sources) {
    if (!sources.length) return obj;
    const source = sources.shift();
    if (!source) return obj;
    if (this.isMergebleObject(obj) && this.isMergebleObject(source)) {
      Utils.objectKeys(source).forEach((key) => {
        if (this.isMergebleObject(source[key])) {
          if (!obj[key]) Object.assign(obj, { [key]: {} });
          this.mergeDeep(obj[key], source[key]);
        } else {
          Object.assign(obj, { [key]: source[key] });
        }
      });
    }
    return this.mergeDeep(obj, ...sources);
  }
}
/**
 * Get default config
 * @returns
 */
function getDefaultConfig() {
  const normalStyle = {
    width: "20px",
    height: "20px",
    radius: "50%",
    durationBase: "0.23s",
    durationPosition: "0s",
    durationBackdropFilter: "0s",
    background: "rgba(150, 150, 150, 0.2)",
    border: "1px solid rgba(100, 100, 100, 0.1)",
    zIndex: 9999,
    scale: 1,
    backdropBlur: "0px",
    backdropSaturate: "180%",
  };
  const textStyle = {
    width: "3px",
    height: "1.2em",
    border: "0px solid rgba(100, 100, 100, 0)",
    background: "rgba(100, 100, 100, 0.4)",
    durationBackdropFilter: "1s",
    radius: "10px",
  };
  const blockStyle = {
    background: "rgba(100, 100, 100, 0.1)",
    border: "1px solid rgba(100, 100, 100, 0.05)",
    backdropBlur: "0px",
    durationBase: "0.23s",
    durationBackdropFilter: "0.1s",
    backdropSaturate: "120%",
    radius: "10px",
  };
  const defaultConfig = {
    blockPadding: "auto",
    adsorptionStrength: 10,
    className: "ipad-cursor",
    normalStyle,
    textStyle,
    blockStyle,
  };
  return defaultConfig;
}
/** update cursor style (single or multiple) */
function updateCursorStyle(keyOrObj, value) {
  if (!cursorEle) return;
  if (typeof keyOrObj === "string") {
    value && cursorEle.style.setProperty(keyOrObj, value);
  } else {
    Object.entries(keyOrObj).forEach(([key, value]) => {
      cursorEle && cursorEle.style.setProperty(key, value);
    });
  }
}
/** record mouse position */
function recordMousePosition(e) {
  position.x = e.clientX;
  position.y = e.clientY;
}
/**
 * Init cursor, hide default cursor, and listen mousemove event
 * will only run once in client even if called multiple times
 * @returns
 */
function initCursor(_config) {
  if (isServer || ready) return;
  if (_config) updateConfig(_config);
  ready = true;
  window.addEventListener("mousemove", recordMousePosition);
  createCursor();
  createStyle();
  updateCursorPosition();
  updateCursor();
}
/**
 * destroy cursor, remove event listener and remove cursor element
 * @returns
 */
function disposeCursor() {
  if (!ready) return;
  ready = false;
  window.removeEventListener("mousemove", recordMousePosition);
  cursorEle && cursorEle.remove();
  styleTag && styleTag.remove();
  styleTag = null;
  cursorEle = null;
  // iterate nodesMap
  registeredNodeSet.forEach((node) => unregisterNode(node));
}
/**
 * Update current Configuration
 * @param _config
 */
function updateConfig(_config) {
  if ("adsorptionStrength" in _config) {
    config.adsorptionStrength = Utils.clamp(
      _config.adsorptionStrength || 10,
      0,
      30
    );
  }
  return Utils.mergeDeep(config, _config);
}
/**
 * Create style tag
 * @returns
 */
function createStyle() {
  if (styleTag) return;
  styleTag = document.createElement("style");
  styleTag.innerHTML = `
    body, * {
      cursor: none;
    }
    .${config.className.split(/\s+/).join(".")} {
      pointer-events: none;
      position: fixed;
      left: var(--cursor-x);
      top: var(--cursor-y);
      width: var(--cursor-width);
      height: var(--cursor-height);
      border-radius: var(--cursor-radius);
      background-color: var(--cursor-bg);
      border: var(--cursor-border);
      z-index: var(--cursor-z-index);
      font-size: var(--cursor-font-size);
      backdrop-filter: 
        blur(var(--cursor-bg-blur)) 
        saturate(var(--cursor-bg-saturate));
      transition:
        width var(--cursor-duration) ease,
        height var(--cursor-duration) ease,
        border-radius var(--cursor-duration) ease,
        border var(--cursor-duration) ease,
        background-color var(--cursor-duration) ease,
        left var(--cursor-position-duration) ease,
        top var(--cursor-position-duration) ease,
        backdrop-filter var(--cursor-blur-duration) ease;
      transform: 
        translate(calc(-50% + var(--cursor-translateX)), calc(-50% + var(--cursor-translateY))) 
        scale(var(--cursor-scale));
    }
  `;
  document.head.appendChild(styleTag);
}
/**
 * create cursor element, append to body
 * @returns
 */
function createCursor() {
  if (isServer) return;
  cursorEle = document.createElement("div");
  cursorEle.classList.add(config.className);
  document.body.appendChild(cursorEle);
  resetCursorStyle();
}
/**
 * update cursor position, request animation frame
 * @returns
 */
function updateCursorPosition() {
  if (isServer || !cursorEle) return;
  if (!isActive) {
    updateCursorStyle("--cursor-x", `${position.x}px`);
    updateCursorStyle("--cursor-y", `${position.y}px`);
  }
  window.requestAnimationFrame(updateCursorPosition);
}
/**
 * get all hover targets
 * @returns
 */
function queryAllTargets() {
  if (isServer || !ready) return [];
  const nodes = document.querySelectorAll("[data-cursor]");
  return nodes;
}
/**
 * Detect all interactive elements in the page
 * Update the binding of events, remove listeners for elements that are removed
 * @returns
 */
function updateCursor() {
  if (isServer || !ready) return;
  const nodes = queryAllTargets();
  const nodesMap = new Map();
  nodes.forEach((node) => {
    nodesMap.set(node, true);
    if (registeredNodeSet.has(node)) return;
    registerNode(node);
  });
  registeredNodeSet.forEach((node) => {
    if (nodesMap.has(node)) return;
    unregisterNode(node);
  });
}
function registerNode(node) {
  const type = node.getAttribute("data-cursor");
  registeredNodeSet.add(node);
  if (type === "text") registerTextNode(node);
  if (type === "block") registerBlockNode(node);
  else registeredNodeSet.delete(node);
}
function unregisterNode(node) {
  var _a;
  registeredNodeSet.delete(node);
  (_a = eventMap.get(node)) === null || _a === void 0
    ? void 0
    : _a.forEach(({ event, handler }) => {
        node.removeEventListener(event, handler);
      });
  eventMap.delete(node);
  node.style.setProperty("transform", "none");
}
function extractCustomStyle(node) {
  const customStyleRaw = node.getAttribute("data-cursor-style");
  const styleObj = {};
  if (customStyleRaw) {
    customStyleRaw.split(/(;)/).forEach((style) => {
      const [key, value] = style.split(":").map((s) => s.trim());
      styleObj[key] = value;
    });
  }
  return styleObj;
}
/**
 * + ---------------------- +
 * | TextNode               |
 * + ---------------------- +
 */
function registerTextNode(node) {
  function onTextOver(e) {
    updateCursorStyle(Utils.style2Vars(config.textStyle || {}));
    const dom = e.target;
    const fontSize = window.getComputedStyle(dom).fontSize;
    updateCursorStyle("--cursor-font-size", fontSize);
    updateCursorStyle(
      Utils.style2Vars({
        ...config.textStyle,
        ...extractCustomStyle(dom),
      })
    );
  }
  node.addEventListener("mouseover", onTextOver, { passive: true });
  node.addEventListener("mouseleave", resetCursorStyle, { passive: true });
  eventMap.set(node, [
    { event: "mouseover", handler: onTextOver },
    { event: "mouseleave", handler: resetCursorStyle },
  ]);
}
/**
 * + ---------------------- +
 * | BlockNode              |
 * + ---------------------- +
 */
function registerBlockNode(_node) {
  const node = _node;
  node.addEventListener("mouseenter", onBlockEnter, { passive: true });
  node.addEventListener("mousemove", onBlockMove, { passive: true });
  node.addEventListener("mouseleave", onBlockLeave, { passive: true });
  let timer;
  function onBlockEnter() {
    var _a, _b;
    const rect = node.getBoundingClientRect();
    timer && clearTimeout(timer);
    isActive = true;
    // for some edge case, two ele very close
    timer = setTimeout(() => (isActive = true));
    const blockPadding = config.blockPadding || 0;
    let padding = blockPadding;
    if (padding === "auto") {
      const size = Math.min(rect.width, rect.height);
      padding = Math.max(2, Math.floor(size / 25));
    }
    cursorEle.classList.add("focus");
    updateCursorStyle("--cursor-x", `${rect.left + rect.width / 2}px`);
    updateCursorStyle("--cursor-y", `${rect.top + rect.height / 2}px`);
    updateCursorStyle("--cursor-width", `${rect.width + padding * 2}px`);
    updateCursorStyle("--cursor-height", `${rect.height + padding * 2}px`);
    const styleToUpdate = {
      ...(config.blockStyle || {}),
      ...extractCustomStyle(node),
    };
    if (styleToUpdate.durationPosition === undefined) {
      styleToUpdate.durationPosition =
        (_a = styleToUpdate.durationBase) !== null && _a !== void 0
          ? _a
          : (_b = config.normalStyle) === null || _b === void 0
          ? void 0
          : _b.durationBase;
    }
    updateCursorStyle(Utils.style2Vars(styleToUpdate));
    toggleNodeTransition(true);
    node.style.setProperty(
      "transform",
      "translate(var(--translateX), var(--translateY))"
    );
  }
  function onBlockMove() {
    const rect = node.getBoundingClientRect();
    const halfHeight = rect.height / 2;
    const topOffset = (position.y - rect.top - halfHeight) / halfHeight;
    const halfWidth = rect.width / 2;
    const leftOffset = (position.x - rect.left - halfWidth) / halfWidth;
    const strength = config.adsorptionStrength || 10;
    updateCursorStyle(
      "--cursor-translateX",
      `${leftOffset * ((rect.width / 100) * strength)}px`
    );
    updateCursorStyle(
      "--cursor-translateY",
      `${topOffset * ((rect.height / 100) * strength)}px`
    );
    toggleNodeTransition(false);
    node.style.setProperty(
      "--translateX",
      `${leftOffset * ((rect.width / 100) * strength)}px`
    );
    node.style.setProperty(
      "--translateY",
      `${topOffset * ((rect.height / 100) * strength)}px`
    );
  }
  function onBlockLeave() {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      isActive = false;
      cursorEle && cursorEle.classList.remove("focus");
    });
    resetCursorStyle();
    toggleNodeTransition(true);
    node.style.setProperty("transform", "translate(0px, 0px)");
  }
  function toggleNodeTransition(enable) {
    var _a, _b, _c, _d, _e, _f;
    const duration = enable
      ? Utils.getDuration(
          (_f =
            (_d =
              (_b =
                (_a =
                  config === null || config === void 0
                    ? void 0
                    : config.blockStyle) === null || _a === void 0
                  ? void 0
                  : _a.durationPosition) !== null && _b !== void 0
                ? _b
                : (_c =
                    config === null || config === void 0
                      ? void 0
                      : config.blockStyle) === null || _c === void 0
                ? void 0
                : _c.durationBase) !== null && _d !== void 0
              ? _d
              : (_e =
                  config === null || config === void 0
                    ? void 0
                    : config.normalStyle) === null || _e === void 0
              ? void 0
              : _e.durationBase) !== null && _f !== void 0
            ? _f
            : "0.23s"
        )
      : "";
    node.style.setProperty(
      "transition",
      duration ? `all ${duration} cubic-bezier(.58,.09,.46,1.46)` : "none"
    );
  }
  eventMap.set(node, [
    { event: "mouseenter", handler: onBlockEnter },
    { event: "mousemove", handler: onBlockMove },
    { event: "mouseleave", handler: onBlockLeave },
  ]);
}
function resetCursorStyle() {
  updateCursorStyle(Utils.style2Vars(config.normalStyle || {}));
}
/**
 * Create custom style that can be bound to `data-cursor-style`
 * @param style
 */
function customCursorStyle(style) {
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}
const CursorType = {
  TEXT: "text",
  BLOCK: "block",
};
const exported = {
  CursorType,
  initCursor,
  updateCursor,
  disposeCursor,
  updateConfig,
  customCursorStyle,
};

export {
  CursorType,
  customCursorStyle,
  exported as default,
  disposeCursor,
  initCursor,
  updateConfig,
  updateCursor,
};
