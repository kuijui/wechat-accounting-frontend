"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const handleTestLogin = async () => {
      if (loading.value)
        return;
      try {
        loading.value = true;
        const loginData = {
          code: "test-12345"
        };
        const response = await api_index.userApi.login(loginData);
        if (response.code === 200) {
          utils_auth.saveLoginInfo(response.data);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:104", "登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    };
    const handleWechatLogin = async () => {
      if (loading.value)
        return;
      try {
        loading.value = true;
        const code = await utils_auth.getWechatLoginCode();
        const loginData = {
          code
        };
        const response = await api_index.userApi.login(loginData);
        if (response.code === 200) {
          utils_auth.saveLoginInfo(response.data);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:150", "微信登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "微信登录失败",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    };
    const onGetUserInfo = (e) => {
      common_vendor.index.__f__("log", "at pages/login/login.vue:163", "获取用户信息:", e.detail);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : {}, {
        b: common_vendor.o(handleTestLogin),
        c: loading.value,
        d: loading.value
      }, loading.value ? {} : {}, {
        e: common_vendor.o(handleWechatLogin),
        f: loading.value,
        g: common_vendor.o(onGetUserInfo)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
