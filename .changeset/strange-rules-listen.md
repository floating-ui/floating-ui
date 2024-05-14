---
"@floating-ui/react": patch
---

fix(useTransitionStatus): guard `isMounted` check and remove unneeded initiated state. Prevents an infinite loop when called in a component with an unstable callback ref.
