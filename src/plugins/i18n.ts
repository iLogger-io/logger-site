import Vue from "vue";
import VueI18n from "vue-i18n";
import en from "../lang/en.json";
import vi from "../lang/vi.json";
import zh from "../lang/zh-CN.json";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "vi",
  messages: {
    en: en,
    vi: vi,
    zh: zh,
  },
});

export default i18n;
