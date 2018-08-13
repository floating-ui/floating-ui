<a name="Tooltip"></a>

## Tooltip
**Kind**: global class  

* [Tooltip](#Tooltip)
    * [new Tooltip(reference, options)](#new_Tooltip_new)
    * _instance_
        * [.show()](#Tooltip+show)
        * [.hide()](#Tooltip+hide)
        * [.dispose()](#Tooltip+dispose)
        * [.toggle()](#Tooltip+toggle)
        * [.updateTitleContent(title)](#Tooltip+updateTitleContent)
    * _static_
        * [.TitleFunction](#Tooltip.TitleFunction) ⇒ <code>String</code>

<a name="new_Tooltip_new"></a>

### new Tooltip(reference, options)
Create a new Tooltip.js instance

**Returns**: <code>Object</code> - instance - The generated tooltip instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| reference | <code>HTMLElement</code> |  | The DOM node used as reference of the tooltip (it can be a jQuery element). |
| options | <code>Object</code> |  |  |
| options.placement | <code>String</code> | <code>&#x27;top&#x27;</code> | Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -end),      left(-start, -end)` |
| options.arrowSelector | <code>String</code> | <code>&#x27;.tooltip-arrow,</code> | .tooltip__arrow' - className used to locate the DOM arrow element in the tooltip. |
| options.innerSelector | <code>String</code> | <code>&#x27;.tooltip-inner,</code> | .tooltip__inner' - className used to locate the DOM inner element in the tooltip. |
| options.container | <code>HTMLElement</code> \| <code>String</code> \| <code>false</code> | <code>false</code> | Append the tooltip to a specific element. |
| options.delay | <code>Number</code> \| <code>Object</code> | <code>0</code> | Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type.      If a number is supplied, delay is applied to both hide/show.      Object structure is: `{ show: 500, hide: 100 }` |
| options.html | <code>Boolean</code> | <code>false</code> | Insert HTML into the tooltip. If false, the content will inserted with `textContent`. |
| [options.template] | <code>String</code> | <code>&#x27;&lt;div class=&quot;tooltip&quot; role=&quot;tooltip&quot;&gt;&lt;div class=&quot;tooltip-arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;&#x27;</code> | Base HTML to used when creating the tooltip.      The tooltip's `title` will be injected into the `.tooltip-inner` or `.tooltip__inner`.      `.tooltip-arrow` or `.tooltip__arrow` will become the tooltip's arrow.      The outermost wrapper element should have the `.tooltip` class. |
| options.title | <code>String</code> \| <code>HTMLElement</code> \| <code>TitleFunction</code> | <code>&#x27;&#x27;</code> | Default title value if `title` attribute isn't present. |
| [options.trigger] | <code>String</code> | <code>&#x27;hover focus&#x27;</code> | How tooltip is triggered - click, hover, focus, manual.      You may pass multiple triggers; separate them with a space. `manual` cannot be combined with any other trigger. |
| options.closeOnClickOutside | <code>Boolean</code> | <code>false</code> | Close a popper on click outside of the popper and reference element. This has effect only when options.trigger is 'click'. |
| options.boundariesElement | <code>String</code> \| <code>HTMLElement</code> |  | The element used as boundaries for the tooltip. For more information refer to Popper.js'      [boundariesElement docs](https://popper.js.org/popper-documentation.html) |
| options.offset | <code>Number</code> \| <code>String</code> | <code>0</code> | Offset of the tooltip relative to its reference. For more information refer to Popper.js'      [offset docs](https://popper.js.org/popper-documentation.html) |
| options.popperOptions | <code>Object</code> | <code>{}</code> | Popper options, will be passed directly to popper instance. For more information refer to Popper.js'      [options docs](https://popper.js.org/popper-documentation.html) |

<a name="Tooltip+show"></a>

### tooltip.show()
Reveals an element's tooltip. This is considered a "manual" triggering of the tooltip.
Tooltips with zero-length titles are never displayed.

**Kind**: instance method of [<code>Tooltip</code>](#Tooltip)  
<a name="Tooltip+hide"></a>

### tooltip.hide()
Hides an element’s tooltip. This is considered a “manual” triggering of the tooltip.

**Kind**: instance method of [<code>Tooltip</code>](#Tooltip)  
<a name="Tooltip+dispose"></a>

### tooltip.dispose()
Hides and destroys an element’s tooltip.

**Kind**: instance method of [<code>Tooltip</code>](#Tooltip)  
<a name="Tooltip+toggle"></a>

### tooltip.toggle()
Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.

**Kind**: instance method of [<code>Tooltip</code>](#Tooltip)  
<a name="Tooltip+updateTitleContent"></a>

### tooltip.updateTitleContent(title)
Updates the tooltip's title content

**Kind**: instance method of [<code>Tooltip</code>](#Tooltip)  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> \| <code>HTMLElement</code> | The new content to use for the title |

<a name="Tooltip.TitleFunction"></a>

### Tooltip.TitleFunction ⇒ <code>String</code>
Title function, its context is the Tooltip instance.

**Kind**: static typedef of [<code>Tooltip</code>](#Tooltip)  
**Returns**: <code>String</code> - placement - The desired title.  
