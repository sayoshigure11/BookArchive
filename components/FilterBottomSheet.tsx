// chatGPTに書き換えて貰った。
"use client";

import { X } from "lucide-react";
import { useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterOptions } from "@/lib/types";

type FilterBottomSheetProps = {
  visible: boolean;
  filters: FilterOptions;
  allLocations: string[];
  allPrices: number[];
  onOpenChange: (open: boolean) => void;
  onApply: (filters: FilterOptions) => void;
};

export function FilterBottomSheet({
  visible,
  filters,
  allLocations,
  allPrices,
  onOpenChange,
  onApply,
}: FilterBottomSheetProps) {
  const handleSortChange = useCallback(
    (sortBy: FilterOptions["sortBy"]) => onApply({ ...filters, sortBy }),
    [filters, onApply]
  );

  const handlePurchaseFilterChange = useCallback(
    (showPurchased: FilterOptions["showPurchased"]) =>
      onApply({ ...filters, showPurchased }),
    [filters, onApply]
  );

  const handleLocationToggle = useCallback(
    (location: string) => {
      const selected = filters.selectedLocations.includes(location)
        ? filters.selectedLocations.filter((l) => l !== location)
        : [...filters.selectedLocations, location];
      onApply({ ...filters, selectedLocations: selected });
    },
    [filters, onApply]
  );

  const handlePriceToggle = useCallback(
    (price: number) => {
      const selected = filters.selectedPrices.includes(price)
        ? filters.selectedPrices.filter((l) => l !== price)
        : [...filters.selectedPrices, price];
      onApply({ ...filters, selectedPrices: selected });
    },
    [filters, onApply]
  );

  const handleReset = useCallback(() => {
    onApply({
      searchQuery: filters.searchQuery,
      sortBy: "date",
      showPurchased: "all",
      selectedLocations: [],
      selectedPrices: [],
    });
  }, [filters.searchQuery, onApply]);

  const sortOptions: { value: FilterOptions["sortBy"]; label: string }[] = [
    { value: "date", label: "追加日順" },
    { value: "title", label: "タイトル順" },
    { value: "author", label: "著者順" },
    { value: "expectation", label: "期待度順" },
  ];

  const purchaseOptions: {
    value: FilterOptions["showPurchased"];
    label: string;
  }[] = [
    { value: "all", label: "すべて" },
    { value: "purchased", label: "購入済み" },
    { value: "unpurchased", label: "未購入" },
  ];

  return (
    <Sheet open={visible} onOpenChange={onOpenChange}>
      {/* <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto"> */}
      <SheetContent
        side="bottom"
        className="h-screen w-screen [&>button:first-of-type]:hidden overflow-y-auto"
      >
        <div className="flex justify-between items-center px-2 ">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">
              フィルター
            </SheetTitle>
          </SheetHeader>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X size={18} />
          </Button>
        </div>
        {/* <SheetHeader className="flex items-center justify-between px-4">
          <div>
            <SheetTitle className="text-lg font-semibold">
              フィルター
            </SheetTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X size={18} />
            </Button>
          </div>
        </SheetHeader> */}

        <div className="px-4 py-4 space-y-6">
          {/* Sort */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">並び順</h3>
            <div className="flex flex-col gap-2">
              {sortOptions.map((o) => {
                const selected = filters.sortBy === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => handleSortChange(o.value)}
                    className={`w-full rounded-lg p-3 text-left transition ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <span className={selected ? "font-semibold" : ""}>
                      {o.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Purchased filter */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">購入状況</h3>
            <div className="flex flex-col gap-2">
              {purchaseOptions.map((o) => {
                const selected = filters.showPurchased === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => handlePurchaseFilterChange(o.value)}
                    className={`w-full rounded-lg p-3 text-left transition ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <span className={selected ? "font-semibold" : ""}>
                      {o.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Locations */}
          {allLocations.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold">購入場所</h3>
              <div className="flex flex-wrap gap-2">
                {allLocations.map((loc) => {
                  const selected = filters.selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      onClick={() => handleLocationToggle(loc)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border"
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Prices */}
          {allPrices.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold">価格</h3>
              <div className="flex flex-wrap gap-2">
                {allPrices.map((loc) => {
                  const selected = filters.selectedPrices.includes(loc);
                  return (
                    <button
                      key={loc}
                      onClick={() => handlePriceToggle(loc)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted border"
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              フィルターをリセット
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              閉じる
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
