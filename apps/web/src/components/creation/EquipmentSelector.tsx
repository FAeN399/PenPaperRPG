"use client";

import React from "react";
import type { CatalogIndex, Item } from "@pen-paper-rpg/schemas";

interface PurchasedItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  bulk: string;
}

interface EquipmentSelectorProps {
  catalog: CatalogIndex;
  strengthModifier: number;
  onEquipmentChange: (items: PurchasedItem[], remainingWealth: number) => void;
}

const STARTING_WEALTH_GP = 15;
const STARTING_WEALTH_CP = STARTING_WEALTH_GP * 100;

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const match = priceStr.match(/(\d+)\s*(gp|sp|cp)/i);
  if (!match) return 0;
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit === "gp") return amount * 100;
  if (unit === "sp") return amount * 10;
  return amount;
}

function calculateBulk(items: PurchasedItem[]): number {
  let totalBulk = 0;
  for (const item of items) {
    const bulk = item.bulk;
    if (bulk === "L") {
      totalBulk += 0.1 * item.quantity;
    } else if (bulk === "-" || !bulk) {
      continue;
    } else {
      const bulkValue = parseFloat(bulk);
      if (!isNaN(bulkValue)) {
        totalBulk += bulkValue * item.quantity;
      }
    }
  }
  return Math.floor(totalBulk);
}

function formatCurrency(cp: number): string {
  const gp = Math.floor(cp / 100);
  const sp = Math.floor((cp % 100) / 10);
  const remainingCp = cp % 10;
  const parts = [];
  if (gp > 0) parts.push(`${gp} gp`);
  if (sp > 0) parts.push(`${sp} sp`);
  if (remainingCp > 0) parts.push(`${remainingCp} cp`);
  return parts.length > 0 ? parts.join(", ") : "0 cp";
}

