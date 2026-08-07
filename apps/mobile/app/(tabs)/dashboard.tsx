import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import { getAllParts, Part } from "../../repositories/partsRepository";
import { getSales, Sale } from "../../repositories/salesRepository";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // Perfectly spaces a 2-column grid with margins

function isToday(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [partsData, salesData] = await Promise.all([
      getAllParts(),
      getSales(),
    ]);
    setParts(partsData);
    setSales(salesData);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const stats = useMemo(() => {
    const lowStock = parts.filter(
      (part) => part.quantity > 0 && part.quantity <= 2,
    ).length;
    const addedToday = parts.filter((part) => isToday(part.created_at)).length;
    const salesToday = sales.filter((sale) => isToday(sale.sold_at)).length;

    return {
      totalParts: parts.length,
      lowStock,
      addedToday,
      salesToday,
    };
  }, [parts, sales]);

  const recentActivity = useMemo(() => {
    const partEvents = parts.map((part) => ({
      id: `part-${part.id}`,
      date: part.created_at,
      title: part.name,
      subtitle: `Added ${part.quantity} item${part.quantity === 1 ? "" : "s"}`,
      icon: "plus",
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
    }));

    const salesEvents = sales.map((sale) => {
      const part = parts.find((p) => p.id === sale.part_id);
      return {
        id: `sale-${sale.id}`,
        date: sale.sold_at,
        title: part?.name ?? "Part sold",
        subtitle: `Sold ${sale.quantity_sold} item${sale.quantity_sold === 1 ? "" : "s"}`,
        icon: "cart",
        iconBg: "#E3F2FD",
        iconColor: "#1976D2",
      };
    });

    return [...partEvents, ...salesEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 2);
  }, [parts, sales]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 👤 HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text
            variant="headlineSmall"
            style={{ fontWeight: "bold", color: theme.colors.onBackground }}
          >
            Star Auto
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Inventory Control Desk
          </Text>
        </View>
        <Avatar.Icon
          size={44}
          icon="account"
          backgroundColor={theme.colors.primaryContainer}
          color={theme.colors.primary}
        />
      </View>

      {/* 📊 2x2 HIGH-DENSITY KPI GRID */}
      <View style={styles.grid}>
        <Surface
          style={[styles.surfaceCard, { width: CARD_WIDTH }]}
          elevation={1}
        >
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={26}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={styles.statNum}>
            {stats.totalParts}
          </Text>
          <Text variant="labelMedium" style={styles.statLabel}>
            Total Parts
          </Text>
        </Surface>

        <Surface
          style={[styles.surfaceCard, { width: CARD_WIDTH }]}
          elevation={1}
        >
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={26}
            color={theme.colors.error}
          />
          <Text
            variant="headlineMedium"
            style={[styles.statNum, { color: theme.colors.error }]}
          >
            {stats.lowStock}
          </Text>
          <Text variant="labelMedium" style={styles.statLabel}>
            Low Stock Alerts
          </Text>
        </Surface>

        <Surface
          style={[styles.surfaceCard, { width: CARD_WIDTH }]}
          elevation={1}
        >
          <MaterialCommunityIcons name="history" size={26} color="#4CAF50" />
          <Text variant="headlineMedium" style={styles.statNum}>
            {stats.addedToday}
          </Text>
          <Text variant="labelMedium" style={styles.statLabel}>
            Added Today
          </Text>
        </Surface>

        <Surface
          style={[styles.surfaceCard, { width: CARD_WIDTH }]}
          elevation={1}
        >
          <MaterialCommunityIcons
            name="cash-multiple"
            size={26}
            color="#FF9800"
          />
          <Text
            variant="headlineMedium"
            style={stats.salesToday > 0 ? { color: "#FF9800" } : null}
          >
            {stats.salesToday}
          </Text>
          <Text variant="labelMedium" style={styles.statLabel}>
            Sales Today
          </Text>
        </Surface>
      </View>

      {/* ⚡ QUICK ACTIONS ACTION BAR */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Quick Operations
      </Text>
      <View style={styles.actionRow}>
        <Card
          style={styles.actionCard}
          onPress={() => router.push("/add-part")}
        >
          <Card.Content style={styles.actionContent}>
            <IconButton
              icon="plus-circle"
              iconColor={theme.colors.primary}
              size={28}
            />
            <Text variant="labelLarge">Add Part</Text>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard} onPress={() => router.push("/search")}>
          <Card.Content style={styles.actionContent}>
            <IconButton
              icon="magnify"
              iconColor={theme.colors.primary}
              size={28}
            />
            <Text variant="labelLarge">Find Stock</Text>
          </Card.Content>
        </Card>
      </View>

      {/* ⏱️ RECENT ACTIVITY TIMELINE */}
      <View style={styles.sectionHeaderRow}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Recent Activity
        </Text>
        <Button compact onPress={() => router.push("/stock")}>
          View All
        </Button>
      </View>

      <Card style={styles.activityCard}>
        <Card.Content>
          {recentActivity.length === 0 ? (
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              No activity yet. Add a part or record a sale to populate the
              dashboard.
            </Text>
          ) : (
            recentActivity.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.activityItem,
                  index > 0 ? styles.borderTop : null,
                ]}
              >
                <Avatar.Icon
                  size={32}
                  icon={item.icon}
                  backgroundColor={item.iconBg}
                  color={item.iconColor}
                />
                <View style={styles.activityTextContainer}>
                  <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                    {item.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.timeText}>
                  {new Date(item.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60, // Clear system notch safely
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  surfaceCard: {
    padding: 16,
    height: 125,
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: "center",
  },
  statNum: {
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  actionContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activityCard: {
    borderRadius: 16,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  activityTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  borderTop: {
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.1)",
    marginTop: 4,
  },
  timeText: {
    opacity: 0.5,
  },
});
