<a name="Popper"></a>

## Popper
**Kind**: global class  

* [Popper](#Popper)
    * [new Popper(trigger, popper, options)](#new_Popper_new)
    * _instance_
        * [.destroy()](#Popper+destroy)
        * [.update()](#Popper+update)
        * [.onCreate(callback)](#Popper+onCreate)
        * [.onUpdate(callback)](#Popper+onUpdate)
        * [.parse()](#Popper+parse)
        * [.runModifiers(data, modifiers, ends)](#Popper+runModifiers)
        * [.isModifierRequired()](#Popper+isModifierRequired)
    * _static_
        * [.modifiers](#Popper.modifiers) : <code>object</code>
            * [.Popper#modifiers.applyStyle(data)](#Popper.modifiers.Popper+modifiers.applyStyle) ⇒ <code>Object</code>
            * [.Popper#modifiers.shift(data)](#Popper.modifiers.Popper+modifiers.shift) ⇒ <code>Object</code>
            * [.Popper#modifiers.preventOverflow(data)](#Popper.modifiers.Popper+modifiers.preventOverflow) ⇒ <code>Object</code>
            * [.Popper#modifiers.keepTogether(data)](#Popper.modifiers.Popper+modifiers.keepTogether) ⇒ <code>Object</code>
            * [.Popper#modifiers.flip(data)](#Popper.modifiers.Popper+modifiers.flip) ⇒ <code>Object</code>
            * [.Popper#modifiers.offset(data)](#Popper.modifiers.Popper+modifiers.offset) ⇒ <code>Object</code>
            * [.Popper#modifiers.arrow(data)](#Popper.modifiers.Popper+modifiers.arrow) ⇒ <code>Object</code>

<a name="new_Popper_new"></a>

### new Popper(trigger, popper, options)
Create a new Popper.js instance


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| trigger | <code>HTMLElement</code> |  |  |
| popper | <code>HTMLElement</code> &#124; <code>Object</code> |  | The HTML element used as popper, or a configuration used to generate the popper. |
| [popper.tagName] | <code>String</code> | <code>&#x27;div&#x27;</code> | The tag name of the generated popper. |
| [popper.classNames] | <code>Array</code> | <code>[&#x27;popper&#x27;]</code> | Array of classes to apply to the generated popper. |
| [popper.attributes] | <code>Array</code> |  | Array of attributes to apply, specify `attr:value` to assign a value to it. |
| [popper.parent] | <code>HTMLElement</code> &#124; <code>String</code> | <code>window.document.body</code> | The parent element, given as HTMLElement or as query string. |
| [popper.content] | <code>String</code> |  | The content of the popper, it can be text or HTML, in case of HTML, enable `allowHtml`. |
| [popper.allowHtml] | <code>Boolean</code> | <code>false</code> | If set to true, the `content` will be parsed as HTML. |
| [popper.arrow.tagName] | <code>String</code> | <code>&#x27;div&#x27;</code> | Same as `popper.tagName` but for the arrow element. |
| [popper.arrow.classNames] | <code>Array</code> | <code>&#x27;popper__arrow&#x27;</code> | Same as `popper.classNames` but for the arrow element. |
| [popper.arrow.attributes] | <code>String</code> | <code>[&#x27;x-arrow&#x27;]</code> | Same as `popper.attributes` but for the arrow element. |
| options | <code>Object</code> |  |  |
| [options.placement] | <code>String</code> | <code>bottom</code> | Placement of the popper accepted values: `top(-left, -right), right(-left, -right), bottom(-left, -right),      left(-left, -right)` |
| [options.gpuAcceleration] | <code>Boolean</code> | <code>true</code> | When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the      browser to use the GPU to accelerate the rendering.      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU. |
| [options.offset] | <code>Number</code> | <code>0</code> | Amount of pixels the popper will be shifted (can be negative). |
| [options.boundariesElement] | <code>String</code> &#124; <code>Element</code> | <code>&#x27;viewport&#x27;</code> | The element which will define the boundaries of the popper position, the popper will never be placed outside      of the defined boundaries (except if `keepTogether` is enabled) |
| [options.boundariesPadding] | <code>Number</code> | <code>5</code> | Additional padding for the boundaries |
| [options.preventOverflowOrder] | <code>Array</code> | <code>[&#x27;left&#x27;, &#x27;right&#x27;, &#x27;top&#x27;, &#x27;bottom&#x27;]</code> | Order used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,      this means that the last ones will never overflow |
| [options.flipBehavior] | <code>String</code> &#124; <code>Array</code> | <code>&#x27;flip&#x27;</code> | The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to      overlap its trigger element. Defining `flip` as value, the placement will be flipped on      its axis (`right - left`, `top - bottom`).      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,      then, if even in its new placement, the popper is overlapping its trigger, it will be moved to top) |
| [options.modifiers] | <code>Array</code> | <code>[ &#x27;shift&#x27;, &#x27;offset&#x27;, &#x27;preventOverflow&#x27;, &#x27;keepTogether&#x27;, &#x27;arrow&#x27;, &#x27;flip&#x27;, &#x27;applyStyle&#x27;]</code> | List of functions used to modify the data before they are applied to the popper, add your custom functions      to this array to edit the offsets and placement.      The function should reflect the @params and @returns of preventOverflow |
| [options.modifiersIgnored] | <code>Array</code> | <code>[]</code> | Put here any built-in modifier name you want to exclude from the modifiers list      The function should reflect the @params and @returns of preventOverflow |

<a name="Popper+destroy"></a>

### popper.destroy()
Destroy the popper

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper+update"></a>

### popper.update()
Updates the position of the popper, computing the new offsets and applying the new style

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper+onCreate"></a>

### popper.onCreate(callback)
If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.

**Kind**: instance method of <code>[Popper](#Popper)</code>  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Popper+onUpdate"></a>

### popper.onUpdate(callback)
If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
used to style popper and its arrow.

**Kind**: instance method of <code>[Popper](#Popper)</code>  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="Popper+parse"></a>

### popper.parse()
Helper used to generate poppers from a configuration file

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper+runModifiers"></a>

### popper.runModifiers(data, modifiers, ends)
Loop trough the list of modifiers and run them in order, each of them will then edit the data object

**Kind**: instance method of <code>[Popper](#Popper)</code>  
**Access:** public  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 
| modifiers | <code>Array</code> | 
| ends | <code>function</code> | 

<a name="Popper+isModifierRequired"></a>

### popper.isModifierRequired()
Helper used to know if the given modifier depends from another one.

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper.modifiers"></a>

### Popper.modifiers : <code>object</code>
Modifiers list

**Kind**: static namespace of <code>[Popper](#Popper)</code>  

* [.modifiers](#Popper.modifiers) : <code>object</code>
    * [.Popper#modifiers.applyStyle(data)](#Popper.modifiers.Popper+modifiers.applyStyle) ⇒ <code>Object</code>
    * [.Popper#modifiers.shift(data)](#Popper.modifiers.Popper+modifiers.shift) ⇒ <code>Object</code>
    * [.Popper#modifiers.preventOverflow(data)](#Popper.modifiers.Popper+modifiers.preventOverflow) ⇒ <code>Object</code>
    * [.Popper#modifiers.keepTogether(data)](#Popper.modifiers.Popper+modifiers.keepTogether) ⇒ <code>Object</code>
    * [.Popper#modifiers.flip(data)](#Popper.modifiers.Popper+modifiers.flip) ⇒ <code>Object</code>
    * [.Popper#modifiers.offset(data)](#Popper.modifiers.Popper+modifiers.offset) ⇒ <code>Object</code>
    * [.Popper#modifiers.arrow(data)](#Popper.modifiers.Popper+modifiers.arrow) ⇒ <code>Object</code>

<a name="Popper.modifiers.Popper+modifiers.applyStyle"></a>

#### modifiers.Popper#modifiers.applyStyle(data) ⇒ <code>Object</code>
Apply the computed styles to the popper element

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The same data object  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |

<a name="Popper.modifiers.Popper+modifiers.shift"></a>

#### modifiers.Popper#modifiers.shift(data) ⇒ <code>Object</code>
Modifier used to shift the popper on the start or end of its reference element side

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |

<a name="Popper.modifiers.Popper+modifiers.preventOverflow"></a>

#### modifiers.Popper#modifiers.preventOverflow(data) ⇒ <code>Object</code>
Modifier used to make sure the popper does not overflows from it's boundaries

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |

<a name="Popper.modifiers.Popper+modifiers.keepTogether"></a>

#### modifiers.Popper#modifiers.keepTogether(data) ⇒ <code>Object</code>
Modifier used to make sure the popper is always near its trigger

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

<a name="Popper.modifiers.Popper+modifiers.flip"></a>

#### modifiers.Popper#modifiers.flip(data) ⇒ <code>Object</code>
Modifier used to flip the placement of the popper when the latter is starting overlapping its trigger.
Requires the `preventOverflow` modifier before it in order to work.
**NOTE:** This modifier will run all its previous modifiers everytime it tries to flip the popper!

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

<a name="Popper.modifiers.Popper+modifiers.offset"></a>

#### modifiers.Popper#modifiers.offset(data) ⇒ <code>Object</code>
Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
The offsets will shift the popper on the side of its trigger element.

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

<a name="Popper.modifiers.Popper+modifiers.arrow"></a>

#### modifiers.Popper#modifiers.arrow(data) ⇒ <code>Object</code>
Modifier used to move the arrows on the edge of the popper to make sure them are always between the popper and the trigger
It will use the CSS outer size of the arrow element to know how many pixels of conjuction are needed

**Kind**: static method of <code>[modifiers](#Popper.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

