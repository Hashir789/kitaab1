import { Suspense } from "react";
import Auth from "./Auth/Auth";

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <Auth />
    </Suspense>
  );
}