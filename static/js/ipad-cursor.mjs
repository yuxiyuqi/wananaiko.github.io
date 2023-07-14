let ready = false;
let cursorEle = null;
let isBlockActive = false;
let isTextActive = false;
let isMouseDown = false;
let styleTag = null;
let latestCursorStyle = {};
let mousedownStyleRecover = {};
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
    return isObject(obj);
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
    scale: 1,
    border: "1px solid rgba(100, 100, 100, 0.1)",
    zIndex: 9999,
    backdropBlur: "0px",
    backdropSaturate: "180%",
  };
  const textStyle = {
    background: "rgba(100, 100, 100, 0.3)",
    scale: 1,
    width: "3px",
    height: "1.2em",
    border: "0px solid rgba(100, 100, 100, 0)",
    durationBackdropFilter: "1s",
    radius: "10px",
  };
  const blockStyle = {
    background: "rgba(100, 100, 100, 0.3)",
    border: "1px solid rgba(100, 100, 100, 0.05)",
    backdropBlur: "0px",
    durationBase: "0.23s",
    durationBackdropFilter: "0.1s",
    backdropSaturate: "120%",
    radius: "8px",
  };
  const mouseDownStyle = {
    background: "rgba(150, 150, 150, 0.3)",
    scale: 0.8,
  };
  const defaultConfig = {
    blockPadding: "auto",
    adsorptionStrength: 10,
    className: "ipad-cursor",
    normalStyle,
    textStyle,
    blockStyle,
    mouseDownStyle,
  };
  return defaultConfig;
}
/** update cursor style (single or multiple) */
function updateCursorStyle(keyOrObj, value) {
  if (!cursorEle) return;
  if (typeof keyOrObj === "string") {
    latestCursorStyle[keyOrObj] = value;
    value && cursorEle.style.setProperty(keyOrObj, value);
  } else {
    Object.entries(keyOrObj).forEach(([key, value]) => {
      cursorEle && cursorEle.style.setProperty(key, value);
      latestCursorStyle[key] = value;
    });
  }
}
/** record mouse position */
function onMousemove(e) {
  position.x = e.clientX;
  position.y = e.clientY;
  autoApplyTextCursor(e.target);
}
function onMousedown() {
  if (isMouseDown || !config.enableMouseDownEffect || isBlockActive) return;
  isMouseDown = true;
  mousedownStyleRecover = { ...latestCursorStyle };
  updateCursorStyle(Utils.style2Vars(config.mouseDownStyle || {}));
}
function onMouseup() {
  if (!isMouseDown || !config.enableMouseDownEffect || isBlockActive) return;
  isMouseDown = false;
  const target = mousedownStyleRecover;
  const styleToRecover = Utils.objectKeys(
    Utils.style2Vars(config.mouseDownStyle || {})
  ).reduce((prev, curr) => ({ ...prev, [curr]: target[curr] }), {});
  updateCursorStyle(styleToRecover);
}
/**
 * Automatically apply cursor style when hover on target
 * @param target
 * @returns
 */
