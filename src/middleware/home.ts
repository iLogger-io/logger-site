import store from "../store";

export default function home({ next }: any) {
  const token = store.getters["user/Token"];
  if (token !== undefined) {
    return next({ name: "Home" });
  } else {
    return next();
  }
}
