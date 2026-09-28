---
'@floating-ui/react': patch
---

Declare the function-valued members of the public React types as properties rather than
methods, so reading one without calling it (`ref={refs.setReference}`) is no longer
reported as an unbound method by type-aware linters. Covers `ExtendedRefs`,
`FloatingEvents`, `FloatingTreeType`, `FloatingContext.onOpenChange`, and
`FloatingRootContext['refs']`. Signatures are otherwise unchanged: `BivariantCallback`
keeps parameter assignability bivariant, and `FloatingEvents.emit` keeps its type
parameter.
