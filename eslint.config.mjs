import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  {
    ignores: ["test/", "coverage/"]
  },
  pluginJs.configs.recommended,
];