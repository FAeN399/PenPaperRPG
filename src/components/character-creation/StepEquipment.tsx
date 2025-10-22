import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import { ProficiencyLevel } from '@/types/character'
import { Weapon, Armor, Item } from '@/types/gameData'
import { useState, useMemo } from 'react'
import Card from '@/components/shared/Card'

export default function StepEquipment() {
  const { character, updateEquipment } = useCharacter()
  const { weapons, armor, items, getClassById } = useGameData()

  const [selectedWeapons, setSelectedWeapons] = useState<string[]>(
    character.equipment.weapons || []
  )
  const [selectedArmor, setSelectedArmor] = useState<string | null>(
    character.equipment.armor || null
  )
  const [selectedItems, setSelectedItems] = useState<string[]>(
    character.equipment.items || []
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<'weapons' | 'armor' | 'items'>('weapons')

  const classData = character.class ? getClassById(character.class.class) : null

  // Starting gold (15 gp for level 1)
  const startingGold = 15

  // Calculate gold spent
  const goldSpent = useMemo(() => {
    let total = 0

    // Weapons
    selectedWeapons.forEach((id) => {
      const weapon = weapons.find((w) => w.id === id)
      if (weapon) {
        total += parseGold(weapon.price)
      }
    })

    // Armor
    if (selectedArmor) {
      const armorItem = armor.find((a) => a.id === selectedArmor)
      if (armorItem) {
        total += parseGold(armorItem.price)
      }
    }

    // Items
    selectedItems.forEach((id) => {
      const item = items.find((i) => i.id === id)
      if (item) {
        total += parseGold(item.price)
      }
    })

    return total
  }, [selectedWeapons, selectedArmor, selectedItems, weapons, armor, items])

  const goldRemaining = startingGold - goldSpent

  // Calculate total bulk
  const totalBulk = useMemo(() => {
    let bulk = 0

    selectedWeapons.forEach((id) => {
      const weapon = weapons.find((w) => w.id === id)
      if (weapon) {
        bulk += parseBulk(weapon.bulk)
      }
    })

    if (selectedArmor) {
      const armorItem = armor.find((a) => a.id === selectedArmor)
      if (armorItem) {
        bulk += parseBulk(armorItem.bulk)
      }
    }

    selectedItems.forEach((id) => {
      const item = items.find((i) => i.id === id)
      if (item) {
        bulk += parseBulk(item.bulk)
      }
    })

    return bulk
  }, [selectedWeapons, selectedArmor, selectedItems, weapons, armor, items])

  // Filter weapons by proficiency
  const availableWeapons = useMemo(() => {
    if (!classData) return []

    return weapons.filter((weapon) => {
      // Check if class is proficient
      const profs = classData.initialProficiencies.attacks
      if (
        weapon.category === 'simple' &&
        profs.simple >= ProficiencyLevel.Trained
      ) {
        return true
      }
      if (
        weapon.category === 'martial' &&
        profs.martial >= ProficiencyLevel.Trained
      ) {
        return true
      }
      return false
    })
  }, [weapons, classData])

  // Filter armor by proficiency
  const availableArmor = useMemo(() => {
    if (!classData) return []

    return armor.filter((armorItem) => {
      // Unarmored and shields are always available
      if (armorItem.category === 'unarmored' || armorItem.category === 'shield') {
        return true
      }

      const profs = classData.initialProficiencies.defenses

      // Check armor proficiency
      if (armorItem.category === 'light') {
        return profs.light >= ProficiencyLevel.Trained
      }
      if (armorItem.category === 'medium') {
        return profs.medium >= ProficiencyLevel.Trained
      }
      if (armorItem.category === 'heavy') {
        return profs.heavy >= ProficiencyLevel.Trained
      }

      return false
    })
  }, [armor, classData])

  // Filter by search
  const filteredWeapons = availableWeapons.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredArmor = availableArmor.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleWeapon = (id: string) => {
    const newSelection = selectedWeapons.includes(id)
      ? selectedWeapons.filter((w) => w !== id)
      : [...selectedWeapons, id]

    setSelectedWeapons(newSelection)
    updateEquipment({ weapons: newSelection, armor: selectedArmor, items: selectedItems, gold: goldRemaining })
  }

  const selectArmor = (id: string | null) => {
    setSelectedArmor(id)
    updateEquipment({ weapons: selectedWeapons, armor: id, items: selectedItems, gold: goldRemaining })
  }

  const toggleItem = (id: string) => {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter((i) => i !== id)
      : [...selectedItems, id]

    setSelectedItems(newSelection)
    updateEquipment({ weapons: selectedWeapons, armor: selectedArmor, items: newSelection, gold: goldRemaining })
  }

  return (
    <div>
      {/* Gold & Bulk Display */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-pf-text-muted text-sm mb-1">Starting Gold</div>
          <div className="text-2xl font-bold text-pf-accent">{startingGold} gp</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-pf-text-muted text-sm mb-1">Remaining</div>
          <div
            className={`text-2xl font-bold ${
              goldRemaining < 0 ? 'text-red-500' : 'text-pf-accent'
            }`}
          >
            {goldRemaining.toFixed(2)} gp
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-pf-text-muted text-sm mb-1">Total Bulk</div>
          <div className="text-2xl font-bold text-pf-accent">{totalBulk.toFixed(1)}</div>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterCategory('weapons')}
          className={`px-4 py-2 rounded ${
            filterCategory === 'weapons'
              ? 'bg-pf-accent text-pf-bg'
              : 'bg-pf-bg-card text-pf-text'
          }`}
        >
          Weapons ({selectedWeapons.length})
        </button>
        <button
          onClick={() => setFilterCategory('armor')}
          className={`px-4 py-2 rounded ${
            filterCategory === 'armor'
              ? 'bg-pf-accent text-pf-bg'
              : 'bg-pf-bg-card text-pf-text'
          }`}
        >
          Armor {selectedArmor ? '(1)' : ''}
        </button>
        <button
          onClick={() => setFilterCategory('items')}
          className={`px-4 py-2 rounded ${
            filterCategory === 'items'
              ? 'bg-pf-accent text-pf-bg'
              : 'bg-pf-bg-card text-pf-text'
          }`}
        >
          Items ({selectedItems.length})
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-pf-bg-card border border-gray-700 rounded text-pf-text"
        />
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterCategory === 'weapons' &&
          filteredWeapons.map((weapon) => (
            <WeaponCard
              key={weapon.id}
              weapon={weapon}
              selected={selectedWeapons.includes(weapon.id)}
              onToggle={() => toggleWeapon(weapon.id)}
            />
          ))}

        {filterCategory === 'armor' &&
          filteredArmor.map((armorItem) => (
            <ArmorCard
              key={armorItem.id}
              armor={armorItem}
              selected={selectedArmor === armorItem.id}
              onSelect={() =>
                selectArmor(selectedArmor === armorItem.id ? null : armorItem.id)
              }
            />
          ))}

        {filterCategory === 'items' &&
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={selectedItems.includes(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
      </div>
    </div>
  )
}

// Helper: Parse gold price
function parseGold(price: string): number {
  const match = price.match(/(\d+(?:\.\d+)?)\s*(\w+)/)
  if (!match) return 0

  const amount = parseFloat(match[1])
  const unit = match[2].toLowerCase()

  if (unit === 'gp' || unit === 'gold') return amount
  if (unit === 'sp' || unit === 'silver') return amount / 10
  if (unit === 'cp' || unit === 'copper') return amount / 100

  return 0
}

// Helper: Parse bulk
function parseBulk(bulk: string): number {
  if (bulk === 'L' || bulk === 'l') return 0.1
  if (bulk === '—' || bulk === '-') return 0
  return parseFloat(bulk) || 0
}

// Weapon Card Component
function WeaponCard({
  weapon,
  selected,
  onToggle,
}: {
  weapon: Weapon
  selected: boolean
  onToggle: () => void
}) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-pf-accent' : ''
      }`}
      onClick={onToggle}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-pf-text">{weapon.name}</div>
        <div className="text-xs text-pf-text-muted">{weapon.price}</div>
      </div>
      <div className="text-xs text-pf-accent-light mb-2">
        {weapon.category} • {weapon.group}
      </div>
      <div className="text-sm text-pf-text-muted mb-2">
        {weapon.damage} {weapon.damageType}
      </div>
      <div className="text-xs text-pf-text-muted">
        Hands: {weapon.hands} • Bulk: {weapon.bulk}
      </div>
      {weapon.traits.length > 0 && (
        <div className="text-xs text-pf-accent-light mt-2">
          {weapon.traits.join(', ')}
        </div>
      )}
    </Card>
  )
}

// Armor Card Component
function ArmorCard({
  armor,
  selected,
  onSelect,
}: {
  armor: Armor
  selected: boolean
  onSelect: () => void
}) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-pf-accent' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-pf-text">{armor.name}</div>
        <div className="text-xs text-pf-text-muted">{armor.price}</div>
      </div>
      <div className="text-xs text-pf-accent-light mb-2">{armor.category}</div>
      <div className="text-sm text-pf-text-muted mb-2">
        AC Bonus: +{armor.acBonus}
        {armor.dexCap !== null && ` • Dex Cap: +${armor.dexCap}`}
      </div>
      <div className="text-xs text-pf-text-muted">
        Bulk: {armor.bulk}
        {armor.checkPenalty !== 0 && ` • Check Penalty: ${armor.checkPenalty}`}
      </div>
      {armor.traits.length > 0 && (
        <div className="text-xs text-pf-accent-light mt-2">
          {armor.traits.join(', ')}
        </div>
      )}
    </Card>
  )
}

// Item Card Component
function ItemCard({
  item,
  selected,
  onToggle,
}: {
  item: Item
  selected: boolean
  onToggle: () => void
}) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-pf-accent' : ''
      }`}
      onClick={onToggle}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-semibold text-pf-text">{item.name}</div>
        <div className="text-xs text-pf-text-muted">{item.price}</div>
      </div>
      <div className="text-sm text-pf-text-muted mb-2">{item.description}</div>
      <div className="text-xs text-pf-text-muted">Bulk: {item.bulk}</div>
      {item.traits.length > 0 && (
        <div className="text-xs text-pf-accent-light mt-2">
          {item.traits.join(', ')}
        </div>
      )}
    </Card>
  )
}
