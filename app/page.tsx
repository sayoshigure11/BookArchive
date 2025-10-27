// "use client";
// import { useCallback, useState } from "react";

// import { BookCard } from "@/components/BookCard";
// import { BookDetailModal } from "@/components/BookDetailModal";
// import { FilterBottomSheet } from "@/components/FilterBottomSheet";
// import { useBooks } from "@/hooks/useBooks";
// import { Filter, Plus, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import Colors from "@/lib/colors";

// export default function BookListScreen() {
//   const { books, allBooks, filters, setFilters, allLocations } = useBooks();
//   const [showFilter, setShowFilter] = useState(false);
//   const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

//   const selectedBook = selectedBookId
//     ? allBooks.find((b) => b.id === selectedBookId) || null
//     : null;

//   const handleSearchChange = useCallback(
//     (text: string) => {
//       setFilters({ ...filters, searchQuery: text });
//     },
//     [filters, setFilters]
//   );

//   const activeFilterCount =
//     (filters.showPurchased !== "all" ? 1 : 0) +
//     filters.selectedLocations.length +
//     (filters.sortBy !== "date" ? 1 : 0);

//   return (
//     <div style={styles.container}>
//       {/* <Stack.Screen
//         options={{
//           headerShown: true,
//           title: "本棚",
//           headerLargeTitle: true,
//           headerRight: () => (
//             <button
//               style={styles.addButton}
//               // onPress={() => console.log("Add book")}
//               onClick={() => console.log("Add book")}
//             >
//               <Plus size={24} color={Colors.light.tint} />
//             </button>
//           ),
//         }}
//       /> */}

//       <div className="fixed top-0 flex justify-between">
//         <h1 className="text-xl">本棚</h1>
//         <button
//           style={styles.addButton}
//           onClick={() => console.log("Add book")}
//         >
//           <Plus size={24} color={Colors.light.tint} />
//         </button>
//       </div>

//       {/* <div style={styles.searchContainer}> */}
//       <div
//         style={{
//           flexDirection: "row",
//           gap: 12,
//           backgroundColor: Colors.light.cardBackground,
//           borderBottomWidth: 1,
//           borderBottomColor: Colors.light.border,
//           paddingLeft: 16,
//           paddingRight: 16,
//           paddingTop: 12,
//           paddingBottom: 12,
//         }}
//       >
//         {/* <div style={styles.searchBar}> */}
//         <div
//           style={{
//             flex: 1,
//             flexDirection: "row",
//             alignItems: "center",
//             backgroundColor: Colors.light.secondaryBackground,
//             borderRadius: 16,
//             paddingLeft: 14,
//             paddingRight: 14,
//             gap: 8,
//           }}
//         >
//           <Search size={20} color={Colors.light.textTertiary} />
//           <Input
//             style={styles.searchInput}
//             placeholder="タイトルや著者で検索"
//             value={filters.searchQuery}
//             // onChangeText={handleSearchChange}
//             onChange={(e) => handleSearchChange(e.target.value)}
//             // placeholderTextColor={Colors.light.textTertiary}
//             className="placeholder-[#A89580]"
//           />
//         </div>
//         <button
//           style={styles.filterButton}
//           // onPress={() => setShowFilter(true)}
//           onClick={() => setShowFilter(true)}
//         >
//           <Filter size={20} color={Colors.light.tint} />
//           {activeFilterCount > 0 && (
//             // <div style={styles.filterBadge}>
//             <div
//               style={{
//                 position: "absolute",
//                 top: 4,
//                 right: 4,
//                 backgroundColor: Colors.light.warning,
//                 borderRadius: 10,
//                 width: 20,
//                 height: 20,
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <p style={styles.filterBadgeText}>{activeFilterCount}</p>
//             </div>
//           )}
//         </button>
//       </div>

