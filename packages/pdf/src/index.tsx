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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
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

function AbilityBlock({
  character,
}: {
  character: Character;
}): JSX.Element {
  const abilities = character.abilityScores.final;
  return (
    <View style={styles.row}>
      {Object.entries(abilities).map(([ability, score]) => (
        <View key={ability} style={styles.field}>
          <Text style={styles.label}>{ability}</Text>
          <Text style={styles.value}>{score}</Text>
        </View>
      ))}
    </View>
  );
}

function DefenseBlock({ character }: { character: Character }): JSX.Element {
  const { derived } = character;
  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <Text style={styles.label}>Armor Class</Text>
        <Text style={styles.value}>{derived.armorClass.value}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Perception</Text>
        <Text style={styles.value}>{derived.perception.modifier}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Fortitude</Text>
        <Text style={styles.value}>{derived.saves.fortitude.value}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Reflex</Text>
        <Text style={styles.value}>{derived.saves.reflex.value}</Text>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Will</Text>
        <Text style={styles.value}>{derived.saves.will.value}</Text>
      </View>
    </View>
  );
}

function SkillsTable({ character }: { character: Character }): JSX.Element {
  const rows = Object.entries(character.derived.skills).sort(([a], [b]) => a.localeCompare(b));
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text>Skill</Text>
        </View>
        {rows.map(([skill, data]) => (
          <View key={skill} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{skill}</Text>
            <Text style={[styles.tableCell, { textAlign: "right" }]}>{data.modifier}</Text>
            <Text style={[styles.tableCell, { textTransform: "capitalize" }]}>{data.rank}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CharacterSheetPage({ character }: { character: Character }): JSX.Element {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>{character.metadata.name}</Text>
          <Text>{character.identity.classId}</Text>
        </View>
        <View style={styles.column}>
          <View style={styles.field}>
            <Text style={styles.label}>Level</Text>
            <Text style={styles.value}>{character.identity.level}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Ancestry</Text>
            <Text style={styles.value}>{character.identity.ancestryId}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Ability Scores</Text>
      <AbilityBlock character={character} />

      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Defenses</Text>
      <DefenseBlock character={character} />

      <View style={{ marginTop: 8 }}>
        <Text style={styles.sectionTitle}>Hit Points</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Max</Text>
            <Text style={styles.value}>{character.derived.hitPoints.max}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Current</Text>
            <Text style={styles.value}>{character.derived.hitPoints.current}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Temporary</Text>
            <Text style={styles.value}>{character.derived.hitPoints.temporary}</Text>
          </View>
        </View>
      </View>

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

export async function renderCharacterPdf(character: Character): Promise<Uint8Array> {
  const instance = pdf(<CharacterSheetDocument character={character} />);
  const buffer = await instance.toBuffer();
  return new Uint8Array(buffer);
}

