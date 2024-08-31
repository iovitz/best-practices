import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD = /^\S{6,16}$/;
export const REGEXP_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;

/** 登录校验 */
const loginRules = reactive(<FormRules>{
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入邮箱"));
        } else if (!REGEXP_EMAIL.test(value)) {
          callback(new Error("邮箱格式错误"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error("密码格式错误"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ]
});

export { loginRules };
