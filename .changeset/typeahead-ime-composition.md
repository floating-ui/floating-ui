---
'@floating-ui/react': patch
---

fix(useTypeahead): ignore keydowns that arrive while an IME is composing, and match on the text an `compositionend` carries. Typing a character through an IME previously jumped the highlight to a different item and swallowed the intended one
