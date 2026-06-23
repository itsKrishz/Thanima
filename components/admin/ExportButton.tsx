"use client";

import { Button } from "@/components/ui/Button";

export function ExportButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        window.location.href = "/admin/export";
      }}
    >
      Export CSV
    </Button>
  );
}