export function EquipmentSelector({ catalog, strengthModifier, onEquipmentChange }: EquipmentSelectorProps): JSX.Element {
  const [purchasedItems, setPurchasedItems] = React.useState<PurchasedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<"weapons" | "armor" | "gear">("weapons");

  const items = React.useMemo(() => {
    return catalog.entities.filter((entry) => entry.entity.type === "item").map((entry) => entry.entity as Item);
  }, [catalog.entities]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const desc = item.description?.toLowerCase() || "";
      const summary = item.summary?.toLowerCase() || "";
      if (selectedCategory === "weapons") {
        return desc.includes("damage:") || summary.includes("weapon");
      } else if (selectedCategory === "armor") {
        return desc.includes("ac bonus") || summary.includes("armor");
      } else {
        return !desc.includes("damage:") && !desc.includes("ac bonus");
      }
    });
  }, [items, selectedCategory]);

  const spentWealth = React.useMemo(() => {
    return purchasedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [purchasedItems]);

  const remainingWealth = STARTING_WEALTH_CP - spentWealth;
  const totalBulk = calculateBulk(purchasedItems);
  const encumberedThreshold = 5 + strengthModifier;
  const maxBulk = 10 + strengthModifier;
  const isEncumbered = totalBulk > encumberedThreshold;
  const isOverloaded = totalBulk > maxBulk;

  React.useEffect(() => {
    onEquipmentChange(purchasedItems, remainingWealth);
  }, [purchasedItems, remainingWealth, onEquipmentChange]);

  const addItem = (item: Item) => {
    const price = parsePrice(item.price);
    if (price > remainingWealth) {
      alert("Not enough gold!");
      return;
    }
    setPurchasedItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { id: item.id, name: item.name, quantity: 1, price, bulk: item.bulk || "-" }];
    });
  };

  const removeItem = (itemId: string) => {
    setPurchasedItems((prev) => {
      const existing = prev.find((p) => p.id === itemId);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return prev.map((p) => p.id === itemId ? { ...p, quantity: p.quantity - 1 } : p);
      }
      return prev.filter((p) => p.id !== itemId);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ padding: "1rem", backgroundColor: "#2d2d2d", borderRadius: "8px", border: "1px solid #daa520" }}>
        <h3 style={{ color: "#daa520", fontSize: "1.125rem", margin: "0 0 0.5rem 0" }}>Purchase Equipment</h3>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#ccc", fontSize: "0.875rem" }}>
          <div>
            <strong>Starting Wealth:</strong> {formatCurrency(STARTING_WEALTH_CP)}<br />
            <strong>Remaining:</strong> <span style={{ color: remainingWealth < 0 ? "#ff4444" : "#4ade80" }}>{formatCurrency(remainingWealth)}</span>
          </div>
          <div>
            <strong>Bulk:</strong> {totalBulk} / {maxBulk}<br />
            {isOverloaded && <span style={{ color: "#ff4444" }}>⚠ Overloaded!</span>}
            {isEncumbered && !isOverloaded && <span style={{ color: "#ff8844" }}>⚠ Encumbered</span>}
            {!isEncumbered && <span style={{ color: "#4ade80" }}>✓ Good</span>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        {(["weapons", "armor", "gear"] as const).map((category) => (
          <button key={category} type="button" onClick={() => setSelectedCategory(category)} style={{ padding: "0.5rem 1rem", backgroundColor: selectedCategory === category ? "#3a3a0a" : "#2d2d2d", border: `2px solid ${selectedCategory === category ? "#daa520" : "#444"}`, borderRadius: "4px", color: selectedCategory === category ? "#daa520" : "#ccc", cursor: "pointer", fontSize: "0.875rem", fontWeight: "bold", textTransform: "capitalize" }}>
            {category}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.75rem" }}>
        {filteredItems.map((item) => {
          const price = parsePrice(item.price);
          const canAfford = price <= remainingWealth;
          return (
            <div key={item.id} style={{ padding: "0.75rem", backgroundColor: "#2d2d2d", border: "1px solid #444", borderRadius: "4px", opacity: canAfford ? 1 : 0.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <strong style={{ color: "#e0e0e0", fontSize: "0.9rem" }}>{item.name}</strong>
                <span style={{ color: "#daa520", fontSize: "0.8rem" }}>{formatCurrency(price)}</span>
              </div>
              {item.summary && <p style={{ color: "#a0a0a0", fontSize: "0.75rem", margin: "0 0 0.5rem 0" }}>{item.summary}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#888", fontSize: "0.75rem" }}>Bulk: {item.bulk || "-"}</span>
                <button type="button" onClick={() => addItem(item)} disabled={!canAfford} style={{ padding: "0.25rem 0.75rem", backgroundColor: canAfford ? "#3a3a0a" : "#333", border: `1px solid ${canAfford ? "#daa520" : "#444"}`, borderRadius: "4px", color: canAfford ? "#daa520" : "#666", cursor: canAfford ? "pointer" : "not-allowed", fontSize: "0.75rem" }}>
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {purchasedItems.length > 0 && (
        <div style={{ padding: "1rem", backgroundColor: "#1a3a1a", border: "1px solid #4ade80", borderRadius: "8px" }}>
          <h4 style={{ color: "#4ade80", fontSize: "1rem", margin: "0 0 0.75rem 0" }}>Purchased Equipment</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {purchasedItems.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", backgroundColor: "#2d4a2d", borderRadius: "4px" }}>
                <span style={{ color: "#e0e0e0", fontSize: "0.875rem" }}>{item.name} x{item.quantity}</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: "#4ade80", fontSize: "0.8rem" }}>{formatCurrency(item.price * item.quantity)}</span>
                  <button type="button" onClick={() => removeItem(item.id)} style={{ padding: "0.25rem 0.5rem", backgroundColor: "#4a2d2d", border: "1px solid #ff4444", borderRadius: "4px", color: "#ff4444", cursor: "pointer", fontSize: "0.75rem" }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
