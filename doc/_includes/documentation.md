## Classes

<dl>
<dt><a href="#Popper">Popper</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#dataObject">dataObject</a></dt>
<dd><p>The <code>dataObject</code> is an object containing all the informations used by Popper.js
this object get passed to modifiers and to the <code>onCreate</code> and <code>onUpdate</code> callbacks.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#Modifiers">Modifiers</a> ⇒ <code>Object</code></dt>
<dd><p>Modifiers are plugins used to alter the behavior of your poppers.
Popper.js uses a set of 7 modifiers to provide all the basic functionalities
needed by the library.</p>
<p>Each modifier is an object containing several properties listed below.</p>
</dd>
</dl>

<a name="Popper"></a>

## Popper
**Kind**: global class  

* [Popper](#Popper)
    * [new Popper(reference, popper, options)](#new_Popper_new)
    * _instance_
        * [.update(isFirstCall)](#Popper+update)
        * [.onCreate(callback)](#Popper+onCreate)
        * [.onUpdate(callback)](#Popper+onUpdate)
        * [.destroy()](#Popper+destroy)
    * _static_
        * [.Utils](#Popper.Utils) : <code>object</code>
            * [.findIndex(arr, prop, value)](#Popper.Utils.findIndex) ⇒
            * [.getOffsetParent(element)](#Popper.Utils.getOffsetParent) ⇒ <code>Element</code>
            * [.getStyleComputedProperty(element, property)](#Popper.Utils.getStyleComputedProperty)
            * [.getScrollParent(element)](#Popper.Utils.getScrollParent) ⇒ <code>Element</code>
            * [.getOffsetRect(element)](#Popper.Utils.getOffsetRect) ⇒ <code>Object</code>
            * [.getBoundaries(data, padding, boundariesElement)](#Popper.Utils.getBoundaries) ⇒ <code>Object</code>
            * [.getBoundingClientRect(element)](#Popper.Utils.getBoundingClientRect) ⇒ <code>Object</code>
            * [.getOffsetRectRelativeToCustomParent(element, parent)](#Popper.Utils.getOffsetRectRelativeToCustomParent) ⇒ <code>Object</code>
            * [.getOuterSizes(element)](#Popper.Utils.getOuterSizes) ⇒ <code>Object</code>
            * [.getPopperClientRect(popperOffsets)](#Popper.Utils.getPopperClientRect) ⇒ <code>Object</code>
            * [.isFixed(element, customContainer)](#Popper.Utils.isFixed) ⇒ <code>Boolean</code>
            * [.getPosition(config)](#Popper.Utils.getPosition) ⇒ <code>HTMLElement</code>
            * [.getSupportedPropertyName(property)](#Popper.Utils.getSupportedPropertyName) ⇒ <code>String</code>
            * [.isFunction(element)](#Popper.Utils.isFunction) ⇒ <code>Boolean</code>
            * [.isModifierRequired()](#Popper.Utils.isModifierRequired) ⇒ <code>Boolean</code>
            * [.isNumeric(input)](#Popper.Utils.isNumeric) ⇒ <code>Boolean</code>
            * [.isTransformed(element)](#Popper.Utils.isTransformed) ⇒ <code>Boolean</code>
            * [.runModifiers(data, modifiers, ends)](#Popper.Utils.runModifiers)
            * [.setStyle(element, styles)](#Popper.Utils.setStyle)
            * [.getOffsets(popper, reference)](#Popper.Utils.getOffsets) ⇒ <code>Object</code>
            * [.sortModifiers()](#Popper.Utils.sortModifiers)
            * [.getOppositePlacement(placement)](#Popper.Utils.getOppositePlacement) ⇒ <code>String</code>

<a name="new_Popper_new"></a>

### new Popper(reference, popper, options)
Create a new Popper.js instance

**Returns**: <code>Object</code> - instance - The generated Popper.js instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| reference | <code>HTMLElement</code> |  | The reference element used to position the popper |
| popper | <code>HTMLElement</code> |  | The HTML element used as popper. |
| options | <code>Object</code> |  |  |
| options.placement | <code>String</code> | <code>bottom</code> | Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -right),      left(-start, -end)` |
| options.gpuAcceleration | <code>Boolean</code> | <code>true</code> | When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the      browser to use the GPU to accelerate the rendering.      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU. |
| options.boundariesElement | <code>String</code> &#124; <code>Element</code> | <code>&#x27;viewport&#x27;</code> | The element which will define the boundaries of the popper position, the popper will never be placed outside      of the defined boundaries (except if `keepTogether` is enabled) |
| options.boundariesPadding | <code>Number</code> | <code>5</code> | Additional padding for the boundaries |
| options.removeOnDestroy | <code>Boolean</code> | <code>false</code> | Set to true if you want to automatically remove the popper when you call the `destroy` method. |
| options.modifiers | <code>Object</code> |  | List of functions used to modify the data before they are applied to the popper (see source code for default values) |
| options.modifiers.arrow | <code>Object</code> |  | Arrow modifier configuration |
| options.modifiers.arrow.element | <code>HTMLElement</code> &#124; <code>String</code> | <code>&#x27;[x-arrow]&#x27;</code> | The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its      reference element.      By default, it will look for a child node of the popper with the `x-arrow` attribute. |
| options.modifiers.offset | <code>Object</code> |  | Offset modifier configuration |
| options.modifiers.offset.offset | <code>Number</code> | <code>0</code> | Amount of pixels the popper will be shifted (can be negative). |
| options.modifiers.preventOverflow | <code>Object</code> |  | PreventOverflow modifier configuration |
| [options.modifiers.preventOverflow.priority] | <code>Array</code> | <code>[&#x27;left&#x27;, &#x27;right&#x27;, &#x27;top&#x27;, &#x27;bottom&#x27;]</code> | Priority used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,      this means that the last one will never overflow |
| options.modifiers.flip | <code>Object</code> |  | Flip modifier configuration |
| options.modifiers.flip.behavior | <code>String</code> &#124; <code>Array</code> | <code>&#x27;flip&#x27;</code> | The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to      overlap its reference element. Defining `flip` as value, the placement will be flipped on      its axis (`right - left`, `top - bottom`).      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top) |

<a name="Popper+update"></a>

### popper.update(isFirstCall)
Updates the position of the popper, computing the new offsets and applying the new style

**Kind**: instance method of <code>[Popper](#Popper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| isFirstCall | <code>Boolean</code> | When true, the onCreate callback is called, otherwise it calls the onUpdate callback |

<a name="Popper+onCreate"></a>

### popper.onCreate(callback)
If a function is passed, it will be executed after the initialization of popper with as first argument the Popper instance.

**Kind**: instance method of <code>[Popper](#Popper)</code>  

| Param | Type |
| --- | --- |
| callback | <code>[createCallback](#createCallback)</code> | 

<a name="Popper+onUpdate"></a>

### popper.onUpdate(callback)
If a function is passed, it will be executed after each update of popper with as first argument the set of coordinates and informations
used to style popper and its arrow.
NOTE: it doesn't get fired on the first call of the `Popper.update()` method inside the `Popper` constructor!

**Kind**: instance method of <code>[Popper](#Popper)</code>  

| Param | Type |
| --- | --- |
| callback | <code>[updateCallback](#updateCallback)</code> | 

<a name="Popper+destroy"></a>

### popper.destroy()
Destroy the popper

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper.Utils"></a>

### Popper.Utils : <code>object</code>
**Kind**: static namespace of <code>[Popper](#Popper)</code>  

* [.Utils](#Popper.Utils) : <code>object</code>
    * [.findIndex(arr, prop, value)](#Popper.Utils.findIndex) ⇒
    * [.getOffsetParent(element)](#Popper.Utils.getOffsetParent) ⇒ <code>Element</code>
    * [.getStyleComputedProperty(element, property)](#Popper.Utils.getStyleComputedProperty)
    * [.getScrollParent(element)](#Popper.Utils.getScrollParent) ⇒ <code>Element</code>
    * [.getOffsetRect(element)](#Popper.Utils.getOffsetRect) ⇒ <code>Object</code>
    * [.getBoundaries(data, padding, boundariesElement)](#Popper.Utils.getBoundaries) ⇒ <code>Object</code>
    * [.getBoundingClientRect(element)](#Popper.Utils.getBoundingClientRect) ⇒ <code>Object</code>
    * [.getOffsetRectRelativeToCustomParent(element, parent)](#Popper.Utils.getOffsetRectRelativeToCustomParent) ⇒ <code>Object</code>
    * [.getOuterSizes(element)](#Popper.Utils.getOuterSizes) ⇒ <code>Object</code>
    * [.getPopperClientRect(popperOffsets)](#Popper.Utils.getPopperClientRect) ⇒ <code>Object</code>
    * [.isFixed(element, customContainer)](#Popper.Utils.isFixed) ⇒ <code>Boolean</code>
    * [.getPosition(config)](#Popper.Utils.getPosition) ⇒ <code>HTMLElement</code>
    * [.getSupportedPropertyName(property)](#Popper.Utils.getSupportedPropertyName) ⇒ <code>String</code>
    * [.isFunction(element)](#Popper.Utils.isFunction) ⇒ <code>Boolean</code>
    * [.isModifierRequired()](#Popper.Utils.isModifierRequired) ⇒ <code>Boolean</code>
    * [.isNumeric(input)](#Popper.Utils.isNumeric) ⇒ <code>Boolean</code>
    * [.isTransformed(element)](#Popper.Utils.isTransformed) ⇒ <code>Boolean</code>
    * [.runModifiers(data, modifiers, ends)](#Popper.Utils.runModifiers)
    * [.setStyle(element, styles)](#Popper.Utils.setStyle)
    * [.getOffsets(popper, reference)](#Popper.Utils.getOffsets) ⇒ <code>Object</code>
    * [.sortModifiers()](#Popper.Utils.sortModifiers)
    * [.getOppositePlacement(placement)](#Popper.Utils.getOppositePlacement) ⇒ <code>String</code>

<a name="Popper.Utils.findIndex"></a>

#### Utils.findIndex(arr, prop, value) ⇒
Return the index of the matching object

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: index or -1  

| Param | Type |
| --- | --- |
| arr | <code>Array</code> | 
| prop |  | 
| value |  | 

<a name="Popper.Utils.getOffsetParent"></a>

#### Utils.getOffsetParent(element) ⇒ <code>Element</code>
Returns the offset parent of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - offset parent  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getStyleComputedProperty"></a>

#### Utils.getStyleComputedProperty(element, property)
Get CSS computed property of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type |
| --- | --- |
| element | <code>Eement</code> | 
| property | <code>String</code> | 

<a name="Popper.Utils.getScrollParent"></a>

#### Utils.getScrollParent(element) ⇒ <code>Element</code>
Returns the scrolling parent of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - offset parent  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getOffsetRect"></a>

#### Utils.getOffsetRect(element) ⇒ <code>Object</code>
Get the position of the given element, relative to its offset parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - position - Coordinates of the element and its `scrollTop`  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getBoundaries"></a>

#### Utils.getBoundaries(data, padding, boundariesElement) ⇒ <code>Object</code>
Computed the boundaries limits and return them

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - Coordinates of the boundaries  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Object containing the property "offsets" generated by `_getOffsets` |
| padding | <code>Number</code> | Boundaries padding |
| boundariesElement | <code>Element</code> | Element used to define the boundaries |

<a name="Popper.Utils.getBoundingClientRect"></a>

#### Utils.getBoundingClientRect(element) ⇒ <code>Object</code>
Get bounding client rect of given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - client rect  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Popper.Utils.getOffsetRectRelativeToCustomParent"></a>

#### Utils.getOffsetRectRelativeToCustomParent(element, parent) ⇒ <code>Object</code>
Given an element and one of its parents, return the offset

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - rect  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 
| parent | <code>HTMLElement</code> | 

<a name="Popper.Utils.getOuterSizes"></a>

#### Utils.getOuterSizes(element) ⇒ <code>Object</code>
Get the outer sizes of the given element (offset size + margins)

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - object containing width and height properties  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getPopperClientRect"></a>

#### Utils.getPopperClientRect(popperOffsets) ⇒ <code>Object</code>
Given the popper offsets, generate an output similar to getBoundingClientRect

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - ClientRect like output  

| Param | Type |
| --- | --- |
| popperOffsets | <code>Object</code> | 

<a name="Popper.Utils.isFixed"></a>

#### Utils.isFixed(element, customContainer) ⇒ <code>Boolean</code>
Check if the given element is fixed or is inside a fixed parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to "isFixed?"  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| customContainer | <code>Element</code> | 

<a name="Popper.Utils.getPosition"></a>

#### Utils.getPosition(config) ⇒ <code>HTMLElement</code>
Helper used to get the position which will be applied to the popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>HTMLElement</code> - reference element  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>HTMLElement</code> | popper element |

<a name="Popper.Utils.getSupportedPropertyName"></a>

#### Utils.getSupportedPropertyName(property) ⇒ <code>String</code>
Get the prefixed supported property name

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - prefixed property (camelCase)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>String</code> | (camelCase) |

<a name="Popper.Utils.isFunction"></a>

#### Utils.isFunction(element) ⇒ <code>Boolean</code>
Check if the given variable is a function

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to: is a function?  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to check |

<a name="Popper.Utils.isModifierRequired"></a>

#### Utils.isModifierRequired() ⇒ <code>Boolean</code>
Helper used to know if the given modifier depends from another one.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
<a name="Popper.Utils.isNumeric"></a>

#### Utils.isNumeric(input) ⇒ <code>Boolean</code>
Tells if a given input is a number

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>\*</code> | to check |

<a name="Popper.Utils.isTransformed"></a>

#### Utils.isTransformed(element) ⇒ <code>Boolean</code>
Check if the given element has transforms applied to itself or a parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to "isTransformed?"  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.runModifiers"></a>

#### Utils.runModifiers(data, modifiers, ends)
Loop trough the list of modifiers and run them in order, each of them will then edit the data object

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 
| modifiers | <code>Array</code> | 
| ends | <code>function</code> | 

<a name="Popper.Utils.setStyle"></a>

#### Utils.setStyle(element, styles)
Set the style to the given popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to apply the style to |
| styles | <code>Object</code> | Object with a list of properties and values which will be applied to the element |

<a name="Popper.Utils.getOffsets"></a>

#### Utils.getOffsets(popper, reference) ⇒ <code>Object</code>
Get offsets to the popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - An object containing the offsets which will be applied to the popper  

| Param | Type | Description |
| --- | --- | --- |
| popper | <code>Element</code> | the popper element |
| reference | <code>Element</code> | the reference element (the popper will be relative to this) |

<a name="Popper.Utils.sortModifiers"></a>

#### Utils.sortModifiers()
Sorts the modifiers based on their `order` property

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
<a name="Popper.Utils.getOppositePlacement"></a>

#### Utils.getOppositePlacement(placement) ⇒ <code>String</code>
Get the opposite placement of the given one/

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - flipped placement  

| Param | Type |
| --- | --- |
| placement | <code>String</code> | 

<a name="dataObject"></a>

## dataObject
The `dataObject` is an object containing all the informations used by Popper.js
this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.

**Kind**: global variable  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data.instance | <code>Object</code> | The Popper.js instance |
| data.placement | <code>String</code> | Placement applied to popper |
| data.originalPlacement | <code>String</code> | Placement originally defined on init |
| data.flipped | <code>Boolean</code> | True if popper has been flipped by flip modifier |
| data.arrowElement | <code>HTMLElement</code> | Node used as arrow by arrow modifier |
| data.styles | <code>Object</code> | Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`) |
| data.boundaries | <code>Object</code> | Offsets of the popper boundaries |
| data.offsets | <code>Object</code> | The measurements of popper, reference and arrow elements. |
| data.offsets.popper | <code>Object</code> | `top`, `left`, `width`, `height` values |
| data.offsets.reference | <code>Object</code> | `top`, `left`, `width`, `height` values |
| data.offsets.arro | <code>Object</code> | `top` and `left` offsets, only one of them will be different from 0 |

<a name="Modifiers"></a>

## Modifiers ⇒ <code>Object</code>
Modifiers are plugins used to alter the behavior of your poppers.
Popper.js uses a set of 7 modifiers to provide all the basic functionalities
needed by the library.

Each modifier is an object containing several properties listed below.

**Kind**: global namespace  
**Returns**: <code>Object</code> - data - Each modifier must return the modified `data` object.  

| Param | Type | Description |
| --- | --- | --- |
| modifier | <code>Object</code> | Modifier descriptor |
| modifier.order | <code>Integer</code> | The `order` property defines the execution order of the modifiers.      The built-in modifiers have orders with a gap of 100 units in between,      this allows you to inject additional modifiers between the existing ones      without having to redefine the order of all of them.      The modifiers are executed starting from the one with the lowest order. |
| modifier.enabled | <code>Boolean</code> | When `true`, the modifier will be used. |
| modifier.function | <code>[modifier](#Modifiers..modifier)</code> | Modifier function. |
| modifier.onLoad | <code>Modifiers~onLoad</code> | Function executed on popper initalization |


* [Modifiers](#Modifiers) ⇒ <code>Object</code>
    * _static_
        * [.applyStyle(data, options)](#Modifiers.applyStyle) ⇒ <code>Object</code>
        * [.arrow(data, options)](#Modifiers.arrow) ⇒ <code>Object</code>
        * [.flip(data, options)](#Modifiers.flip) ⇒ <code>Object</code>
        * [.keepTogether(data, options)](#Modifiers.keepTogether) ⇒ <code>Object</code>
        * [.offset(data, options)](#Modifiers.offset) ⇒ <code>Object</code>
        * [.preventOverflow(data, options)](#Modifiers.preventOverflow) ⇒ <code>Object</code>
        * [.shift(data, options)](#Modifiers.shift) ⇒ <code>Object</code>
    * _inner_
        * [~modifier](#Modifiers..modifier) ⇒ <code>[dataObject](#dataObject)</code>

<a name="Modifiers.applyStyle"></a>

### Modifiers.applyStyle(data, options) ⇒ <code>Object</code>
Apply the computed styles to the popper element

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The same data object  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.arrow"></a>

### Modifiers.arrow(data, options) ⇒ <code>Object</code>
Modifier used to move the arrows on the edge of the popper to make sure them are always between the popper and the reference element
It will use the CSS outer size of the arrow element to know how many pixels of conjuction are needed

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.flip"></a>

### Modifiers.flip(data, options) ⇒ <code>Object</code>
Modifier used to flip the placement of the popper when the latter is starting overlapping its reference element.
Requires the `preventOverflow` modifier before it in order to work.
**NOTE:** data.instance modifier will run all its previous modifiers everytime it tries to flip the popper!

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.keepTogether"></a>

### Modifiers.keepTogether(data, options) ⇒ <code>Object</code>
Modifier used to make sure the popper is always near its reference

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.offset"></a>

### Modifiers.offset(data, options) ⇒ <code>Object</code>
Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
The offsets will shift the popper on the side of its reference element.

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.preventOverflow"></a>

### Modifiers.preventOverflow(data, options) ⇒ <code>Object</code>
Modifier used to make sure the popper does not overflows from it's boundaries

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.shift"></a>

### Modifiers.shift(data, options) ⇒ <code>Object</code>
Modifier used to shift the popper on the start or end of its reference element side

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers..modifier"></a>

### Modifiers~modifier ⇒ <code>[dataObject](#dataObject)</code>
Modifiers can edit the `data` object to change the beheavior of the popper.
This object contains all the informations used by Popper.js to compute the
popper position.
The modifier can edit the data as needed, and then `return` it as result.

**Kind**: inner typedef of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>[dataObject](#dataObject)</code> - modified data  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

<a name="createCallback"></a>

## .createCallback : <code>function</code>
Callback called when the popper is created.
Access Popper.js instance with `data.instance`.

**Kind**: static typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

<a name="updateCallback"></a>

## .updateCallback : <code>function</code>
Callback called when the popper is updated, this callback is not called
on the initialization/creation of the popper, but only on subsequent
updates.
Access Popper.js instance with `data.instance`.

**Kind**: static typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

