# Hello World

Welcome to the Misty Hello World tutorial series! These tutorials teach how to write and upload a JavaScript skill that brings Misty (and your code) to life. If this is your first time writing a skill for Misty, this is a great place to start.

## Overview

The Hello World tutorial series is divided into six parts:

1. Moving Misty's Head
2. Changing Misty's Chest LED
3. Playing Sounds
4. Driving Misty
5. Moving Misty's Arms
6. Using Face Recognition

In addition to teaching how to write your first lines of code, the first tutorial (Moving Misty's Head) provides instructions on how to create and upload the necessary files to run a skill. As you progress through the series, you'll modify the files you create in Part 1. Each section adds new lines of code to the original skill file, and you can upload the new code to observe how the additions change Misty's behavior. After you complete all all the sections, you'll have a fully working Hello World skill for Misty.

## Moving Misty's Head

This part of the Hello World tutorial series teaches how to create your skill files and upload them to Misty. You'll also write your first lines of code and teach Misty to move her head in a lifelike way. Let's get started!

---

Each skill you write with Misty's JavaScript SDK requires the following elements:

* a JavaScript "code" file with the logic and commands that Misty executes
* a JSON file "meta" file that provides the initial settings and parameters Misty needs to run the skill.

1. To begin, open your favorite text editor (if you don't have a preference, we suggest Visual Studio Code) and create a new file called `HelloWorld.js` file. Save this file to a new directory called `HelloWorld`.

2. Declare a new function called `getRandomInt()` that uses the built-in `Math.floor()` and `Math.random()` JavaScript methods to return a random integer between two numbers. We use this function to help randomize Misty's movement patterns and make them seem more lifelike. You can copy the function definition here:

```JavaScript
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

In the first part of our Hello World skill, Misty continuously moves her head in a random pattern, as though she is looking around and examining her new environment. This involves three main pieces of code:

* a timer function from Misty's JavaScript API, which we use to repeatedly trigger a callback function
* a callback function, where we write the code that