function autoApplyTextCursor(target) {
  var _a;
  if (isBlockActive || isTextActive || !config.enableAutoTextCursor) return;
  if (target && target.childNodes.length === 1) {
    const child = target.childNodes[0];
    if (
      child.nodeType === 3 &&
      ((_a = child.textContent) === null || _a === void 0
        ? void 0
        : _a.trim()) !== ""
    ) {
      target.setAttribute("data-cursor", "text");
      applyTextCursor(target);
      return;
    }
  }
  resetCursorStyle();
}
let lastNode = null;
const scrollHandler = () => {
  const currentNode = document.elementFromPoint(position.x, position.y);
  const mouseLeaveEvent = new MouseEvent("mouseleave", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  if (currentNode !== lastNode && lastNode && mouseLeaveEvent) {
    lastNode.dispatchEvent(mouseLeaveEvent);
  }
  lastNode = currentNode;
};
/**
 * Init cursor, hide default cursor, and listen mousemove event
 * will only run once in client even if called multiple times
 * @returns
 */
function initCursor(_config) {
  if (isServer || ready) return;
  if (_config) updateConfig(_config);
  ready = true;
  window.addEventListener("mousemove", onMousemove);
  window.addEventListener("mousedown", onMousedown);
  window.addEventListener("mouseup", onMouseup);
  window.addEventListener("scroll", scrollHandler);
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
  window.removeEventListener("mousemove", onMousemove);
  window.removeEventListener("scroll", scrollHandler);
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
  const selector = `.${config.className.split(/\s+/).join(".")}`;
  styleTag = document.createElement("style");
  styleTag.innerHTML = `
    body, * {
      cursor: none;
    }
    ${selector} {
      --cursor-transform-duration: 0.23s;
      overflow: hidden;
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
        backdrop-filter var(--cursor-blur-duration) ease,
        transform var(--cursor-transform-duration) ease;
      transform:
        translateX(calc(var(--cursor-translateX, 0px) - 50%))
        translateY(calc(var(--cursor-translateY, 0px) - 50%))
        scale(var(--cursor-scale, 1));
    }
    ${selector}.block-active {
      --cursor-transform-duration: 0s;
    }
    ${selector} .lighting {
      display: none;
    }
    ${selector}.lighting--on .lighting {
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      left: calc(var(--lighting-size) / -2);
      top: calc(var(--lighting-size) / -2);
      transform: translateX(var(--lighting-offset-x, 0)) translateY(var(--lighting-offset-y, 0));
      background-image: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 30%
      );
      border-radius: 50%;
    }
    ${selector}.block-active .lighting {
      width: var(--lighting-size, 20px);
      height: var(--lighting-size, 20px);
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
  const lightingEle = document.createElement("div");
  cursorEle.classList.add(config.className);
  lightingEle.classList.add("lighting");
  cursorEle.appendChild(lightingEle);
  document.body.appendChild(cursorEle);
  resetCursorStyle();
}
/**
 * update cursor position, request animation frame
 * @returns
 */
function updateCursorPosition() {
  if (isServer || !cursorEle) return;
  if (!isBlockActive) {
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
  return document.querySelectorAll("[data-cursor]");
}
/**
 * Detect all interactive elements in the page
 * Update the binding of events, remove listeners for elements that are removed
 * @returns
 */
function updateCursor() {
  if (isServer || !ready) return;
  const nodesMap = new Map();
  // addDataCursorText(document.body.childNodes)
  const nodes = queryAllTargets();
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
  let type = node.getAttribute("data-cursor");
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
        if (event === "mouseleave") handler();
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
  let timer;
  function toggleTextActive(active) {
    isTextActive = !!active;
    cursorEle &&
      (active
        ? cursorEle.classList.add("text-active")
        : cursorEle.classList.remove("text-active"));
  }
  function onTextOver(e) {
    timer && clearTimeout(timer);
    toggleTextActive(true);
    // for some edge case, two ele very close
    timer = setTimeout(() => toggleTextActive(true));
    applyTextCursor(e.target);
  }
  function onTextLeave() {
    timer && clearTimeout(timer);
    timer = setTimeout(() => toggleTextActive(false));
    resetCursorStyle();
  }
  node.addEventListener("mouseover", onTextOver, { passive: true });
  node.addEventListener("mouseleave", onTextLeave, { passive: true });
  eventMap.set(node, [
    { event: "mouseover", handler: onTextOver },
    { event: "mouseleave", handler: onTextLeave },
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
  function toggleBlockActive(active) {
    isBlockActive = !!active;
    cursorEle &&
      (active
        ? cursorEle.classList.add("block-active")
        : cursorEle.classList.remove("block-active"));
  }
  function onBlockEnter() {
    var _a, _b;
    // TODO: maybe control this in other way
    cursorEle &&
      cursorEle.classList.toggle("lighting--on", !!config.enableLighting);
    const rect = node.getBoundingClientRect();
    timer && clearTimeout(timer);
    toggleBlockActive(true);
    // for some edge case, two ele very close
    timer = setTimeout(() => toggleBlockActive(true));
    cursorEle && cursorEle.classList.add("block-active");
    const updateStyleObj = { ...(config.blockStyle || {}) };
    const blockPadding = config.blockPadding || 0;
    let padding = blockPadding;
    let radius =
      updateStyleObj === null || updateStyleObj === void 0
        ? void 0
        : updateStyleObj.radius;
    if (padding === "auto") {
      const size = Math.min(rect.width, rect.height);
      padding = Math.max(2, Math.floor(size / 25));
    }
    if (radius === "auto") {
      const paddingCss = Utils.getSize(padding);
      const nodeRadius = window.getComputedStyle(node).borderRadius;
      if (nodeRadius.startsWith("0") || nodeRadius === "none") radius = "0";
      else radius = `calc(${paddingCss} + ${nodeRadius})`;
      updateStyleObj.radius = radius;
    }
    updateCursorStyle("--cursor-x", `${rect.left + rect.width / 2}px`);
    updateCursorStyle("--cursor-y", `${rect.top + rect.height / 2}px`);
    updateCursorStyle("--cursor-width", `${rect.width + padding * 2}px`);
    updateCursorStyle("--cursor-height", `${rect.height + padding * 2}px`);
    const styleToUpdate = {
      ...updateStyleObj,
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
    if (!isBlockActive) {
      onBlockEnter();
    }
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
    const nodeTranslateX = leftOffset * ((rect.width / 100) * strength);
    const nodeTranslateY = topOffset * ((rect.height / 100) * strength);
    node.style.setProperty("--translateX", `${nodeTranslateX}px`);
    node.style.setProperty("--translateY", `${nodeTranslateY}px`);
    // lighting
    if (config.enableLighting) {
      const lightingSize = Math.max(rect.width, rect.height) * 3 * 1.2;
      const lightingOffsetX = position.x - rect.left;
      const lightingOffsetY = position.y - rect.top;
      updateCursorStyle("--lighting-size", `${lightingSize}px`);
      updateCursorStyle("--lighting-offset-x", `${lightingOffsetX}px`);
      updateCursorStyle("--lighting-offset-y", `${lightingOffsetY}px`);
    }
  }
  function onBlockLeave() {
    timer && clearTimeout(timer);
    timer = setTimeout(() => toggleBlockActive(false));
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
  var _a;
  if (
    ((_a = config.normalStyle) === null || _a === void 0
      ? void 0
      : _a.radius) === "auto"
  )
    config.normalStyle.radius = config.normalStyle.width;
  updateCursorStyle(Utils.style2Vars(config.normalStyle || {}));
}
function applyTextCursor(sourceNode) {
  updateCursorStyle(Utils.style2Vars(config.textStyle || {}));
  const fontSize = window.getComputedStyle(sourceNode).fontSize;
  updateCursorStyle("--cursor-font-size", fontSize);
  updateCursorStyle(
    Utils.style2Vars({
      ...config.textStyle,
      ...extractCustomStyle(sourceNode),
    })
  );
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
function resetCursor() {
  isBlockActive = false;
  isTextActive = false;
  resetCursorStyle();
}
const CursorType = {
  TEXT: "text",
  BLOCK: "block",
};
const exported = {
  CursorType,
  resetCursor,
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
  resetCursor,
  updateConfig,
  updateCursor,
};
