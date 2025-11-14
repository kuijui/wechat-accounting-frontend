"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const currentYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    const currentMonth = common_vendor.ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const currentType = common_vendor.ref(2);
    const overview = common_vendor.ref(null);
    const categoryList = common_vendor.ref([]);
    const currentMonthLabel = common_vendor.computed(() => {
      return `${currentYear.value}年${currentMonth.value.toString().padStart(2, "0")}月`;
    });
    const totalIncome = common_vendor.computed(() => {
      var _a;
      return ((_a = overview.value) == null ? void 0 : _a.totalIncome) ?? 0;
    });
    const totalExpense = common_vendor.computed(() => {
      var _a;
      return ((_a = overview.value) == null ? void 0 : _a.totalExpense) ?? 0;
    });
    const balance = common_vendor.computed(() => {
      var _a;
      return ((_a = overview.value) == null ? void 0 : _a.balance) ?? totalIncome.value - totalExpense.value;
    });
    const balanceSign = common_vendor.computed(() => {
      if (balance.value > 0)
        return "+";
      if (balance.value < 0)
        return "-";
      return "";
    });
    const amountSign = common_vendor.computed(() => currentType.value === 2 ? "-" : "+");
    const categoryTotalAmount = common_vendor.computed(() => {
      return categoryList.value.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    });
    const getPercent = (item) => {
      const base = categoryTotalAmount.value || 1;
      const value = item.totalAmount / base * 100;
      return `${value.toFixed(1)}%`;
    };
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    const getMonthRange = () => {
      const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
      const lastDay = new Date(currentYear.value, currentMonth.value, 0);
      return {
        startDate: formatDate(firstDay),
        endDate: formatDate(lastDay)
      };
    };
    const setType = (type) => {
      if (currentType.value === type)
        return;
      currentType.value = type;
      loadStatistics();
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
      loadStatistics();
    };
    const loadStatistics = async () => {
      try {
        loading.value = true;
        const { startDate, endDate } = getMonthRange();
        const [overviewRes, categoryRes] = await Promise.all([
          api_index.statisticApi.getOverview(startDate, endDate),
          api_index.statisticApi.getCategoryStatistics(currentType.value, startDate, endDate)
        ]);
        if (overviewRes.code === 200 && overviewRes.data) {
          overview.value = overviewRes.data;
        } else {
          overview.value = null;
        }
        if (categoryRes.code === 200 && Array.isArray(categoryRes.data)) {
          categoryList.value = categoryRes.data;
        } else {
          categoryList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/statistics/index.vue:203", "获取统计数据失败:", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "获取统计数据失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      loadStatistics();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => changeMonth(-1)),
        b: common_vendor.t(currentMonthLabel.value),
        c: common_vendor.o(($event) => changeMonth(1)),
        d: currentType.value === 2 ? 1 : "",
        e: common_vendor.o(($event) => setType(2)),
        f: currentType.value === 1 ? 1 : "",
        g: common_vendor.o(($event) => setType(1)),
        h: common_vendor.t(totalExpense.value.toFixed(2)),
        i: common_vendor.t(totalIncome.value.toFixed(2)),
        j: common_vendor.t(balanceSign.value),
        k: common_vendor.t(Math.abs(balance.value).toFixed(2)),
        l: loading.value
      }, loading.value ? {} : common_vendor.e({
        m: common_vendor.t(currentType.value === 2 ? "支出" : "收入"),
        n: categoryList.value.length === 0
      }, categoryList.value.length === 0 ? {} : {
        o: common_vendor.f(categoryList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.categoryName.charAt(0)),
            b: common_vendor.t(item.categoryName),
            c: common_vendor.t(item.totalAmount.toFixed(2)),
            d: getPercent(item),
            e: common_vendor.t(getPercent(item)),
            f: item.categoryId
          };
        }),
        p: common_vendor.t(amountSign.value)
      }));
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6e199430"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/statistics/index.js.map
