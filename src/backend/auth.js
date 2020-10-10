import { MIXIN_OAUTH_PATH } from "../utils/constants";

function redirectToAuth() {
  let url = new URL(MIXIN_OAUTH_PATH);
  url.searchParams.append("client_id", process.env.VUE_APP_MIXIN_BOT_ID);
  url.searchParams.append("scope", "PROFILE:READ");
  url.searchParams.append("response_type", "code");
  url.searchParams.append("return_to", window.location.hash);
  window.location.href = url.href;
}

export { redirectToAuth };
