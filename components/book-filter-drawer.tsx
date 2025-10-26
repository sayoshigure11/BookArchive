"use client";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ReadingStatus } from "@/lib/types";

export interface FilterOptions {
  status: ReadingStatus | "all";
  sortBy: "title" | "author" | "expectation" | "date";
  purchasedOnly: boolean;
  locations: string[];
}

interface BookFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableLocations: string[];
}

export function BookFilterDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  availableLocations,
}: BookFilterDrawerProps) {
  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];

    onFiltersChange({ ...filters, locations: newLocations });
  };

  const resetFilters = () => {
    onFiltersChange({
      status: "all",
      sortBy: "date",
      purchasedOnly: false,
      locations: [],
    });
  };

  const activeFilterCount =
    (filters.status !== "all" ? 1 : 0) +
    (filters.sortBy !== "date" ? 1 : 0) +
    (filters.purchasedOnly ? 1 : 0) +
    filters.locations.length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">フィルター</h2>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              リセット
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">
              読書ステータス
            </Label>
            <RadioGroup
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value as ReadingStatus | "all",
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label
                  htmlFor="status-all"
                  className="font-normal cursor-pointer"
                >
                  すべて
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="want-to-read" id="status-want" />
                <Label
                  htmlFor="status-want"
                  className="font-normal cursor-pointer"
                >
                  読みたい
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reading" id="status-reading" />
                <Label
                  htmlFor="status-reading"
                  className="font-normal cursor-pointer"
                >
                  読書中
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label
                  htmlFor="status-completed"
                  className="font-normal cursor-pointer"
                >
                  読了
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">並び替え</Label>
            <RadioGroup
              value={filters.sortBy}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortBy: value as "title" | "author" | "expectation" | "date",
                })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="sort-date" />
                <Label
                  htmlFor="sort-date"
                  className="font-normal cursor-pointer"
                >
                  登録日順
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="title" id="sort-title" />
                <Label
                  htmlFor="sort-title"
                  className="font-normal cursor-pointer"
                >
                  タイトル順
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="author" id="sort-author" />
                <Label
                  htmlFor="sort-author"
                  className="font-normal cursor-pointer"
                >
                  著者名順
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expectation" id="sort-expectation" />
                <Label
                  htmlFor="sort-expectation"
                  className="font-normal cursor-pointer"
                >
                  期待度順
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="purchased-only"
                checked={filters.purchasedOnly}
                onCheckedChange={(checked) =>
                  onFiltersChange({
                    ...filters,
                    purchasedOnly: checked === true,
                  })
                }
              />
              <Label
                htmlFor="purchased-only"
                className="font-normal cursor-pointer"
              >
                購入済みのみ表示
              </Label>
            </div>
          </div>

          {availableLocations.length > 0 && (
            <div>
              <Label className="text-base font-medium mb-3 block">
                購入場所
              </Label>
              <div className="space-y-2">
                {availableLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={() => handleLocationToggle(location)}
                    />
                    <Label
                      htmlFor={`location-${location}`}
                      className="font-normal cursor-pointer"
                    >
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button className="w-full" onClick={() => onOpenChange(false)}>
          適用
        </Button>
      </div>
    </Drawer>
  );
}
