---
title: Basic Vector Math
author: Perry
steamId: '76561198046986723'
date: 01.10.2020
---

While creating games it is hard to avoid using vector math, however they are not commonly taught in schools. While they are fairly intuitive once you get used to them, learning about vector math for the first time can be a bit difficult, therefore this tutorial.

## Introduction to vectors

### What is a vector

Vectors are a way to describe a point or direction in space. This space can have any number of dimensions, but for this tutorial we will focus on 2D just because it is easier to draw. All of these concepts also apply to higher dimension vectors though!

Usually a vector will be represented as `(x, y)`, which you can either interpret as:
> Point with coordinates (x, y)

or
> Movement from (0, 0) to point (x, y)

:::note
When using vectors as a movement they only describe a movement TO somewhere, originating from the origin (0, 0). If you want to describe a movement that also has a FROM part, you need a second vector to describe the initial position.
:::

#### Example

So let's look at how we would think about and vizualize two vectors: `A: (3, 2)` and `B: (-1, 3)`:

![Vector vizualization](https://i.imgur.com/4lalG0u.png)

**Note:** vectors have no origin and always originate from (0, 0). If you consider vectors as movements from origin to a point, you can also calculate their length, denoted by l_A and l_B.

### Adding vectors

So let's say you consider vectors as movements, you can simply add two vectors to get the result of doing both movements. For example if you have a vector `A (xa, ya)` and `B (xb, yb)` indicating two movements, what is the result of doing both `A` and `B`? This is visualized like so:

![Vector addition](https://i.imgur.com/YBzf6oO.png)

**Note:** Moving by vector A first and then by B will result in the same vector as moving by B first followed by A. (This is why visualizing vector addition always results in this parallelogram).

:::note Example
You can use calculate things like offsets or knockbacks using addition, i.e where does a unit end after getting knocked back in some direction?
```
newUnitPos = unitPos + knockbackVector
```
:::

### Subtracting vectors

Now let's say we want to know the inverse question to the previous one: Assuming I have two vector positions `A` and `B`, what movement do I have to do to get from `A` to `B`? The answer to this is a vector subtraction: `C = B - A`. Note that this works exactly like regular math, so doing `A + C = B`:

![Vector subtraction](https://i.imgur.com/Sa4gnxz.png)

**Note:** Just like when subtracting regular numbers, order matters! `B - A` gives the vector from `A` to `B`, while `A - B` gives the opposite vector, from `B` to `A`.

:::note Example
You can use vector subtraction to calculate the difference in position between two units, and get for example the distance between them:
```
distanceBetweenUnit1AndUnit2 = length(unit2Pos - unit1Pos)
```
:::

### Multiplying vectors

The last 'basic' vector operation I want to go over is multiplication with a number (NOT with another vector).

When multiplying a vector with a number it retains its direction, but its length is multiplied by this number:

![Vector multiplication](https://i.imgur.com/1h83sJr.png)

:::note Example
You can use vector multiplication to rescale vectors to a certain length. For example when you have a unit or normal vector (length 1), multiplying with a number will make it that length.
```
vectorOfLength100 = vectorOfLength1 * 100
```
:::

### Vectors as Direction/Orientation

As seen before, vectors look very much like a direction to somewhere. This makes them very useful for representing the orientation of something instead of using an angle (because angles make calculating much more difficult).

To do so, orientation is often expressed as vectors of length 1. This is because of the special relation vectors have with angles: For an angle `a`, `(cos(a), sin(a))` is a vector of length 1, pointing in the direction of angle `a`:

![Vectors and angles](https://i.imgur.com/vjW0ye7.png)

You might be wondering what the point of this is, for an application if why storing orientation as vectors of length 1 see section 'Spawning an item in front of the player'.

### Dot product

The final vector concept for this tutorial is the 'dot product' of two vectors. Simply put, this dot product gives you a measure of 'how much vectors are pointing in the same direction'. If two vectors (of length 1) point in exactly the same direction, the dot product is 1. If two vectors (of length 1) point in exactly the opposite direction the dot product is -1. If the two vectors are at a 90 degree angle, the dot product is 0:

![Dot product](https://i.imgur.com/erBE2yl.png)

:::note
Technically `dot(A, B) = length(A) * length(B) * cos(angle)`, so watch out when calculating the dot product of non-length-1 vectors: they will no longer range from -1 to 1.
:::

### Normalization

As mentioned shown above it is often very useful to have vectors of length 1 (only the direction, not the distance). This is so common there is a standard procedure to calculate this: Normalization. When normalizing a vector you simply divide it by its length (or multiply with 1/length). This will always give you a vector of length 1.

:::note
Vectors with length 1 are referred to as 'Normal' vectors.
:::

## Vector math in games

### Spawning an item in front of the player

Let's say we want to spawn an item 100 units in front of a player hero, how do we calculate this location `A`?

We can visualize this question like this:

![Spawning in front of a player](https://i.imgur.com/1ksId50.png)

Referencing this visualization it is obvious we can calculate this A as follows:

<MultiCodeBlock group="vscripts">

```lua
    -- Calculate the vector from the hero to the point by multiplying
    -- their forward vector (length 1) with the desired distance.
    local heroToPoint = hero:GetForwardVector() * 100
    -- Calculate world position  of the item by adding the vector
    -- from hero to point to the world position of the hero
    local itemPos = hero:GetAbsOrigin() + heroToPoint
```

```ts
    // Calculate the vector from the hero to the point by multiplying
    // their forward vector (length 1) with the desired distance.
    const heroToPoint = hero.GetForwardVector() * 100 as Vector;
    // Calculate world position  of the item by adding the vector
    // from hero to point to the world position of the hero
    const itemPos = hero.GetAbsOrigin() + heroToPoint as Vector;
```

</MultiCodeBlock>

### Checking if unit is facing a direction

Another common question is how can we calculate if my unit is facing a specific point on the map.

We visualize this problem like this:

![Facing point?](https://i.imgur.com/iBH3cIk.png)

So looking at the visualization, when does a unit face point P? Well it looks like this happens when their forward vector (the orange one) aligns with the vector from the unit to the point (the purple one). So capturing this in code would look a little like this:

<MultiCodeBlock group="vscripts">

```lua
function isUnitFacingPoint(unit, point)
    -- Calculate the relative position of the unit to the point
    local relativePosition = point - unit:GetAbsOrigin()
    -- Remember, using dot product works best with normal vectors
    -- The unit's forward is already normal, but we need to normalize
    -- the relative position to only get its direction.
    local directionToPoint = relativePosition:Normalized()

    -- Check if the alignment of the forward vector and relative direction
    -- is within some acceptable range of tolerance
    return unit:GetForwardVector():Dot(directionToPoint) > 0.7
end
```

```ts
function isUnitFacingPoint(unit: CDOTA_BaseNPC, point: Vector): boolean {
    // Calculate the relative position of the unit to the point
    const relativePosition = point - unit.GetAbsOrigin() as Vector;
    // Remember, using dot product works best with normal vectors
    // The unit's forward is already normal, but we need to normalize
    // the relative position to only get its direction.
    const relativeDirection = relativePosition.Normalized();

    // Check if the alignment of the forward vector and relative direction
    // is within some acceptable range of tolerance
    return unit.GetForwardVector().Dot(relativeDirection) > 0.7;
}
```

</MultiCodeBlock>

### Checking if unit is attacked from behind

This question is similar to the previous question, only now there are two units facing in different ways:

![Attacking from behind](https://i.imgur.com/uLT3QzQ.png)

Looking at this drawing it becomes obvious that the forward vector of unit 2 (F2) actually does **not** matter. What matters is the angle (dot product) between the forward vector of the unit getting attacked, and the where the attack is coming from (the vector from unit 2 to unit 1: `P1 - P2`)

<MultiCodeBlock group="vscripts">

```lua
function isAttackedFromBehind(victim, attacker)
    -- Calculate the relative position from attacker to victim (P1 - P2)
    local relativePosition = victim:GetAbsOrigin() - attacker:GetAbsOrigin()
    -- Normalize relative position to get attack direction
    local attackDirection = relativePosition:Normalized()
    -- Get the forward vector of the victim
    local victimForward = victim:GetForwardVector()

    -- Check if both normal(!) vectors are pointing in the same direction
    return victimForward:Dot(attackDirection) > 0.7
end
```

```ts
function isAttackedFromBehind(victim: CDOTA_BaseNPC, attacker: CDOTA_BaseNPC): boolean {
    // Calculate the relative position from attacker to victim (P1 - P2)
    const relativePosition = victim.GetAbsOrigin() - attacker.GetAbsOrigin() as Vector;
    // Normalize relative position to get attack direction
    const attackDirection = relativePosition.Normalized();
    // Get the forward vector of the victim
    const victimForward = victim.GetForwardVector();

    // Check if both normal(!) vectors are pointing in the same direction
    return victimForward.Dot(attackDirection) > 0.7;
}
```

</MultiCodeBlock>

### Creating some effects around player

Consider the case where you want multiple things to happen evenly spaced in a circle around the player character. We can visualize it as follows:

![Circular effect](https://i.imgur.com/TOqC1Ly.png)

By now it should be obvious we need to add the green vectors to the player position, the question is however how do you calculate these green vectors?

What we can simply do is divide the full circle radius (2 * pi) by the number of points we want to use, and then for each angle calculate the unit vector from the angle, multiply it with the desired length and add it to the player position:

<MultiCodeBlock group="vscripts">

```lua
-- Calculate the angle between each point on the circle
-- (This is in radians, the full circle is 2*pi radians)
local angle = 2 * math.pi / numPoints

for i=1,numPoints do
    -- Create direction vector from the angle
    local direction = Vector(math.cos(angle * i), math.sin(angle * i))
    -- Multiply the direction (length 1) with the desired radius of the circle
    local circlePoint = direction * radius

    -- Add the calculated green vector to the player position and do something
    doSomething(player:GetAbsOrigin() + circlePoint)
end
```

```ts
// Calculate the angle between each point on the circle
// (This is in radians, the full circle is 2*pi radians)
const angle = 2 * Math.PI / numPoints;

for (let i = 0; i < numPoints; i++) {
    // Create direction vector from the angle
    const direction = Vector(Math.cos(angle * i), Math.sin(angle * i));
    // Multiply the direction (length 1) with the desired radius of the circle
    const circlePoint = direction * radius as Vector;

    // Add the calculated green vector to the player position and do something
    doSomething(player:GetAbsOrigin() + circlePoint);
}
```

</MultiCodeBlock>

### Physics with vectors - Homing projectile

As you have seen vector math is quite powerful and can be used to express positional and movement concepts in simple statements. In this final example I will show how to a simple 'physics' simulation to create a homing projectile.

We will express the projectile using two vectors: `position` and `velocity`. This makes the projectile unable to instantly change its direction, but suffer some inertia: it will home in on the player on every tick, but it cannot easily slow down or change direction:

![](https://i.imgur.com/GVK8Nbo.png)

To achieve this effect we simply 'accelerate' the velocity of the projectile towards the player on every update, so the velocity turns towards the player a little bit every update. We then simply update the position based on the current velocity:

<MultiCodeBlock group="vscripts">

```lua
function updateProjectile(projectile, target)
    -- Calculate direction from projectile to target
    local relativeTargetPos = target:GetAbsOrigin() - projectile:GetAbsOrigin()
    local targetDirection = relativeTargetPos:Normalized()

    -- Now we update the projectile velocity to point more to the target
    -- Note: you can increase/decrease acceleration to make it change direction
    -- faster or slower
    projectile.velocity = projectile.velocity + targetDirection * acceleration

    -- Next we update the projectile position by simply adding the velocity
    projectile.position = projectile.position + projectile.velocity
end
```

```ts
function updateProjectile(projectile: Projectile, target: CDOTA_BaseNPC): void {
    // Calculate direction from projectile to target
    let relativeTargetPos = target.GetAbsOrigin() - projectile.GetAbsOrigin() as Vector;
    let targetDirection = relativeTargetPos.Normalized();

    // Now we update the projectile velocity to point more to the target
    // Note: you can increase/decrease acceleration to make it change direction
    // faster or slower
    projectile.velocity = projectile.velocity + targetDirection * acceleration;

    // Next we update the projectile position by simply adding the velocity
    projectile.position = projectile.position + projectile.velocity;
}
```

</MultiCodeBlock>
