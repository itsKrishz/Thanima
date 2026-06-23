import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center p-8 text-sargam-green">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
