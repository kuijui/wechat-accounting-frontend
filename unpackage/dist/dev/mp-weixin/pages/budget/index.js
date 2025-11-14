"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const budgetList = common_vendor.ref([]);
    const currentYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    const currentMonth = common_vendor.ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const currentMonthLabel = common_vendor.computed(() => {
      return `${currentYear.value}年${currentMonth.value.toString().padStart(2, "0")}月`;
    });
    const totalBudget = common_vendor.computed(() => {
      return budgetList.value.reduce((sum, item) => sum + (item.amount || 0), 0);
    });
    const totalUsed = common_vendor.computed(() => {
      return budgetList.value.reduce((sum, item) => sum + (item.usedAmount || 0), 0);
    });
    const totalRemaining = common_vendor.computed(() => {
      return budgetList.value.reduce((sum, item) => sum + (item.remainingAmount || 0), 0);
    });
    const formatPercent = (value) => {
      if (value == null || isNaN(value))
        return "0%";
      return `${value.toFixed(1)}%`;
    };
    const getProgressWidth = (value) => {
      if (value == null || isNaN(value))
        return "0%";
      const v = Math.max(0, Math.min(value, 120));
      return `${v}%`;
    };
    const changeMonth = (offset) => {
      let year = currentYear.value;
      let month = currentMonth.value + offset;
      if (month <= 0) {
        year -= 1;
        month += 12;
      } else if (month > 12) {
        year += 1;
        month -= 12;
      }
      currentYear.value = year;
      currentMonth.value = month;
      loadBudget();
    };
    const loadBudget = async () => {
      try {
        loading.value = true;
        const res = await api_index.budgetApi.getList(currentYear.value, currentMonth.value);
        if (res.code === 200 && Array.isArray(res.data)) {
          budgetList.value = res.data;
        } else {
          budgetList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/budget/index.vue:138", "获取预算数据失败:", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "获取预算失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      loadBudget();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => changeMonth(-1)),
        b: common_vendor.t(currentMonthLabel.value),
        c: common_vendor.o(($event) => changeMonth(1)),
        d: common_vendor.t(totalBudget.value.toFixed(2)),
        e: common_vendor.t(totalUsed.value.toFixed(2)),
        f: common_vendor.t(totalRemaining.value.toFixed(2)),
        g: loading.value
      }, loading.value ? {} : budgetList.value.length === 0 ? {} : {
        i: common_vendor.f(budgetList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.categoryName || "总预算"),
            b: common_vendor.t(formatPercent(item.usagePercentage)),
            c: common_vendor.t(item.amount.toFixed(2)),
            d: common_vendor.t(item.usedAmount.toFixed(2)),
            e: common_vendor.t(item.remainingAmount.toFixed(2)),
            f: item.remainingAmount < 0 ? 1 : "",
            g: item.usagePercentage > 100 ? 1 : "",
            h: getProgressWidth(item.usagePercentage),
            i: item.id
          };
        })
      }, {
        h: budgetList.value.length === 0
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-beadd351"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/budget/index.js.map
