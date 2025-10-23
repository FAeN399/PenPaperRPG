import React from "react";
import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { Character } from "@pen-paper-rpg/schemas";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111111",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottom: "2pt solid #333333",
    paddingBottom: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 4,
    color: "#000000",
  },
  identityRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 2,
  },
  identityField: {
    fontSize: 9,
    color: "#444444",
  },
  identityLabel: {
    fontWeight: 600,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    marginTop: 12,
    color: "#222222",
    textTransform: "uppercase",
    borderBottom: "1pt solid #cccccc",
    paddingBottom: 2,
  },
  column: {
    flexDirection: "column",
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  field: {
    border: "1pt solid #333333",
    padding: 6,
    borderRadius: 4,
    flexGrow: 1,
  },
  label: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#555555",
  },
  value: {
    fontSize: 14,
    fontWeight: 700,
  },
  abilityGrid: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  abilityBlock: {
    border: "1pt solid #333333",
    borderRadius: 4,
    padding: 8,
    flex: 1,
    alignItems: "center",
  },
  abilityName: {
    fontSize: 8,
    fontWeight: 600,
    textTransform: "uppercase",
    color: "#555555",
    marginBottom: 4,
  },
  abilityScore: {
    fontSize: 16,
    fontWeight: 900,
    color: "#000000",
    marginBottom: 2,
  },
  abilityModifier: {
    fontSize: 10,
    fontWeight: 600,
    color: "#666666",
  },
  derivedStatsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  derivedStatBlock: {
    border: "1pt solid #333333",
    borderRadius: 4,
    padding: 6,
    flex: 1,
    alignItems: "center",
  },
  derivedStatLabel: {
    fontSize: 7,
    textTransform: "uppercase",
    color: "#555555",
    marginBottom: 2,
  },
  derivedStatValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#000000",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    border: "1pt solid #333333",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
    padding: 4,
    fontSize: 9,
    fontWeight: 600,
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottom: "1pt solid #e2e2e2",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
});