//       {books.length === 0 ? (
//         <div style={styles.emptyState}>
//           <p style={styles.emptyTitle}>本がまだありません</p>
//           {/* <p style={styles.emptyText}> */}
//           <p
//             style={{
//               fontSize: 16,
//               color: Colors.light.textSecondary,
//               textAlign: "center",
//               lineHeight: 26,
//             }}
//           >
//             スキャンタブからバーコードを読み取って
//             {/* {Platform.OS === "web" ? "\n" : ""} */}
//             本を登録しましょう
//           </p>
//         </div>
//       ) : (
//         // <FlatList
//         //   data={books}
//         //   renderItem={({ item }) => (
//         //     <BookCard book={item} onPress={() => setSelectedBookId(item.id)} />
//         //   )}
//         //   keyExtractor={(item) => item.id}
//         //   contentContainerStyle={[
//         //     styles.listContent,
//         //     // { paddingBottom: insets.bottom + 16 },
//         //     { paddingBottom: 16 },
//         //   ]}
//         //   showsVerticalScrollIndicator={false}
//         // />

//         <div style={(styles.listContent, { paddingBottom: 16 })}>
//           {books.map((item) => (
//             <div key={item.id}>
//               <BookCard
//                 book={item}
//                 onClick={() => setSelectedBookId(item.id)}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       <FilterBottomSheet
//         visible={showFilter}
//         filters={filters}
//         allLocations={allLocations}
//         onClose={() => setShowFilter(false)}
//         onApply={setFilters}
//       />

//       <BookDetailModal
//         visible={selectedBookId !== null}
//         book={selectedBook}
//         onClose={() => setSelectedBookId(null)}
//       />
//     </div>
//   );
// }

