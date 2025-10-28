# CreationWizard Updates to Wire Ability Boost Resolution

Final changes needed for `apps/web/src/components/creation/CreationWizard.tsx` to complete the ability boost selection flow.

## 1. Update useCharacterBuilder Destructuring

Update the destructuring from the hook (lines 64-72) to include the new handler:

```typescript
const {
  state: builderState,
  status,
  error,
  refresh,
  selectAncestry,
  selectBackground,
  selectClass,
  resolveAbilityBoost,  // ADD THIS LINE
} = useCharacterBuilder();
```

## 2. Pass Handler to WizardViewport

Update the WizardViewport component call (lines 157-162) to pass the new prop:

```typescript
<WizardViewport
  step={activeStep}
  builderState={builderState}
  onSelectAncestry={selectAncestry}
  onSelectBackground={selectBackground}
  onSelectClass={selectClass}
  onResolveAbilityBoost={resolveAbilityBoost}  // ADD THIS LINE
/>
```

---

**That's it!** These two small changes complete the wiring.

## Complete Flow Summary

1. **User selects ancestry/background/class** → `selectEntity` in hook
2. **Hook extracts pending choices** from entity effects → stores in `pendingChoices` state
3. **User navigates to Step 4 (Abilities)** → WizardViewport renders AbilityBoostSection
4. **AbilityBoostSection displays AbilityBoostSelector** for each pending choice
5. **User selects abilities** → clicks "Confirm Selection"
6. **AbilityBoostSelector calls onResolve** → triggers resolveAbilityBoost in hook
7. **Hook re-applies entity selection** with ChoiceResolution → removes choice from pendingChoices
8. **UI updates** → shows next choice or completion message

---

**Status**: With all three files updated (useCharacterBuilder, WizardViewport, CreationWizard), the ability boost selection workflow will be fully functional!
