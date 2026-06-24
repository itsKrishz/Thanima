"use client";

import { useMemo, useState } from "react";
import { ExportButton } from "@/components/admin/ExportButton";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { RsvpForm } from "@/components/rsvp/RsvpForm";
import type { Rsvp } from "@/lib/types/rsvp";
import {
  formatAttendingStatus,
  formatDate,
} from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type SortKey =
  | "full_name"
  | "registration_number"
  | "graduation_year"
  | "department"
  | "phone_number"
  | "email"
  | "attending_status"
  | "created_at";

type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;

const columns: Array<{ key: SortKey; label: string }> = [
  { key: "full_name", label: "Name" },
  { key: "registration_number", label: "Registration No." },
  { key: "graduation_year", label: "Batch" },
  { key: "department", label: "Department" },
  { key: "phone_number", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "attending_status", label: "Attendance Status" },
  { key: "created_at", label: "Submission Date" },
];

function compareValues(a: Rsvp, b: Rsvp, key: SortKey) {
  const left = a[key] ?? "";
  const right = b[key] ?? "";

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function AdminDashboard({ rsvps }: { rsvps: Rsvp[] }) {
  const [nameQuery, setNameQuery] = useState("");
  const [regQuery, setRegQuery] = useState("");
  const [batchQuery, setBatchQuery] = useState("");
  const [departmentQuery, setDepartmentQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [editingRsvp, setEditingRsvp] = useState<Rsvp | null>(null);

  const filteredRsvps = useMemo(() => {
    return rsvps
      .filter((rsvp) => (showDeleted ? true : !rsvp.is_deleted))
      .filter((rsvp) =>
        rsvp.full_name.toLowerCase().includes(nameQuery.trim().toLowerCase()),
      )
      .filter((rsvp) =>
        (rsvp.registration_number ?? "")
          .toLowerCase()
          .includes(regQuery.trim().toLowerCase()),
      )
      .filter((rsvp) =>
        rsvp.graduation_year
          .toLowerCase()
          .includes(batchQuery.trim().toLowerCase()),
      )
      .filter((rsvp) =>
        rsvp.department
          .toLowerCase()
          .includes(departmentQuery.trim().toLowerCase()),
      )
      .filter((rsvp) =>
        rsvp.phone_number
          .toLowerCase()
          .includes(phoneQuery.trim().toLowerCase()),
      )
      .sort((a, b) => {
        const result = compareValues(a, b, sortKey);
        return sortDirection === "asc" ? result : -result;
      });
  }, [
    rsvps,
    nameQuery,
    regQuery,
    batchQuery,
    departmentQuery,
    phoneQuery,
    showDeleted,
    sortKey,
    sortDirection,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRsvps.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRsvps = filteredRsvps.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
    setPage(1);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this RSVP response?")) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/rsvp?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete record.");
      }
    } catch {
      alert("Error occurred during deletion.");
    }
  }

  async function handleRestore(id: string) {
    try {
      const response = await fetch(`/api/admin/rsvp?id=${id}`, {
        method: "PATCH",
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to restore record.");
      }
    } catch {
      alert("Error occurred during restoration.");
    }
  }

  return (
    <div className="space-y-4">
      {/* Edit RSVP Modal */}
      {editingRsvp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-sargam-cream p-6 shadow-xl border border-sargam-gold/30">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-2xl text-sargam-crimson">Admin Edit RSVP</h3>
              <button
                onClick={() => setEditingRsvp(null)}
                className="text-sargam-green hover:text-sargam-gold text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <RsvpForm
              initialData={editingRsvp}
              isAdmin={true}
              onSuccess={() => {
                setEditingRsvp(null);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="space-y-4 border-b border-sargam-gold/20 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl text-sargam-crimson">
                RSVP Responses
              </h2>
              <p className="mt-1 text-sm text-sargam-green/70">
                Search, filter, sort, and manage alumni responses.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-sargam-green cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDeleted}
                  onChange={(e) => {
                    setShowDeleted(e.target.checked);
                    setPage(1);
                  }}
                  className="rounded border-sargam-gold text-sargam-gold focus:ring-sargam-gold"
                />
                Show Deleted Records
              </label>
              <ExportButton />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <Input
              label="Search by name"
              placeholder="Alumni name"
              value={nameQuery}
              onChange={(event) => {
                setNameQuery(event.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Search by registration no."
              placeholder="Reg number"
              value={regQuery}
              onChange={(event) => {
                setRegQuery(event.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Search by batch"
              placeholder="Graduation year"
              value={batchQuery}
              onChange={(event) => {
                setBatchQuery(event.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Search by department"
              placeholder="Department"
              value={departmentQuery}
              onChange={(event) => {
                setDepartmentQuery(event.target.value);
                setPage(1);
              }}
            />
            <Input
              label="Search by phone"
              placeholder="Phone number"
              value={phoneQuery}
              onChange={(event) => {
                setPhoneQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sargam-cream/70 text-sargam-green">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className="inline-flex items-center gap-1 hover:text-sargam-crimson"
                    >
                      {column.label}
                      {sortKey === column.key ? (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      ) : null}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRsvps.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-sargam-green/60"
                  >
                    No RSVP responses match your filters.
                  </td>
                </tr>
              ) : (
                paginatedRsvps.map((rsvp) => (
                  <tr
                    key={rsvp.id}
                    className={cn(
                      "border-t border-sargam-gold/10 hover:bg-sargam-cream/40",
                      rsvp.is_deleted && "bg-red-50/50 opacity-70 border-l-4 border-l-sargam-crimson",
                    )}
                  >
                    <td className="px-4 py-3 font-medium">
                      {rsvp.full_name}
                      {rsvp.is_deleted && (
                        <span className="ml-2 rounded-full bg-sargam-crimson/10 px-2 py-0.5 text-[10px] font-semibold text-sargam-crimson">
                          Deleted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{rsvp.registration_number}</td>
                    <td className="px-4 py-3">{rsvp.graduation_year}</td>
                    <td className="px-4 py-3">{rsvp.department}</td>
                    <td className="px-4 py-3">{rsvp.phone_number}</td>
                    <td className="px-4 py-3">{rsvp.email || "—"}</td>
                    <td className="px-4 py-3">
                      {formatAttendingStatus(rsvp.attending_status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDate(rsvp.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      {rsvp.is_deleted ? (
                        <button
                          type="button"
                          onClick={() => handleRestore(rsvp.id)}
                          className="rounded bg-sargam-green px-2.5 py-1 text-xs font-semibold text-white hover:bg-sargam-green/80 transition-colors"
                        >
                          Restore
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingRsvp(rsvp)}
                            className="rounded bg-sargam-gold px-2.5 py-1 text-xs font-semibold text-white hover:bg-sargam-gold/80 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rsvp.id)}
                            className="rounded bg-sargam-crimson px-2.5 py-1 text-xs font-semibold text-white hover:bg-sargam-crimson/80 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-sargam-gold/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-sargam-green/70">
            Showing {paginatedRsvps.length} of {filteredRsvps.length} filtered
            responses
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className={cn(
                "rounded-lg border border-sargam-gold/40 px-3 py-2 text-sm",
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-sargam-cream",
              )}
            >
              Previous
            </button>
            <span className="px-2 text-sm text-sargam-green/70">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className={cn(
                "rounded-lg border border-sargam-gold/40 px-3 py-2 text-sm",
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-sargam-cream",
              )}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
