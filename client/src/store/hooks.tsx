import { createTypedHooks } from "easy-peasy";
import { StoreModel } from "./Store";

export const {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore,
} = createTypedHooks<StoreModel>();