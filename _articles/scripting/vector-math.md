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

Note that in case vectors only have one set of coordinates, so in case they are used to describe a movement they always originate from (0, 0)!.

#### Example

So let's look at how we would think about and vizualize two vectors: `A: (3, 2)` and `B: (-1, 3)`:

![Vector vizualization](https://i.imgur.com/4lalG0u.png)

**Note:** vectors have no origin and always originate from (0, 0). If you consider vectors as movements from origin to a point, you can also calculate their length, denoted by l_A and l_B.

### Adding vectors

So let's say you consider vectors as movements, you can simply add two vectors to get the result of doing both movements. For example if you have a vector `A (xa, ya)` and `B (xb, yb)` indicating two movements, what is the result of doing both `A` and `B`? This is visualized like so:

![Vector addition](https://i.imgur.com/YBzf6oO.png)

**Note:** Moving by vector A first and then by B will result in the same vector as moving by B first followed by A. (This is why visualizing vector addition always results in this parallelogram).

### Subtracting vectors

Now let's say we want to know the inverse question to the previous one: Assuming I have two vector positions `A` and `B`, what movement do I have to do to get from `A` to `B`? The answer to this is a vector subtraction: `C = B - A`. Note that this works exactly like regular math, so doing `A + C = B`:

![Vector subtraction](https://i.imgur.com/Sa4gnxz.png)

**Note:** Just like when subtracting regular numbers, order matters! `B - A` gives the vector from `A` to `B`, while `A - B` gives the opposite vector, from `B` to `A`.

### Multiplying vectors

The last 'basic' vector operation I want to go over is multiplication with a number (NOT with another vector).

When multiplying a vector with a number it retains its direction, but its length is multiplied by this number:

![Vector multiplication](https://i.imgur.com/1h83sJr.png)

### Vectors as Direction/Orientation

As seen before, vectors look very much like a direction to somewhere. This makes them very useful for representing the orientation of something instead of using an angle (because angles make calculating much more difficult).

To do so, orientation is often expressed as vectors of length 1. This is because of the special relation vectors have with angles: For an angle `a`, `(cos(a), sin(a))` is a vector of length 1, pointing in the direction of angle `a`:

![Vectors and angles](https://i.imgur.com/vjW0ye7.png)

**Note:** You might be wondering what the point of this is, for an application if why storing orientation as vectors of length 1 see section 'Spawning an item in front of the player'.

### Dot product

The final vector concept for this tutorial is the 'dot product' of two vectors. Simply put, this dot product gives you a measure of 'how much vectors are pointing in the same direction'. If two vectors (of length 1) point in exactly the same direction, the dot product is 1. If two vectors (of length 1) point in exactly the opposite direction the dot product is -1. If the two vectors are at a 90 degree angle, the dot product is 0:

![Dot product](https://i.imgur.com/sKc8OGd.png)

:::note
Technically `dot(A, B) = length(A) * length(B) * cos(angle)`, so watch out when calculating the dot product of non-length-1 vectors.
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

```ts
    let itemPos = heroPos + heroForward * 100
```

### Checking if unit is facing a direction

Another common question is how can we calculate if my unit is facing a specific point on the map.

We visualize this problem like this:

![Facing point?](https://i.imgur.com/iBH3cIk.png)

So looking at the visualization, when does a unit face point P? Well it looks like this happens when their forward vector (the orange one) aligns with the vector from the unit to the point (the purple one). So capturing this in code would look a little like this:

```ts
function isUnitFacingPoint(unit, point) {
    // Calculate the relative position of the unit to the point
    let relativePosition = point - unit.GetAbsOrigin()
    // Remember, using dot product works best with normal vectors
    // The unit's forward is already normal, but we need to normalize
    // the relative position to only get its direction.
    let relativeDirection = normalize(relativePosition);

    // Check if the alignment of the forward vector and relative direction
    // is within some acceptable range of tolerance
    return dot(unit.GetForwardVector(), relativeDirection) > 0.7;
}
```

### Creating some effects around player

Consider the case where you want multiple things to happen evenly spaced in a circle around the player character. We can visualize it as follows:

![Circular effect](https://i.imgur.com/TOqC1Ly.png)

By now it should be obvious we need to add the green vectors to the player position, the question is however how do you calculate these green vectors?

What we can simply do is divide the full circle radius (2 * pi) by the number of points we want to use, and then for each angle calculate the unit vector from the angle, multiply it with the desired length and add it to the player position:

```ts
// Calculate the angle between two points
let angle = 2 * pi / numPoints;

for (let i = 0; i < numPoints; i++) {
    // Create direction vector from the angle
    let direction = Vector(cos(angle * i), sin(angle * i))
    // Multiply the direction with the desired radius of the circle
    let circlePoint = direction * radius;

    // Add the calculated green vector to the player position and do something
    doSomething(player.GetAbsOrigin() + circlePoint);
}
```

### Physics with vectors - Homing projectile

As you have seen vector math is quite powerful and can be used to express positional and movement concepts in simple statements. In this final example I will show how to a simple 'physics' simulation to create a homing projectile.

We will express the projectile using two vectors: `position` and `velocity`. This makes the projectile unable to instantly change its direction, but suffer some inertia: it will home in on the player on every tick, but it cannot easily slow down or change direction:

![](https://i.imgur.com/GVK8Nbo.png)

To achieve this effect we simply 'accelerate' the velocity of the projectile towards the player on every update, so the velocity turns towards the player a little bit every update. We then simply update the position based on the current velocity:

```ts
function updateProjectile(projectile, target) {
    // Calculate direction from projectile to target
    let relativeTargetPos = target.GetAbsOrigin() - projectile.GetAbsOrigin()
    let targetDirection = normalize(relativeTargetPos)

    // Now we update the projectile velocity to point more to the target
    // Note: you can increase/decrease acceleration to make it change direction
    // faster or slower
    projectile.velocity = projectile.velocity + targetDirection * acceleration

    // Next we update the projectile position by simply adding the velocity
    projectile.position = projectile.position + projectile.velocity
}
```

