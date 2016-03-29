<a name="Near"></a>

## Near
**Kind**: global class  

* [Near](#Near)
    * [new Near(triger, popper, options, If)](#new_Near_new)
    * _instance_
        * [.destroy()](#Near+destroy)
        * [.update()](#Near+update)
        * [.runModifiers(data, modifiers, ends)](#Near+runModifiers)
        * [.isModifierRequired()](#Near+isModifierRequired)
    * _static_
        * [.modifiers](#Near.modifiers) : <code>object</code>
            * [.Near#modifiers.shift(data)](#Near.modifiers.Near+modifiers.shift) ⇒ <code>Object</code>
            * [.Near#modifiers.preventOverflow(data)](#Near.modifiers.Near+modifiers.preventOverflow) ⇒ <code>Object</code>
            * [.Near#modifiers.keepTogether(data)](#Near.modifiers.Near+modifiers.keepTogether) ⇒ <code>Object</code>
            * [.Near#modifiers.flip(data)](#Near.modifiers.Near+modifiers.flip) ⇒ <code>Object</code>
            * [.Near#modifiers.offset(data)](#Near.modifiers.Near+modifiers.offset) ⇒ <code>Object</code>
            * [.Near#modifiers.arrow(data)](#Near.modifiers.Near+modifiers.arrow) ⇒ <code>Object</code>

<a name="new_Near_new"></a>

### new Near(triger, popper, options, If)
Create a new Near.js instance


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| triger | <code>Element</code> |  |  |
| popper | <code>Element</code> |  |  |
| options | <code>Object</code> |  |  |
| [options.placement] | <code>String</code> | <code>bottom</code> | Placement of the popper accepted values: `top(-left, -right), right(-left, -right), bottom(-left, -right),      left(-left, -right)` |
| [options.gpuAcceleration] | <code>Boolean</code> | <code>true</code> | When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the      browser to use the GPU to accelerate the rendering.      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU. |
| [options.offset] | <code>Number</code> | <code>0</code> | Amount of pixels the popper will be shifted (can be negative). |
| [options.boundariesElement] | <code>String</code> &#124; <code>Element</code> | <code>&#x27;viewport&#x27;</code> | The element which will define the boundaries of the popper position, the popper will never be placed outside      of the defined boundaries (except if `keepTogether` is enabled) |
| [options.boundariesPadding] | <code>Number</code> | <code>5</code> | Additional padding for the boundaries |
| [options.preventOverflowOrder] | <code>Array</code> | <code>[&#x27;left&#x27;, &#x27;right&#x27;, &#x27;top&#x27;, &#x27;bottom&#x27;]</code> | Order used when Near.js tries to avoid overflows from the boundaries, they will be checked in order,      this means that the last ones will never overflow |
| [options.flipBehavior] | <code>String</code> &#124; <code>Array</code> | <code>&#x27;flip&#x27;</code> | The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to      overlap its trigger element. Defining `flip` as value, the placement will be flipped on      its axis (`right - left`, `top - bottom`).      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,      then, if even in its new placement, the popper is overlapping its trigger, it will be moved to top) |
| [options.modifiers] | <code>Array</code> | <code>[ &#x27;shift&#x27;, &#x27;offset&#x27;, &#x27;preventOverflow&#x27;, &#x27;keepTogether&#x27;, &#x27;arrow&#x27;, &#x27;flip&#x27;]</code> | List of functions used to modify the data before they are applied to the popper, add your custom functions      to this array to edit the offsets and placement.      The function should reflect the @params and @returns of preventOverflow |
| [options.modifiersIgnored] | <code>Array</code> | <code>[]</code> | Put here any built-in modifier name you want to exclude from the modifiers list      The function should reflect the @params and @returns of preventOverflow |
| If | <code>function</code> |  | the last argument of Near.js is a function, it will be executed after the initialization of the popper      it's scope will be window, the first argument will be the Near.js instance. |

<a name="Near+destroy"></a>

### near.destroy()
Destroy the popper

**Kind**: instance method of <code>[Near](#Near)</code>  
<a name="Near+update"></a>

### near.update()
Updates the position of the popper, computing the new offsets and applying the new style

**Kind**: instance method of <code>[Near](#Near)</code>  
<a name="Near+runModifiers"></a>

### near.runModifiers(data, modifiers, ends)
Loop trough the list of modifiers and run them in order, each of them will then edit the data object

**Kind**: instance method of <code>[Near](#Near)</code>  
**Access:** public  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 
| modifiers | <code>Array</code> | 
| ends | <code>function</code> | 

<a name="Near+isModifierRequired"></a>

### near.isModifierRequired()
Helper used to know if the given modifier depends from another one.

**Kind**: instance method of <code>[Near](#Near)</code>  
<a name="Near.modifiers"></a>

### Near.modifiers : <code>object</code>
Modifiers list

**Kind**: static namespace of <code>[Near](#Near)</code>  

* [.modifiers](#Near.modifiers) : <code>object</code>
    * [.Near#modifiers.shift(data)](#Near.modifiers.Near+modifiers.shift) ⇒ <code>Object</code>
    * [.Near#modifiers.preventOverflow(data)](#Near.modifiers.Near+modifiers.preventOverflow) ⇒ <code>Object</code>
    * [.Near#modifiers.keepTogether(data)](#Near.modifiers.Near+modifiers.keepTogether) ⇒ <code>Object</code>
    * [.Near#modifiers.flip(data)](#Near.modifiers.Near+modifiers.flip) ⇒ <code>Object</code>
    * [.Near#modifiers.offset(data)](#Near.modifiers.Near+modifiers.offset) ⇒ <code>Object</code>
    * [.Near#modifiers.arrow(data)](#Near.modifiers.Near+modifiers.arrow) ⇒ <code>Object</code>

<a name="Near.modifiers.Near+modifiers.shift"></a>

#### modifiers.Near#modifiers.shift(data) ⇒ <code>Object</code>
Modifier used to shift the popper on the start or end of its reference element side

**Kind**: static method of <code>[modifiers](#Near.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |

<a name="Near.modifiers.Near+modifiers.preventOverflow"></a>

#### modifiers.Near#modifiers.preventOverflow(data) ⇒ <code>Object</code>
Modifier used to make sure the popper does not overflows from it's boundaries

**Kind**: static method of <code>[modifiers](#Near.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |

<a name="Near.modifiers.Near+modifiers.keepTogether"></a>

#### modifiers.Near#modifiers.keepTogether(data) ⇒ <code>Object</code>
Modifier used to make sure the popper is always near its trigger

**Kind**: static method of <code>[modifiers](#Near.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

<a name="Near.modifiers.Near+modifiers.flip"></a>

#### modifiers.Near#modifiers.flip(data) ⇒ <code>Object</code>
Modifier used to flip the placement of the popper when the latter is starting overlapping its trigger.
Requires the `preventOverflow` modifier before it in order to work.
**NOTE:** This modifier will run all its previous modifiers everytime it tries to flip the popper!

**Kind**: static method of <code>[modifiers](#Near.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

<a name="Near.modifiers.Near+modifiers.offset"></a>

#### modifiers.Near#modifiers.offset(data) ⇒ <code>Object</code>
Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
The offsets will shift the popper on the side of its trigger element.

**Kind**: static method of <code>[modifiers](#Near.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

<a name="Near.modifiers.Near+modifiers.arrow"></a>

#### modifiers.Near#modifiers.arrow(data) ⇒ <code>Object</code>
Modifier used to move the arrows on the edge of the popper to make sure them are always between the popper and the trigger
It will use the CSS outer size of the arrow element to know how many pixels of conjuction are needed

**Kind**: static method of <code>[modifiers](#Near.modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by _update method |

