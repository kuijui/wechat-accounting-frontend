"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:46", "首页加载");
      utils_auth.checkAuth();
    });
    const navigateTo = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => navigateTo("/pages/bill/add")),
        b: common_vendor.o(($event) => navigateTo("/pages/bill/list")),
        c: common_vendor.o(($event) => navigateTo("/pages/statistics/index")),
        d: common_vendor.o(($event) => navigateTo("/pages/budget/index"))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