// Helper function to calculate ability modifier
function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Helper function to format modifier with sign
function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function CharacterIdentityHeader({ character }: { character: Character }): JSX.Element {
  // Extract readable names from IDs (remove prefixes like "pf2e.ancestry.")
  const getDisplayName = (id: string): string => {
    const parts = id.split('.');
    const name = parts[parts.length - 1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <View style={styles.header}>
      <View style={{ flex: 2 }}>
        <Text style={styles.characterName}>{character.metadata.name}</Text>
        <View style={styles.identityRow}>
          <Text style={[styles.identityField, styles.identityLabel]}>Level {character.identity.level}</Text>
          <Text style={styles.identityField}>•</Text>
          <Text style={styles.identityField}>{getDisplayName(character.identity.ancestryId)}</Text>
          <Text style={styles.identityField}>•</Text>
          <Text style={styles.identityField}>{getDisplayName(character.identity.backgroundId)}</Text>
          <Text style={styles.identityField}>•</Text>
          <Text style={styles.identityField}>{getDisplayName(character.identity.classId)}</Text>
        </View>
        {character.identity.heritageId && (
          <View style={styles.identityRow}>
            <Text style={[styles.identityField, styles.identityLabel]}>Heritage:</Text>
            <Text style={styles.identityField}>{getDisplayName(character.identity.heritageId)}</Text>
          </View>
        )}
        {character.identity.alignment && (
          <View style={styles.identityRow}>
            <Text style={[styles.identityField, styles.identityLabel]}>Alignment:</Text>
            <Text style={styles.identityField}>{character.identity.alignment}</Text>
          </View>
        )}
        {character.identity.deityId && (
          <View style={styles.identityRow}>
            <Text style={[styles.identityField, styles.identityLabel]}>Deity:</Text>
            <Text style={styles.identityField}>{getDisplayName(character.identity.deityId)}</Text>
          </View>
        )}
        {character.metadata.player && (
          <View style={styles.identityRow}>
            <Text style={[styles.identityField, styles.identityLabel]}>Player:</Text>
            <Text style={styles.identityField}>{character.metadata.player}</Text>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.field}>
          <Text style={styles.label}>Experience Points</Text>
          <Text style={styles.value}>—</Text>
        </View>
      </View>
    </View>
  );
}

function AbilityScoresSection({ character }: { character: Character }): JSX.Element {
  const abilities = character.abilityScores.final;

  return (
    <View>
      <Text style={styles.sectionTitle}>Ability Scores</Text>
      <View style={styles.abilityGrid}>
        {Object.entries(abilities).map(([ability, score]) => {
          const modifier = getAbilityModifier(score);
          return (
            <View key={ability} style={styles.abilityBlock}>
              <Text style={styles.abilityName}>{ability}</Text>
              <Text style={styles.abilityScore}>{score}</Text>
              <Text style={styles.abilityModifier}>{formatModifier(modifier)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}


function ProficiencySummarySection({ character }: { character: Character }): JSX.Element {
  // Format proficiency rank for display
  const formatRank = (rank: string): string => {
    switch (rank) {
      case "untrained": return "U";
      case "trained": return "T";
      case "expert": return "E";
      case "master": return "M";
      case "legendary": return "L";
      default: return "—";
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Proficiency Summary</Text>

      {/* Combat Proficiencies */}
      <View style={styles.row}>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Perception</Text>
          <Text style={styles.value}>{formatRank(character.proficiencies.perception)}</Text>
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Class DC</Text>
          <Text style={styles.value}>{formatRank(character.proficiencies.classDC)}</Text>
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Fortitude</Text>
          <Text style={styles.value}>{formatRank(character.proficiencies.saves.fortitude)}</Text>
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Reflex</Text>
          <Text style={styles.value}>{formatRank(character.proficiencies.saves.reflex)}</Text>
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <Text style={styles.label}>Will</Text>
          <Text style={styles.value}>{formatRank(character.proficiencies.saves.will)}</Text>
        </View>
      </View>

      {/* Weapon & Armor Proficiencies */}
      {(Object.keys(character.proficiencies.weapons).length > 0 || Object.keys(character.proficiencies.armor).length > 0) && (
        <View>
          <Text style={[styles.sectionTitle, { fontSize: 10, marginTop: 8, marginBottom: 4 }]}>Combat Proficiencies</Text>
          <View style={styles.row}>
            {Object.entries(character.proficiencies.weapons).slice(0, 3).map(([weapon, rank]) => (
              <View key={weapon} style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>{weapon.replace("weapon:", "").replace(":", " ")}</Text>
                <Text style={styles.value}>{formatRank(rank)}</Text>
              </View>
            ))}
            {Object.entries(character.proficiencies.armor).slice(0, 2).map(([armor, rank]) => (
              <View key={armor} style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>{armor}</Text>
                <Text style={styles.value}>{formatRank(rank)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Languages and Senses */}
      {(character.languages.length > 0 || character.senses.length > 0) && (
        <View>
          <Text style={[styles.sectionTitle, { fontSize: 10, marginTop: 8, marginBottom: 4 }]}>Languages & Senses</Text>
          <View style={styles.row}>
            {character.languages.length > 0 && (
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={styles.label}>Languages</Text>
                <Text style={[styles.value, { fontSize: 9 }]}>{character.languages.join(", ")}</Text>
              </View>
            )}
            {character.senses.length > 0 && (
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={styles.label}>Senses</Text>
                <Text style={[styles.value, { fontSize: 9 }]}>{character.senses.join(", ")}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

function SkillsTable({ character }: { character: Character }): JSX.Element {
  const rows = Object.entries(character.derived.skills).sort(([a], [b]) => a.localeCompare(b));
  return (
    <View>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.table}>
        <View style={[styles.tableHeader, { flexDirection: "row" }]}>
          <Text style={[styles.tableCell, { flex: 3, fontWeight: 600 }]}>Skill</Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: "center", fontWeight: 600 }]}>Modifier</Text>
          <Text style={[styles.tableCell, { flex: 1, textAlign: "center", fontWeight: 600 }]}>Rank</Text>
        </View>
        {rows.map(([skill, data]) => (
          <View key={skill} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{skill}</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: "center", fontWeight: 600 }]}>
              {formatModifier(data.modifier)}
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: "center", textTransform: "capitalize" }]}>
              {data.rank.charAt(0).toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProficiencyAndDerivedStats({ character }: { character: Character }): JSX.Element {
  // Calculate proficiency bonus based on level
  const proficiencyBonus = Math.floor((character.identity.level - 1) / 4) + 2;

  return (
    <View>
      <Text style={styles.sectionTitle}>Derived Statistics</Text>

      {/* Core Stats Row */}
      <View style={styles.derivedStatsGrid}>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Proficiency Bonus</Text>
          <Text style={styles.derivedStatValue}>+{proficiencyBonus}</Text>
        </View>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Armor Class</Text>
          <Text style={styles.derivedStatValue}>{character.derived.armorClass.value}</Text>
        </View>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Perception</Text>
          <Text style={styles.derivedStatValue}>{formatModifier(character.derived.perception.modifier)}</Text>
        </View>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Class DC</Text>
          <Text style={styles.derivedStatValue}>{character.derived.classDC?.value ?? "—"}</Text>
        </View>
      </View>

      {/* Health and Saves Row */}
      <View style={styles.derivedStatsGrid}>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Hit Points</Text>
          <Text style={styles.derivedStatValue}>{character.derived.hitPoints.current}/{character.derived.hitPoints.max}</Text>
          {character.derived.hitPoints.temporary > 0 && (
            <Text style={[styles.derivedStatLabel, { fontSize: 6 }]}>
              +{character.derived.hitPoints.temporary} temp
            </Text>
          )}
        </View>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Fortitude</Text>
          <Text style={styles.derivedStatValue}>{formatModifier(character.derived.saves.fortitude.value)}</Text>
        </View>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Reflex</Text>
          <Text style={styles.derivedStatValue}>{formatModifier(character.derived.saves.reflex.value)}</Text>
        </View>
        <View style={styles.derivedStatBlock}>
          <Text style={styles.derivedStatLabel}>Will</Text>
          <Text style={styles.derivedStatValue}>{formatModifier(character.derived.saves.will.value)}</Text>
        </View>
      </View>

      {/* Speed and Movement */}
      {Object.keys(character.derived.speeds).length > 0 && (
        <View style={styles.derivedStatsGrid}>
          {Object.entries(character.derived.speeds).map(([speedType, value]) => (
            <View key={speedType} style={styles.derivedStatBlock}>
              <Text style={styles.derivedStatLabel}>{speedType} Speed</Text>
              <Text style={styles.derivedStatValue}>{value} ft</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function CharacterSheetPage({ character }: { character: Character }): JSX.Element {
  return (
    <Page size="A4" style={styles.page}>
      <CharacterIdentityHeader character={character} />

      <AbilityScoresSection character={character} />

      <ProficiencyAndDerivedStats character={character} />

      <ProficiencySummarySection character={character} />

      <SkillsTable character={character} />
    </Page>
  );
}

export function CharacterSheetDocument({ character }: { character: Character }): JSX.Element {
  return (
    <Document>
      <CharacterSheetPage character={character} />
    </Document>
  );
}

export async function renderCharacterPdf(character: Character): Promise<ArrayBuffer> {
  try {
    const instance = pdf(<CharacterSheetDocument character={character} />);
    const blob = await instance.toBlob();
    return await blob.arrayBuffer();
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