// // const styles = StyleSheet.create({
// const styles = {
//   container: {
//     flex: 1,
//     backgroundColor: Colors.light.background,
//   },
//   addButton: {
//     padding: 4,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 12,
//     backgroundColor: Colors.light.cardBackground,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.light.border,
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.light.secondaryBackground,
//     borderRadius: 16,
//     paddingHorizontal: 14,
//     gap: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: Colors.light.text,
//   },
//   filterButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 16,
//     backgroundColor: Colors.light.secondaryBackground,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   filterBadge: {
//     position: "absolute",
//     top: 4,
//     right: 4,
//     backgroundColor: Colors.light.warning,
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   filterBadgeText: {
//     color: "#fff",
//     fontSize: 11,
//     fontWeight: "700" as const,
//   },
//   listContent: {
//     padding: 16,
//   },
//   emptyState: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 40,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "700" as const,
//     color: Colors.light.text,
//     marginBottom: 12,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: Colors.light.textSecondary,
//     textAlign: "center",
//     lineHeight: 26,
//   },
// };

// // chatGPTに書き換えてもらった
// // app/books/page.tsx
// "use client";

// import { useState, useMemo, useCallback } from "react";
// import { Filter, Plus, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { BookCard } from "@/components/BookCard";
// import { FilterBottomSheet } from "@/components/FilterBottomSheet";
// import { BookDetailModal } from "@/components/BookDetailModal";
// import { BookProvider, useBooks } from "@/hooks/bookProvider";

// export default function BookListPage() {
//   const { books, allBooks, filters, setFilters, allLocations } = useBooks();
//   const [showFilter, setShowFilter] = useState(false);
//   const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

//   const [openModal, setOpenModal] = useState<boolean>(false);

//   const selectedBook = useMemo(
//     () => allBooks.find((b) => b.id === selectedBookId) ?? null,
//     [selectedBookId, allBooks]
//   );

//   const handleSearchChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFilters({ ...filters, searchQuery: e.target.value });
//     },
//     [filters, setFilters]
//   );

//   const activeFilterCount =
//     (filters.showPurchased !== "all" ? 1 : 0) +
//     filters.selectedLocations.length +
//     (filters.sortBy !== "date" ? 1 : 0);

//   return (
//     <BookProvider>
//       <div className="flex min-h-screen flex-col bg-background">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b bg-card px-6 py-4">
//           <h1 className="text-2xl font-bold">本棚</h1>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => console.log("Add book")}
//             aria-label="Add Book"
//           >
//             <Plus className="text-primary" />
//           </Button>
//         </div>

//         {/* Search & Filter Bar */}
//         <div className="flex items-center gap-3 border-b bg-muted/50 px-6 py-3">
//           <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-3 py-2">
//             <Search size={18} className="text-muted-foreground" />
//             <Input
//               placeholder="タイトルや著者で検索"
//               value={filters.searchQuery}
//               onChange={handleSearchChange}
//               className="border-none bg-transparent p-0 focus-visible:ring-0"
//             />
//           </div>

//           <Button
//             variant="outline"
//             size="icon"
//             className="relative rounded-xl bg-muted"
//             onClick={() => setShowFilter(true)}
//           >
//             <Filter className="text-primary" />
//             {activeFilterCount > 0 && (
//               <Badge
//                 className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-yellow-500 p-0 text-[11px] font-bold text-white"
//                 variant="secondary"
//               >
//                 {activeFilterCount}
//               </Badge>
//             )}
//           </Button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {books.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 text-center">
//               <h2 className="mb-3 text-xl font-bold">本がまだありません</h2>
//               <p className="text-muted-foreground">
//                 スキャン機能でバーコードを読み取って登録しましょう。
//               </p>
//             </div>
//           ) : (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {books.map((book) => (
//                 <BookCard
//                   key={book.id}
//                   book={book}
//                   // onClick={() => setSelectedBookId(book.id)}
//                   onClick={() => {
//                     setSelectedBookId(book.id);
//                     setOpenModal(true);
//                   }}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Filter Bottom Sheet */}
//         {/* <Sheet open={showFilter} onOpenChange={setShowFilter}>
//         <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
//           <SheetHeader>
//             <SheetTitle>フィルター</SheetTitle>
//           </SheetHeader>
//           <div className="mt-4 space-y-4">
//             <p className="text-sm text-muted-foreground">
//               （ここにFilter UIを実装）
//             </p>
//             <Button onClick={() => setShowFilter(false)}>閉じる</Button>
//           </div>
//         </SheetContent>
//       </Sheet> */}

//         <FilterBottomSheet
//           visible={showFilter}
//           filters={filters}
//           allLocations={allLocations}
//           // onClose={() => setShowFilter(false)}
//           onOpenChange={() => setShowFilter(false)}
//           onApply={setFilters}
//         />

//         {/* Book Detail Modal */}
//         {/* <Dialog
//         open={!!selectedBookId}
//         onOpenChange={() => setSelectedBookId(null)}
//       >
//         <DialogContent className="max-w-md">
//           {selectedBook ? (
//             <>
//               <h2 className="text-lg font-bold">{selectedBook.title}</h2>
//               <p className="text-sm text-muted-foreground mb-3">
//                 {selectedBook.author}
//               </p>
//               <Card className="p-3">
//                 <p className="text-sm">
//                   場所: {selectedBook.locations.map((l) => l.place).join(", ")}
//                 </p>
//                 {selectedBook.purchased && (
//                   <Badge className="mt-2 bg-green-500">購入済</Badge>
//                 )}
//               </Card>
//             </>
//           ) : (
//             <p>選択中の本がありません</p>
//           )}
//         </DialogContent>
//       </Dialog> */}

//         <BookDetailModal
//           // visible={selectedBookId !== null}
//           visible={selectedBookId !== null}
//           book={selectedBook}
//           onOpenChange={() => setSelectedBookId(null)}
//           // onOpenChange={setOpenModal}
//         />
//       </div>
//     </BookProvider>
//   );
// }

"use client";

import { BookProvider } from "@/hooks/bookProvider";
import BookListPage from "./components/home";

function page() {
  return (
    <div>
      <BookListPage />
    </div>
  );
}

export default page;
