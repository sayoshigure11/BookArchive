"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drawer } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, X, Edit2, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, PurchaseLocation, ReadingStatus } from "@/lib/types";

interface BookDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onUpdate: (id: string, updates: Partial<Book>) => void;
  onDelete: (id: string) => void;
  existingLocations: string[];
}

const statusLabels: Record<ReadingStatus, string> = {
  "want-to-read": "読みたい",
  reading: "読書中",
  completed: "読了",
};

export function BookDetailDrawer({
  open,
  onOpenChange,
  book,
  onUpdate,
  onDelete,
  existingLocations,
}: BookDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<ReadingStatus>("want-to-read");
  const [editExpectation, setEditExpectation] = useState(3);
  const [editPurchased, setEditPurchased] = useState(false);
  const [editPurchaseLocations, setEditPurchaseLocations] = useState<
    PurchaseLocation[]
  >([]);
  const [editNotes, setEditNotes] = useState("");
  const [editCompletedDate, setEditCompletedDate] = useState("");

  if (!book) return null;

  const startEditing = () => {
    setEditStatus(book.status);
    setEditExpectation(book.expectation);
    setEditPurchased(book.purchased);
    setEditPurchaseLocations(book.purchaseLocations);
    setEditNotes(book.notes || "");
    setEditCompletedDate(book.completedDate || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEditing = () => {
    onUpdate(book.id, {
      status: editStatus,
      expectation: editExpectation,
      purchased: editPurchased,
      purchaseLocations: editPurchaseLocations.filter(
        (pl) => pl.location.trim() !== ""
      ),
      notes: editNotes,
      completedDate:
        editStatus === "completed" && editCompletedDate
          ? editCompletedDate
          : undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("この本を削除してもよろしいですか?")) {
      onDelete(book.id);
      onOpenChange(false);
    }
  };

  const addLocation = () => {
    setEditPurchaseLocations([
      ...editPurchaseLocations,
      {
        id: crypto.randomUUID(),
        location: "",
        prices: [{ id: crypto.randomUUID(), price: 0 }],
      },
    ]);
  };

  const removeLocation = (id: string) => {
    setEditPurchaseLocations(
      editPurchaseLocations.filter((pl) => pl.id !== id)
    );
  };

  const updateLocation = (id: string, location: string) => {
    setEditPurchaseLocations(
      editPurchaseLocations.map((pl) =>
        pl.id === id ? { ...pl, location } : pl
      )
    );
  };

  const addPrice = (locationId: string) => {
    setEditPurchaseLocations(
      editPurchaseLocations.map((pl) =>
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
    setEditPurchaseLocations(
      editPurchaseLocations.map((pl) =>
        pl.id === locationId
          ? { ...pl, prices: pl.prices.filter((p) => p.id !== priceId) }
          : pl
      )
    );
  };

  const updatePrice = (locationId: string, priceId: string, price: number) => {
    setEditPurchaseLocations(
      editPurchaseLocations.map((pl) =>
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold">本の詳細</h2>
          {!isEditing && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={startEditing}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex gap-4 p-4 bg-muted rounded-lg">
          <div className="flex-shrink-0 w-24 h-32 bg-background rounded overflow-hidden">
            <img
              src={book.coverImage || "/placeholder.svg?height=128&width=96"}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold leading-tight">{book.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
            <p className="text-sm text-muted-foreground">{book.publisher}</p>
            <p className="text-xs text-muted-foreground mt-2">
              ISBN: {book.isbn}
            </p>
          </div>
        </div>

        {isEditing ? (
          <>
            {/* Edit Mode */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                読書ステータス
              </Label>
              <RadioGroup
                value={editStatus}
                onValueChange={(value) => setEditStatus(value as ReadingStatus)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="want-to-read" id="edit-status-want" />
                  <Label
                    htmlFor="edit-status-want"
                    className="font-normal cursor-pointer"
                  >
                    読みたい
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reading" id="edit-status-reading" />
                  <Label
                    htmlFor="edit-status-reading"
                    className="font-normal cursor-pointer"
                  >
                    読書中
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="completed"
                    id="edit-status-completed"
                  />
                  <Label
                    htmlFor="edit-status-completed"
                    className="font-normal cursor-pointer"
                  >
                    読了
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {editStatus === "completed" && (
              <div>
                <Label
                  htmlFor="completed-date"
                  className="text-base font-medium"
                >
                  読了日
                </Label>
                <Input
                  id="completed-date"
                  type="date"
                  value={editCompletedDate}
                  onChange={(e) => setEditCompletedDate(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}

            <div>
              <Label className="text-base font-medium mb-3 block">期待度</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setEditExpectation(rating)}
                    className="focus:outline-none focus:ring-2 focus:ring-ring rounded"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= editExpectation
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                購入ステータス
              </Label>
              <RadioGroup
                value={editPurchased ? "yes" : "no"}
                onValueChange={(value) => setEditPurchased(value === "yes")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="edit-purchased-no" />
                  <Label
                    htmlFor="edit-purchased-no"
                    className="font-normal cursor-pointer"
                  >
                    未購入
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="edit-purchased-yes" />
                  <Label
                    htmlFor="edit-purchased-yes"
                    className="font-normal cursor-pointer"
                  >
                    購入済み
                  </Label>
                </div>
              </RadioGroup>
            </div>

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

              {editPurchaseLocations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  購入場所を追加してください
                </p>
              ) : (
                <div className="space-y-4">
                  {editPurchaseLocations.map((location, locationIndex) => (
                    <div
                      key={location.id}
                      className="p-4 border border-border rounded-lg space-y-3"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <Label
                            htmlFor={`edit-location-${location.id}`}
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
                                id={`edit-location-${location.id}`}
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
                              id={`edit-location-${location.id}`}
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
                          {location.prices.map((price) => (
                            <div
                              key={price.id}
                              className="flex items-center gap-2"
                            >
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
                                  onClick={() =>
                                    removePrice(location.id, price.id)
                                  }
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

            <div>
              <Label htmlFor="edit-notes" className="text-base font-medium">
                メモ
              </Label>
              <Textarea
                id="edit-notes"
                placeholder="この本についてのメモや感想を入力"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="mt-1.5 min-h-24"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={cancelEditing}
              >
                キャンセル
              </Button>
              <Button className="flex-1" onClick={saveEditing}>
                保存
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* View Mode */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  読書ステータス
                </Label>
                <div className="mt-1">
                  <Badge variant="secondary">{statusLabels[book.status]}</Badge>
                </div>
              </div>

              {book.status === "completed" && book.completedDate && (
                <div>
                  <Label className="text-sm text-muted-foreground">
                    読了日
                  </Label>
                  <p className="mt-1">
                    {new Date(book.completedDate).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm text-muted-foreground">期待度</Label>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < book.expectation
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  購入ステータス
                </Label>
                <div className="mt-1">
                  <Badge
                    variant={book.purchased ? "default" : "secondary"}
                    className={book.purchased ? "bg-green-600" : ""}
                  >
                    {book.purchased ? "購入済み" : "未購入"}
                  </Badge>
                </div>
              </div>

              {book.purchaseLocations.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">
                    購入場所と価格
                  </Label>
                  <div className="mt-2 space-y-3">
                    {book.purchaseLocations.map((location) => (
                      <div
                        key={location.id}
                        className="p-3 bg-muted rounded-lg"
                      >
                        <p className="font-medium text-sm">
                          {location.location}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {location.prices.map((price) => (
                            <Badge key={price.id} variant="outline">
                              {price.price.toLocaleString()}円
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {book.notes && (
                <div>
                  <Label className="text-sm text-muted-foreground">メモ</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {book.notes}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm text-muted-foreground">登録日</Label>
                <p className="mt-1 text-sm">
                  {new Date(book.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
