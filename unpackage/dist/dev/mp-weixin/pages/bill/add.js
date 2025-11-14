"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "add",
  setup(__props) {
    common_vendor.useRouter();
    const billType = common_vendor.ref("expense");
    const showCategoryPicker = common_vendor.ref(false);
    const showDatePicker = common_vendor.ref(false);
    const selectedCategory = common_vendor.ref("");
    const selectedCategoryId = common_vendor.ref(null);
    const form = common_vendor.reactive({
      amount: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      remark: ""
    });
    const categories = common_vendor.ref([
      { id: 1, name: "餐饮" },
      { id: 2, name: "交通" },
      { id: 3, name: "购物" },
      { id: 4, name: "娱乐" },
      { id: 5, name: "医疗" },
      { id: 6, name: "住房" },
      { id: 7, name: "其他" }
    ]);
    const handleAmountInput = () => {
      if (form.amount && !/^\d+(\.\d{0,2})?$/.test(form.amount)) {
        form.amount = form.amount.replace(/[^\d.]/g, "");
      }
    };
    const selectCategory = (category) => {
      selectedCategory.value = category.name;
      selectedCategoryId.value = category.id;
      showCategoryPicker.value = false;
    };
    const submitBill = async () => {
      if (!form.amount) {
        common_vendor.index.showToast({
          title: "请输入金额",
          icon: "none"
        });
        return;
      }
      if (!selectedCategoryId.value) {
        common_vendor.index.showToast({
          title: "请选择分类",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({ title: "保存中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
        form.amount = "";
        form.remark = "";
        selectedCategory.value = "";
        selectedCategoryId.value = null;
        form.date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      }, 1e3);
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/bill/add.vue:205", "记账页面加载");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: billType.value === "expense" ? 1 : "",
        c: common_vendor.o(($event) => billType.value = "expense"),
        d: billType.value === "income" ? 1 : "",
        e: common_vendor.o(($event) => billType.value = "income"),
        f: common_vendor.o([($event) => form.amount = $event.detail.value, handleAmountInput]),
        g: form.amount,
        h: common_vendor.t(selectedCategory.value || "请选择分类"),
        i: common_vendor.o(($event) => showCategoryPicker.value = true),
        j: common_vendor.t(form.date),
        k: common_vendor.o(($event) => showDatePicker.value = true),
        l: form.remark,
        m: common_vendor.o(($event) => form.remark = $event.detail.value),
        n: common_vendor.o(submitBill),
        o: !form.amount,
        p: showCategoryPicker.value
      }, showCategoryPicker.value ? {
        q: common_vendor.o(($event) => showCategoryPicker.value = false),
        r: common_vendor.f(categories.value, (cat, k0, i0) => {
          return {
            a: common_vendor.t(cat.name),
            b: cat.id,
            c: common_vendor.o(($event) => selectCategory(cat), cat.id)
          };
        }),
        s: common_vendor.o(() => {
        }),
        t: common_vendor.o(($event) => showCategoryPicker.value = false)
      } : {}, {
        v: showDatePicker.value
      }, showDatePicker.value ? {
        w: common_vendor.o(($event) => showDatePicker.value = false),
        x: form.date,
        y: common_vendor.o(($event) => form.date = $event.detail.value),
        z: common_vendor.o(() => {
        }),
        A: common_vendor.o(($event) => showDatePicker.value = false)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cf45592f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/bill/add.js.map
