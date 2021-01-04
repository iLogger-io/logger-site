import store from "../store";

export default function guestcheck({ next }: any) {
  if (store.getters["auth/token"]) {
    return next({ name: "/" });
  } else {
    return next();
  }
}
