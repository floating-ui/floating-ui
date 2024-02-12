---
"@floating-ui/dom": patch
---

fix: calculate reference element offset relative to `offsetParent` iframe. Fixes issue with positioning in nested iframes, such as the following:

```html
<html>
  <iframe>
    <div>floating</div>
    <iframe>
      <div>reference</div>
    </iframe>
  </iframe>
</html>
```
