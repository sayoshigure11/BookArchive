"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Star, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISBNBookData } from "@/lib/isbn-api";
import { PurchaseLocation, ReadingStatus } from "@/lib/types";

interface BookRegistrationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookData: ISBNBookData | null;
  onConfirm: (data: {
    status: ReadingStatus;
    expectation: number;
    purchased: boolean;
    purchaseLocations: PurchaseLocation[];
    notes: string;
  }) => void;
  existingLocations: string[];
}

export function BookRegistrationDrawer({
  open,
  onOpenChange,
  bookData,
  onConfirm,
  existingLocations,
}: BookRegistrationDrawerProps) {
  const [status, setStatus] = useState<ReadingStatus>("want-to-read");
  const [expectation, setExpectation] = useState(3);
  const [purchased, setPurchased] = useState(false);
  const [purchaseLocations, setPurchaseLocations] = useState<
    PurchaseLocation[]
  >([]);
  const [notes, setNotes] = useState("");

  const addLocation = () => {
    setPurchaseLocations([
      ...purchaseLocations,
      {
        id: crypto.randomUUID(),
        location: "",
        prices: [{ id: crypto.randomUUID(), price: 0 }],
      },
    ]);
  };

  const removeLocation = (id: string) => {
    setPurchaseLocations(purchaseLocations.filter((pl) => pl.id !== id));
  };

  const updateLocation = (id: string, location: string) => {
    setPurchaseLocations(
      purchaseLocations.map((pl) => (pl.id === id ? { ...pl, location } : pl))
    );
  };

  const addPrice = (locationId: string) => {
    setPurchaseLocations(
      purchaseLocations.map((pl) =>
        pl.id === locationId
          ? {
              ...pl,
              prices: [...pl.prices, { id: crypto.randomUUID(), price: 0 }],
            }
          : pl
      )
    );
  };

  const removePrice = (locationId: string, priceId: string) => {
    setPurchaseLocations(
      purchaseLocations.map((pl) =>
        pl.id === locationId
          ? { ...pl, prices: pl.prices.filter((p) => p.id !== priceId) }
          : pl
      )
    );
  };

  const updatePrice = (locationId: string, priceId: string, price: number) => {
    setPurchaseLocations(
      purchaseLocations.map((pl) =>
        pl.id === locationId
          ? {
              ...pl,
              prices: pl.prices.map((p) =>
                p.id === priceId ? { ...p, price } : p
              ),
            }
          : pl
      )
    );
  };

  const handleConfirm = () => {
    onConfirm({
      status,
      expectation,
      purchased,
      purchaseLocations: purchaseLocations.filter(
        (pl) => pl.location.trim() !== ""
      ),
      notes,
    });
  };

  if (!bookData) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">本の情報を確認</h2>

        {/* Book Info */}
        <div className="flex gap-4 p-4 bg-muted rounded-lg">
          <div className="flex-shrink-0 w-20 h-28 bg-background rounded overflow-hidden">
            <img
              src={
                bookData.coverImage || "/placeholder.svg?height=112&width=80"
              }
              alt={bookData.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">
              {bookData.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {bookData.author}
            </p>
            <p className="text-xs text-muted-foreground">
              {bookData.publisher}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ISBN: {bookData.isbn}
            </p>
          </div>
        </div>

        {/* Status */}
        <div>
          <Label className="text-base font-medium mb-3 block">
            読書ステータス
          </Label>
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as ReadingStatus)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="want-to-read" id="reg-status-want" />
              <Label
                htmlFor="reg-status-want"
                className="font-normal cursor-pointer"
              >
                読みたい
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reading" id="reg-status-reading" />
              <Label
                htmlFor="reg-status-reading"
                className="font-normal cursor-pointer"
              >
                読書中
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="reg-status-completed" />
              <Label
                htmlFor="reg-status-completed"
                className="font-normal cursor-pointer"
              >
                読了
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Expectation */}
        <div>
          <Label className="text-base font-medium mb-3 block">期待度</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setExpectation(rating)}
                className="focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating <= expectation
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Status */}
        <div>
          <Label className="text-base font-medium mb-3 block">
            購入ステータス
          </Label>
          <RadioGroup
            value={purchased ? "yes" : "no"}
            onValueChange={(value) => setPurchased(value === "yes")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="purchased-no" />
              <Label
                htmlFor="purchased-no"
                className="font-normal cursor-pointer"
              >
                未購入
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="purchased-yes" />
              <Label
                htmlFor="purchased-yes"
                className="font-normal cursor-pointer"
              >
                購入済み
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Purchase Locations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-base font-medium">購入場所と価格</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLocation}
            >
              <Plus className="w-4 h-4 mr-1" />
              場所を追加
            </Button>
          </div>

          {purchaseLocations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              購入場所を追加してください
            </p>
          ) : (
            <div className="space-y-4">
              {purchaseLocations.map((location, locationIndex) => (
                <div
                  key={location.id}
                  className="p-4 border border-border rounded-lg space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Label
                        htmlFor={`location-${location.id}`}
                        className="text-sm"
                      >
                        場所 {locationIndex + 1}
                      </Label>
                      {existingLocations.length > 0 ? (
                        <Select
                          value={location.location}
                          onValueChange={(value) =>
                            updateLocation(location.id, value)
                          }
                        >
                          <SelectTrigger
                            id={`location-${location.id}`}
                            className="mt-1.5"
                          >
                            <SelectValue placeholder="場所を選択または入力" />
                          </SelectTrigger>
                          <SelectContent>
                            {existingLocations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                            <SelectItem value="__new__">
                              新しい場所を入力...
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={`location-${location.id}`}
                          type="text"
                          placeholder="例: 東京、京都"
                          value={location.location}
                          onChange={(e) =>
                            updateLocation(location.id, e.target.value)
                          }
                          className="mt-1.5"
                        />
                      )}
                      {location.location === "__new__" && (
                        <Input
                          type="text"
                          placeholder="新しい場所を入力"
                          onChange={(e) =>
                            updateLocation(location.id, e.target.value)
                          }
                          className="mt-2"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLocation(location.id)}
                      className="mt-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">価格</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addPrice(location.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        価格を追加
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {location.prices.map((price, priceIndex) => (
                        <div key={price.id} className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="価格"
                            value={price.price || ""}
                            onChange={(e) =>
                              updatePrice(
                                location.id,
                                price.id,
                                Number(e.target.value)
                              )
                            }
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">
                            円
                          </span>
                          {location.prices.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePrice(location.id, price.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes" className="text-base font-medium">
            メモ
          </Label>
          <Textarea
            id="notes"
            placeholder="この本についてのメモや感想を入力"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5 min-h-24"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            登録
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
