import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  IconButton,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import {
  getAllParts,
  Part,
  searchParts,
} from "../../repositories/partsRepository";

export default function SearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Part[]>([]);

  useEffect(() => {
    const run = async () => {
      if (query.trim() === "") {
        setResults(await getAllParts());
      } else {
        setResults(await searchParts(query.trim()));
      }
    };
    run();
  }, [query]);

  return (
    <View
      style={[
        styles.container,
        { marginTop: "10%", backgroundColor: theme.colors.background },
      ]}
    >
      <Surface
        style={[styles.searchHeader, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.headerTop}>
          <IconButton icon="arrow-left" onPress={() => router.back()} />
          <View style={styles.titleBlock}>
            <Text variant="headlineSmall" style={styles.title}>
              Find Parts
            </Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Search by part name or car model
            </Text>
          </View>
        </View>

        <Searchbar
          placeholder="Search parts, models, or keywords"
          value={query}
          onChangeText={setQuery}
          icon={() => (
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color={theme.colors.onSurface}
            />
          )}
          style={styles.searchbar}
          inputStyle={styles.searchbarInput}
          clearIcon="close"
        />
      </Surface>

      <ScrollView contentContainerStyle={styles.results}>
        <Text variant="labelMedium" style={styles.resultCount}>
          Showing {results.length} {results.length === 1 ? "result" : "results"}
        </Text>

        {results.length === 0 ? (
          <Surface
            style={[
              styles.emptyCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No matches found
            </Text>
            <Text variant="bodySmall" style={styles.emptyText}>
              Try another search term or tap add part to create a new stock
              item.
            </Text>
          </Surface>
        ) : (
          results.map((part) => (
            <Pressable
              key={part.id}
              onPress={() => router.push(`/part/${part.id}`)}
              style={({ pressed }) => [
                styles.partRow,
                {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.dark ? "#000" : "#000",
                  shadowOpacity: pressed ? 0.08 : 0.12,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <MaterialCommunityIcons
                  name="car-wrench"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.partInfo}>
                <Text
                  variant="titleMedium"
                  style={styles.partName}
                  numberOfLines={1}
                >
                  {part.name}
                </Text>
                <Text
                  variant="bodySmall"
                  style={styles.partSub}
                  numberOfLines={1}
                >
                  {part.car_make_model ?? "Unknown model"}
                </Text>
              </View>
              <View style={styles.qtyBadge}>
                <Text variant="labelSmall" style={styles.qtyText}>
                  x{part.quantity}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: {
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 12,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  titleBlock: {
    flex: 1,
    marginLeft: 2,
  },
  title: {
    fontWeight: "700",
  },
  subtitle: {
    color: "#6E6E76",
    marginTop: 2,
  },
  searchbar: {
    borderRadius: 14,
    height: 48,
  },
  searchbarInput: {
    fontSize: 14,
  },
  results: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  resultCount: {
    marginBottom: 12,
    marginLeft: 2,
    color: "#6E6E76",
  },
  partRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontWeight: "700",
  },
  partSub: {
    marginTop: 4,
    color: "#6E6E76",
  },
  qtyBadge: {
    minWidth: 44,
    borderRadius: 12,
    backgroundColor: "rgba(25, 118, 210, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  qtyText: {
    color: "#1976D2",
    fontWeight: "700",
  },
  emptyCard: {
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  emptyTitle: {
    marginBottom: 8,
    fontWeight: "700",
  },
  emptyText: {
    color: "#6E6E76",
    textAlign: "center",
    lineHeight: 20,
  },
});
