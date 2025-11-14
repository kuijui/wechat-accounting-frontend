"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "list",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const currentYear = common_vendor.ref((/* @__PURE__ */ new Date()).getFullYear());
    const currentMonth = common_vendor.ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const filterType = common_vendor.ref(0);
    const billList = common_vendor.ref([]);
    const currentMonthLabel = common_vendor.computed(() => {
      return `${currentYear.value}年${currentMonth.value.toString().padStart(2, "0")}月`;
    });
    const totalIncome = common_vendor.computed(() => {
      return billList.value.filter((item) => item.type === 1).reduce((sum, item) => sum + (item.amount || 0), 0);
    });
    const totalExpense = common_vendor.computed(() => {
      return billList.value.filter((item) => item.type === 2).reduce((sum, item) => sum + (item.amount || 0), 0);
    });
    const balance = common_vendor.computed(() => totalIncome.value - totalExpense.value);
    const balanceSign = common_vendor.computed(() => {
      if (balance.value > 0)
        return "+";
      if (balance.value < 0)
        return "-";
      return "";
    });
    const filteredBills = common_vendor.computed(() => {
      if (filterType.value === 0) {
        return billList.value;
      }
      return billList.value.filter((item) => item.type === filterType.value);
    });
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    const formatDateDisplay = (dateStr) => {
      if (!dateStr)
        return "";
      const datePart = dateStr.split(" ")[0];
      const parts = datePart.split("-");
      if (parts.length < 3)
        return datePart;
      return `${parts[1]}-${parts[2]}`;
    };
    const getMonthRange = () => {
      const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1);
      const lastDay = new Date(currentYear.value, currentMonth.value, 0);
      const query = {
        startDate: formatDate(firstDay),
        endDate: formatDate(lastDay)
      };
      return query;
    };
    const setFilterType = (type) => {
      filterType.value = type;
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
      loadBillList();
    };
    const loadBillList = async () => {
      try {
        loading.value = true;
        const query = getMonthRange();
        const res = await api_index.billApi.getList(query);
        if (res.code === 200 && Array.isArray(res.data)) {
          billList.value = res.data;
        } else {
          billList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/bill/list.vue:196", "获取账单列表失败:", error);
        common_vendor.index.showToast({
          title: (error == null ? void 0 : error.message) || "获取账单失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    common_vendor.onMounted(() => {
      loadBillList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => changeMonth(-1)),
        b: common_vendor.t(currentMonthLabel.value),
        c: common_vendor.o(($event) => changeMonth(1)),
        d: common_vendor.t(totalExpense.value.toFixed(2)),
        e: common_vendor.t(totalIncome.value.toFixed(2)),
        f: common_vendor.t(balanceSign.value),
        g: common_vendor.t(Math.abs(balance.value).toFixed(2)),
        h: filterType.value === 0 ? 1 : "",
        i: common_vendor.o(($event) => setFilterType(0)),
        j: filterType.value === 1 ? 1 : "",
        k: common_vendor.o(($event) => setFilterType(1)),
        l: filterType.value === 2 ? 1 : "",
        m: common_vendor.o(($event) => setFilterType(2)),
        n: loading.value
      }, loading.value ? {} : filteredBills.value.length === 0 ? {} : {
        p: common_vendor.f(filteredBills.value, (bill, k0, i0) => {
          return {
            a: common_vendor.t(bill.categoryName.charAt(0)),
            b: common_vendor.t(bill.categoryName),
            c: common_vendor.t(bill.remark || bill.description || "无备注"),
            d: common_vendor.t(bill.type === 2 ? "-" : "+"),
            e: common_vendor.t(bill.amount.toFixed(2)),
            f: common_vendor.n(bill.type === 2 ? "expense" : "income"),
            g: common_vendor.t(formatDateDisplay(bill.billDate)),
            h: bill.id
          };
        })
      }, {
        o: filteredBills.value.length === 0
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7144ee87"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/bill/list.js.map
