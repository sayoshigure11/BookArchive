// import Colors from "@/lib/colors";
// import { Book } from "@/lib/types";
// import { Check, MapPin, Star, Text } from "lucide-react";
// import Image from "next/image";

// type BookCardProps = {
//   book: Book;
//   onPress: () => void;
// };

// export function BookCard({ book, onPress }: BookCardProps) {
//   return (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={onPress}
//       activeOpacity={0.7}
//       testID={`book-card-${book.id}`}
//     >
//       <Image
//         alt="Cover Image"
//         // source={{ uri: book.coverImage }}
//         src={book.coverImage}
//         style={styles.cover}
//         // contentFit="cover"
//         // transition={200}
//       />
//       <div style={styles.info}>
//         <p style={styles.title} numberOfLines={2}>
//           {book.title}
//         </p>
//         <p style={styles.author} numberOfLines={1}>
//           {book.author}
//         </p>

//         <div style={styles.meta}>
//           {book.purchased && (
//             <div style={styles.badge}>
//               <Check size={12} color="#fff" />
//               <Text style={styles.badgeText}>購入済</Text>
//             </div>
//           )}

//           {book.expectation > 0 && (
//             <div style={styles.expectation}>
//               <Star size={12} color="#FFB347" fill="#FFB347" />
//               <Text style={styles.expectationText}>{book.expectation}</Text>
//             </div>
//           )}
//         </div>

//         {book.locations.length > 0 && (
//           <div style={styles.location}>
//             <MapPin size={12} color={Colors.light.textSecondary} />
//             <Text style={styles.locationText} numberOfLines={1}>
//               {book.locations.map((l) => l.place).join(", ")}
//             </Text>
//           </div>
//         )}
//       </div>
//     </TouchableOpacity>
//   );
// }

// // const styles = StyleSheet.create({
// //   card: {
// //     backgroundColor: Colors.light.cardBackground,
// //     borderRadius: 20,
// //     overflow: "hidden",
// //     marginBottom: 16,
// //     shadowColor: Colors.light.text,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 12,
// //     elevation: 2,
// //     flexDirection: "row",
// //   },
// //   cover: {
// //     width: 90,
// //     height: 135,
// //     backgroundColor: Colors.light.secondaryBackground,
// //   },
// //   info: {
// //     flex: 1,
// //     padding: 14,
// //   },
// //   title: {
// //     fontSize: 16,
// //     fontWeight: "700" as const,
// //     marginBottom: 4,
// //     color: Colors.light.text,
// //   },
// //   author: {
// //     fontSize: 14,
// //     color: Colors.light.textSecondary,
// //     marginBottom: 8,
// //   },
// //   meta: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //     marginBottom: 6,
// //   },
// //   badge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: Colors.light.success,
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 14,
// //     gap: 4,
// //   },
// //   badgeText: {
// //     fontSize: 11,
// //     color: "#fff",
// //     fontWeight: "600" as const,
// //   },
// //   expectation: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //   },
// //   expectationText: {
// //     fontSize: 13,
// //     fontWeight: "600" as const,
// //     color: Colors.light.text,
// //   },
// //   location: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //   },
// //   locationText: {
// //     fontSize: 12,
// //     color: Colors.light.textSecondary,
// //   },
// // });

// const styles = {
//   card: {
//     backgroundColor: Colors.light.cardBackground,
//     borderRadius: 20,
//     overflow: "hidden",
//     marginBottom: 16,
//     shadowColor: Colors.light.text,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 2,
//     flexDirection: "row",
//   },
//   cover: {
//     width: 90,
//     height: 135,
//     backgroundColor: Colors.light.secondaryBackground,
//   },
//   info: {
//     flex: 1,
//     padding: 14,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "700" as const,
//     marginBottom: 4,
//     color: Colors.light.text,
//   },
//   author: {
//     fontSize: 14,
//     color: Colors.light.textSecondary,
//     marginBottom: 8,
//   },
//   meta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 6,
//   },
//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: Colors.light.success,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 14,
//     gap: 4,
//   },
//   badgeText: {
//     fontSize: 11,
//     color: "#fff",
//     fontWeight: "600" as const,
//   },
//   expectation: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   expectationText: {
//     fontSize: 13,
//     fontWeight: "600" as const,
//     color: Colors.light.text,
//   },
//   location: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   locationText: {
//     fontSize: 12,
//     color: Colors.light.textSecondary,
//   },
// };

// chatGPTに書き換えて貰った。
// components/BookCard.tsx
"use client";

import Image from "next/image";
import { Check, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/lib/types";

type BookCardProps = {
  book: Book;
  onClick: () => void;
};

export function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg",
        "dark:bg-neutral-900 dark:hover:shadow-neutral-700"
      )}
    >
      <div className="relative h-[135px] w-[90px] shrink-0 bg-muted">
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-foreground">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {book.author}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {book.purchased && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-green-500 text-white hover:bg-green-600"
            >
              <Check size={12} />
              <span className="text-xs font-semibold">購入済</span>
            </Badge>
          )}

          {book.expectation && book.expectation > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{book.expectation}</span>
            </div>
          )}
        </div>

        {book.locations.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin size={12} />
            <p className="line-clamp-1 text-xs">
              {book.locations.map((l) => l.place).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
