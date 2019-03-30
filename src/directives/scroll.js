const ctx = "@@InfiniteScroll";
const distance = 10;
const throttleDelay = 200;

const throttle = (fn, delay) => {
  let now, lastExec, timer, context, args; //eslint-disable-line

  const execute = () => {
    fn.apply(context, args);
    lastExec = now;
  };

  return function() {
    context = this;
    args = arguments;

    now = Date.now();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (lastExec) {
      var diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(() => {
          execute();
        }, diff);
      }
    } else {
      execute();
    }
  };
};

const getScrollTop = element => {
  if (element === window) {
    return Math.max(
      window.pageYOffset || 0,
      document.documentElement.scrollTop
    );
  }

  return element.scrollTop;
};

const getVisibleHeight = element => {
  if (element === window) {
    return document.documentElement.clientHeight;
  }

  return element.clientHeight;
};

const getElementTop = element => {
  if (element === window) {
    return getScrollTop(window);
  }
  return element.getBoundingClientRect().top + getScrollTop(window);
};

const getScrollEventTarget = element => {
  let currentNode = element;
  // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
  while (
    currentNode &&
    currentNode.tagName !== "HTML" &&
    currentNode.tagName !== "BODY" &&
    currentNode.nodeType === 1
  ) {
    const overflowY = getComputedStyle(currentNode).overflowY;
    if (overflowY === "scroll" || overflowY === "auto") {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
};

function doCheck() {
  const scrollEventTarget = this.scrollEventTarget;
  const element = this.el;

  const viewportScrollTop = getScrollTop(scrollEventTarget);
  const viewportBottom =
    viewportScrollTop + getVisibleHeight(scrollEventTarget);

  let shouldTrigger = false;

  if (scrollEventTarget === element) {
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
  } else {
    const elementBottom =
      getElementTop(element) -
      getElementTop(scrollEventTarget) +
      element.offsetHeight +
      viewportScrollTop;

    shouldTrigger = viewportBottom + distance >= elementBottom;
  }

  if (shouldTrigger && this.expression) {
    this.expression();
  }
}

function doBind() {
  const directive = this;
  const element = directive.el;

  directive.throttleDelay = throttleDelay;

  directive.scrollListener = throttle(
    doCheck.bind(directive),
    directive.throttleDelay
  );
  directive.scrollEventTarget = getScrollEventTarget(element);

  directive.scrollEventTarget.addEventListener(
    "scroll",
    directive.scrollListener
  );

  this.vm.$on("hook:beforeDestroy", () => {
    directive.scrollEventTarget.removeEventListener(
      "scroll",
      directive.scrollListener
    );
  });
}

export default {
  bind(el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value
    };
    const args = arguments;
    el[ctx].vm.$on("hook:mounted", () => {
      el[ctx].vm.$nextTick(() => {
        doBind.call(el[ctx], args);
      });
    });
  },

  unbind(el) {
    if (el && el[ctx] && el[ctx].scrollEventTarget) {
      el[ctx].scrollEventTarget.removeEventListener(
        "scroll",
        el[ctx].scrollListener
      );
    }
  }
};
