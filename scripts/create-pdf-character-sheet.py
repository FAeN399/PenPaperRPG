#!/usr/bin/env python3
"""
Professional Pathfinder 2e Character Sheet - PDF Generator
Uses reportlab Platypus for professional multi-page layout
"""

import sys
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Frame, PageTemplate
)

# Theme colors
GOLD = colors.HexColor("#DAA520")
DARK_BG = colors.HexColor("#2D2D2D")
LIGHT_BG = colors.HexColor("#F0F0F0")
VERY_LIGHT_BG = colors.HexColor("#FAFAFA")

def get_name(entity_id):
    """Extract readable name from entity ID"""
    if not entity_id:
        return "—"
    return entity_id.split(".")[-1].replace("-", " ").title()

def create_styles():
    """Create custom paragraph styles"""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name='CharTitle',
        parent=styles['Title'],
        fontSize=28,
        textColor=GOLD,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=GOLD,
        spaceBefore=15,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='SubHeader',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=GOLD,
        spaceBefore=10,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='Body',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6
    ))

    styles.add(ParagraphStyle(
        name='BodyJustify',
        parent=styles['Normal'],
        fontSize=10,
        alignment=TA_JUSTIFY,
        spaceAfter=10
    ))

    return styles

def create_character_pdf(json_path, output_path):
    """Generate professional PDF character sheet"""

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    char = data['character']
    meta = char.get('metadata', {})
    identity = char.get('identity', {})
    abilities = char.get('abilityScores', {}).get('final', {})
    prof = char.get('proficiencies', {})
    derived = char.get('derived', {})

    # Create PDF
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )

    styles = create_styles()
    story = []

    # ========== CHARACTER TITLE ==========
    story.append(Paragraph(meta.get('name', 'Character'), styles['CharTitle']))
    story.append(Spacer(1, 0.2*inch))

    # ========== CHARACTER IDENTITY ==========
    identity_data = [
        ['Level', str(identity.get('level', 1))],
        ['Player', meta.get('player', '—')],
        ['Campaign', meta.get('campaign', '—')],
        ['', ''],  # Spacer row
        ['Ancestry', get_name(identity.get('ancestryId'))],
        ['Heritage', get_name(identity.get('heritageId'))],
        ['Background', get_name(identity.get('backgroundId'))],
        ['Class', get_name(identity.get('classId'))],
        ['Deity', get_name(identity.get('deityId'))],
        ['Alignment', identity.get('alignment', '—')],
    ]

    identity_table = Table(identity_data, colWidths=[2*inch, 4*inch])
    identity_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, 2), 0.5, colors.grey),
        ('GRID', (0, 4), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(identity_table)
    story.append(Spacer(1, 0.3*inch))

    # ========== ABILITY SCORES ==========
    story.append(Paragraph("ABILITY SCORES", styles['SectionHeader']))

    ability_list = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    ability_headers = ability_list
    ability_scores = [str(abilities.get(ab, 10)) for ab in ability_list]
    ability_mods = [f"+{(abilities.get(ab, 10) - 10) // 2}" if (abilities.get(ab, 10) - 10) // 2 >= 0
                   else str((abilities.get(ab, 10) - 10) // 2) for ab in ability_list]

    ability_data = [ability_headers, ability_scores, ability_mods]
    ability_table = Table(ability_data, colWidths=[1.1*inch]*6)
    ability_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, 1), VERY_LIGHT_BG),
        ('FONTNAME', (0, 1), (-1, 1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, 1), 16),
        ('FONTSIZE', (0, 2), (-1, 2), 13),
        ('FONTNAME', (0, 2), (-1, 2), 'Helvetica'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(ability_table)
    story.append(Spacer(1, 0.3*inch))

    # ========== CORE STATISTICS ==========
    story.append(Paragraph("CORE STATISTICS", styles['SectionHeader']))

    hp = derived.get('hitPoints', {})
    ac = derived.get('armorClass', 10)
    class_dc = derived.get('classDC', 10)
    perc = derived.get('perception', {})
    speeds = derived.get('speeds', {})

    perc_mod = perc.get('modifier', 0) if isinstance(perc, dict) else 0
    perc_rank = perc.get('rank', 'untrained') if isinstance(perc, dict) else 'untrained'

    core_data = [
        ['Hit Points', f"{hp.get('current', 0)} / {hp.get('max', 0)}"],
        ['Armor Class', str(ac)],
        ['Class DC', str(class_dc)],
        ['Perception', f"{'+' if perc_mod >= 0 else ''}{perc_mod} ({perc_rank})"],
        ['Speed', ', '.join([f"{k.title()}: {v} ft" for k, v in speeds.items()]) if speeds else '25 ft'],
    ]

    core_table = Table(core_data, colWidths=[2*inch, 4*inch])
    core_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('TEXTCOLOR', (1, 0), (1, -1), GOLD),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (1, 0), (1, -1), 13),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(core_table)
    story.append(PageBreak())

    # ========== SAVES & SKILLS ==========
    story.append(Paragraph("SAVING THROWS", styles['SectionHeader']))

    saves_obj = derived.get('saves', {})
    saves_data = []
    for save_name in ['fortitude', 'reflex', 'will']:
        save_val = saves_obj.get(save_name, {})
        mod = save_val.get('value', 0) if isinstance(save_val, dict) else 0
        rank = prof.get('saves', {}).get(save_name, 'untrained')
        saves_data.append([
            save_name.title(),
            f"{'+' if mod >= 0 else ''}{mod}",
            rank.title()
        ])

    saves_table = Table(saves_data, colWidths=[2*inch, 2*inch, 2*inch])
    saves_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1, 0), (1, -1), GOLD),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('FONTSIZE', (1, 0), (1, -1), 13),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))

    story.append(saves_table)
    story.append(Spacer(1, 0.3*inch))

    # ========== SKILLS ==========
    story.append(Paragraph("SKILLS", styles['SectionHeader']))

    skills_derived = derived.get('skills', {})
    skills_prof = prof.get('skills', {})

    skill_ability_map = {
        'Acrobatics': 'DEX', 'Arcana': 'INT', 'Athletics': 'STR',
        'Crafting': 'INT', 'Deception': 'CHA', 'Diplomacy': 'CHA',
        'Intimidation': 'CHA', 'Medicine': 'WIS', 'Nature': 'WIS',
        'Occultism': 'INT', 'Performance': 'CHA', 'Religion': 'WIS',
        'Society': 'INT', 'Stealth': 'DEX', 'Survival': 'WIS',
        'Thievery': 'DEX'
    }

    skills_data = []
    for skill_name in sorted(skills_prof.keys()):
        skill_info = skills_derived.get(skill_name, {})
        mod = skill_info.get('modifier', 0) if isinstance(skill_info, dict) else 0
        rank = skill_info.get('rank', skills_prof.get(skill_name, 'untrained')) if isinstance(skill_info, dict) else skills_prof.get(skill_name, 'untrained')
        ability = skill_ability_map.get(skill_name, 'INT')

        skills_data.append([
            skill_name,
            ability,
            f"{'+' if mod >= 0 else ''}{mod}",
            rank.title()
        ])

    if skills_data:
        skills_table = Table(skills_data, colWidths=[2*inch, 0.75*inch, 1.25*inch, 2*inch])
        skills_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (2, 0), (2, -1), 'Helvetica-Bold'),
            ('TEXTCOLOR', (2, 0), (2, -1), GOLD),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('FONTSIZE', (2, 0), (2, -1), 11),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(skills_table)
    else:
        story.append(Paragraph("<i>No trained skills</i>", styles['Body']))

    story.append(Spacer(1, 0.2*inch))

    # ========== LANGUAGES & SENSES ==========
    langs = char.get('languages', [])
    if langs:
        story.append(Paragraph("Languages", styles['SubHeader']))
        story.append(Paragraph(", ".join(langs), styles['Body']))
        story.append(Spacer(1, 0.1*inch))

    senses = char.get('senses', [])
    if senses:
        story.append(Paragraph("Senses", styles['SubHeader']))
        story.append(Paragraph(", ".join(senses), styles['Body']))

    story.append(PageBreak())

    # ========== FEATS ==========
    story.append(Paragraph("FEATS & FEATURES", styles['SectionHeader']))

    feats = char.get('feats', [])
    if feats:
        feats_data = []
        for feat in sorted(feats, key=lambda f: f.get('level', 1)):
            feat_name = get_name(feat.get('id', ''))
            level = str(feat.get('level', 1))
            granted = feat.get('grantedBy', '').title()
            feats_data.append([feat_name, level, granted])

        feats_table = Table(feats_data, colWidths=[3*inch, 1*inch, 2*inch])
        feats_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), LIGHT_BG),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (2, 0), (2, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(feats_table)
    else:
        story.append(Paragraph("<i>No feats selected</i>", styles['Body']))

    story.append(Spacer(1, 0.3*inch))

    # ========== EQUIPMENT ==========
    story.append(Paragraph("EQUIPMENT", styles['SectionHeader']))

    equipment = char.get('equipment', [])
    if equipment:
        equip_data = []
        for item in equipment:
            name = item.get('name', 'Unknown')
            qty = str(item.get('quantity', 1))
            bulk = str(item.get('bulk', '—'))
            notes = item.get('notes', '')
            equip_data.append([name, qty, bulk, notes])

        equip_table = Table(equip_data, colWidths=[2.5*inch, 0.75*inch, 0.75*inch, 2.5*inch])
        equip_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('ALIGN', (1, 0), (2, -1), 'CENTER'),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (3, 0), (3, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(equip_table)
    else:
        story.append(Paragraph("<i>No equipment</i>", styles['Body']))

    story.append(PageBreak())

    # ========== COMBAT ==========
    story.append(Paragraph("COMBAT", styles['SectionHeader']))

    attacks = derived.get('attacks', [])
    if attacks:
        story.append(Paragraph("Attack Profiles", styles['SubHeader']))
        attack_data = []
        for attack in attacks:
            label = attack.get('label', '—')
            bonus = attack.get('attackBonus', 0)
            damage = attack.get('damage', '—')
            traits = ", ".join(attack.get('traits', []))
            attack_data.append([
                label,
                f"+{bonus}" if bonus >= 0 else str(bonus),
                damage,
                traits
            ])

        attack_table = Table(attack_data, colWidths=[2*inch, 1*inch, 1.5*inch, 2*inch])
        attack_table.setStyle(TableStyle([
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(attack_table)
        story.append(Spacer(1, 0.2*inch))

    # Resistances, Weaknesses, Immunities
    res = derived.get('resistances', [])
    weak = derived.get('weaknesses', [])
    imm = derived.get('immunities', [])

    if res:
        story.append(Paragraph("Resistances", styles['SubHeader']))
        for r in res:
            story.append(Paragraph(f"{r.get('type', '')} {r.get('value', 0)} - {r.get('notes', '')}", styles['Body']))
        story.append(Spacer(1, 0.1*inch))

    if weak:
        story.append(Paragraph("Weaknesses", styles['SubHeader']))
        for w in weak:
            story.append(Paragraph(f"{w.get('type', '')} {w.get('value', 0)}", styles['Body']))
        story.append(Spacer(1, 0.1*inch))

    if imm:
        story.append(Paragraph("Immunities", styles['SubHeader']))
        story.append(Paragraph(", ".join(imm), styles['Body']))

    # ========== CHARACTER DETAILS ==========
    notes = char.get('notes', {})
    if any(notes.values()):
        story.append(PageBreak())
        story.append(Paragraph("CHARACTER DETAILS", styles['SectionHeader']))

        if notes.get('appearance'):
            story.append(Paragraph("Appearance", styles['SubHeader']))
            story.append(Paragraph(notes['appearance'], styles['BodyJustify']))
            story.append(Spacer(1, 0.15*inch))

        if notes.get('backstory'):
            story.append(Paragraph("Backstory", styles['SubHeader']))
            story.append(Paragraph(notes['backstory'], styles['BodyJustify']))
            story.append(Spacer(1, 0.15*inch))

        if notes.get('allies'):
            story.append(Paragraph("Allies & Organizations", styles['SubHeader']))
            story.append(Paragraph(notes['allies'], styles['BodyJustify']))
            story.append(Spacer(1, 0.15*inch))

        if notes.get('campaigns'):
            story.append(Paragraph("Campaign Notes", styles['SubHeader']))
            story.append(Paragraph(notes['campaigns'], styles['BodyJustify']))

    # Build PDF
    doc.build(story)
    print(f"Professional PDF character sheet created: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create-pdf-character-sheet.py <character.json> <output.pdf>")
        sys.exit(1)

    create_character_pdf(sys.argv[1], sys.argv[2])
