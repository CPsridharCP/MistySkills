## Hello World

Welcome to the Misty Hello World tutorial series! These tutorials teach how to write and upload a JavaScript skill that brings Misty (and your code) to life. If this is your first time writing a skill for Misty, this is a great place to start.

### Overview

The Hello World tutorial series is divided into six parts:

1. Moving Misty's Head
2. Changing Misty's Chest LED
3. Playing Sounds
4. Driving Misty
5. Moving Misty's Arms
6. Using Face Recognition

The first section provides instructions on how to create and upload the files Misty needs to run a skill. As you progress through the series, you add new lines of code to the original skill file and update the skill on Misty to see how the additions change her behavior. When you finish all of the sections, you have a complete working Hello World skill for Misty.

### Moving Misty's Head

This part of the Hello World tutorial series teaches how to create skill files and upload them to Misty. You'll also write your first lines of code and teach Misty to move her head in a lifelike way.

---

Each skill you write with Misty's JavaScript SDK requires the following elements:

* a JavaScript "code" file with the logic and commands that Misty executes
* a JSON file "meta" file that provides the initial settings and parameters Misty needs to run the skill

To begin, open your favorite text editor. (If you don't have a preference, we suggest Visual Studio Code.) Create a new JavaScript file called `HelloWorld.js`, and save this file to a new directory called `HelloWorld`. Now you can start writing the code to bring Misty to life.

To appear lifelike, Misty's head movement should be spontaneous and random. You can achieve this by registering for a "timer" event and configuring it to invoke a callback function after a random interval of time. This callback function sends Misty a head movement command with randomized movement values.

Because the Hello World skill uses random integers throughout, you can start by declaring a helper function called `getRandomInt()`. This function uses the built-in `Math.floor()` and `Math.random()` JavaScript methods to return a random integer. Declare this function at the top of your `HelloWorld` code file:

```JavaScript
// Returns a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

Next, use the `misty.RegisterTimerEvent()` method to register for a new timed event. The syntax for this method is as follows:

```JavaScript
// Syntax
misty.RegisterTimerEvent(string eventName, int callbackTimeInMs, [bool keepAlive], [string callbackRule], [string skillToCall], [int prePauseMs], [int postPauseMs]);
```
The `eventName` argument sets the name of the registered event. The `callbackTimeInMs` argument sets the duration before the event triggers, and `keepAlive` sets whether Misty should remain registered for this event after it triggers a callback function.

Copy the following into your `HelloWorld` skill code to register for a timer event with the name `look_around` that invokes a callback every 5000 - 10000 milliseconds. Set `keepAlive` to `false`, and ignore the rest of the arguments:

```JavaScript
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
```

By default, timer events you create with the `misty.RegisterTimerEvent()` method invoke a callback function with the same `eventName`, prefixed with an underscore. In this case, the callback function is called `_look_around()`. Declare this function in your skill code:

```JavaScript
// The look_around timer event invokes this callback function.
function _look_around(repeat = true) {

}
```

You can place the code to move Misty's head inside the `_look_around()` callback function. 

Misty's neck has three movement axes -- pitch (tilt up/down), roll (tilt left/right), and yaw (turn left/right). You can move Misty's head to a new position by using the `misty.MoveHeadPosition()` method. The syntax for this method is as follows:

```JavaScript
// Syntax
misty.MoveHeadPosition(double pitch, double roll, double yaw, double velocity, [int prePauseMs], [int postPauseMs]);
```

The value range for the `pitch`, `roll`, and `yaw` position arguments is `-5` to `5`. To achieve spontaneous head movement, we use the `getRandomInt()` helper function to return unique values for these position arguments each time Misty calls the `misty.MoveHeadPosition()` method.

Copy the `misty.MoveHeadPosition()` argument into the `_look_around()` callback function:

```JavaScript
function _look_around(repeat = true) {

    // Moves Misty's head to a random position. Adjust the min/max
    // values passed into getRandomInt() to change Misty's range of
    // motion when she calls this method.
    misty.MoveHeadPosition(
        getRandomInt(-5, 5), // Random pitch position between -5 and 5
        getRandomInt(-5, 5), // Random roll position between -5 and 5
        getRandomInt(-5, 5), // Random yaw position between -5 and 5
        300); // Head movement velocity. Decrease for slower movement.
}
```

Misty should continue moving her head until the Hello World skill ends. To do this, you can use the `misty.RegisterTimerEvent()` method inside the `look_around()` event callback to create a loop where Misty re-registers for the `look_around` event each time the callback executes.

Copy the conditional block below into your `_look_around()` callback function. As long as `repeat` is set to `true`, Misty runs the head movement command on a loop until the skill ends.

```JavaScript
function _look_around(repeat = true) {

    // Moves Misty's head to a random position. Adjust the min/max
    // values passed into getRandomInt() to change Misty's range of
    // motion when she calls this method.
    misty.MoveHeadPosition(
        getRandomInt(-5, 5), // Random pitch position between -5 and 5
        getRandomInt(-5, 5), // Random roll position between -5 and 5
        getRandomInt(-5, 5), // Random yaw position between -5 and 5
        300); // Head movement velocity. Decrease for slower movement.

        // If repeat is set to true, re-registers for the look_around
        // timer event, and Misty moves her head until the skill ends.
        if (repeat) misty.RegisterTimerEvent(
        "look_around",
        getRandomInt(5, 10) * 1000,
        false);
}
```

The next step is to call the `misty.Debug()` method at the beginning of your skill code with a message to indicate the skill is starting. The `misty.Debug()` method prints messages to debug listeners, and you can use it to locate issues as you develop Misty's skills.

Copy the following into the beginning of your skill code:

```JavaScript
// Sends a message to debug listeners
misty.Debug("The HelloWorld skill is starting!")
```

The code file is complete! At this point, the contents of your `HelloWorld.js` file should look look like this:

```JavaScript
// Sends a message to debug listeners
misty.Debug("The HelloWorld skill is starting!")

// Returns a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The look_around timer event invokes this callback function. Change
// the value of repeat to false if Misty should only move her head once.
function _look_around(repeat = true) {

    // Moves Misty's head to a random position. Adjust the min/max
    // values passed into getRandomInt() to change Misty's range of
    // motion when she calls this method.
    misty.MoveHeadPosition(
        getRandomInt(-5, 5), // Random pitch position between -5 and 5
        getRandomInt(-5, 5), // Random roll position between -5 and 5
        getRandomInt(-5, 5), // Random yaw position between -5 and 5
        300); // Head movement velocity. Decrease for slower movement.

        // If repeat is set to true, re-registers for the look_around
        // timer event, and Misty moves her head until the skill ends.
        if (repeat) misty.RegisterTimerEvent(
        "look_around",
        getRandomInt(5, 10) * 1000,
        false);
}

// Registers for a timer event with called look_around, and invokes the
// _look_around() callback every 5000 - 10000 milliseconds.
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
```

Next we create the JSON meta file and install the skill on Misty. Follow these steps to generate a JSON file for your Hello World skill:

1. Open the [Skill Runner](http://sdk.mistyrobotics.com/skill-runner/) web page in a new browser window and find the section called **Generate**.
2. Type `HelloWorld` in the **New Skill Name** field.
3. Select the option to **Download** option and click **Generate JSON Meta Template**.
4. Locate the downloaded `HelloWorld.json` file save it to the `HelloWorld` directory you created for this skill earlier.
5. Open the `HelloWorld.json` file in your text editor. It should look something like this:
```JSON
{
    "Name": "HelloWorld",
    "UniqueId": "f1a3b79a-4942-4133-9e4c-92aa9643c378",
    "Description": "My skill is amazing!",
    "StartupRules": [
        "Manual",
        "Robot"
    ],
    "Language": "javascript",
    "BroadcastMode": "verbose",
    "TimeoutInSeconds": 600,
    "CleanupOnCancel": false,
    "WriteToLog": false,
    "Parameters": {
        "int": 10,
        "double": 20.5,
        "string": "twenty"
    }
}
```

Make sure the value of the `"Name"` parameter is `"HelloWorld"`. The value of `"UniqueId"` is randomized for each meta file the Skill Runner generates, and should be unique for each skill on your robot. The `"TimeOutInSeconds"` parameter describes how long the skill runs (in seconds) before Misty automatically cancels it.

With the meta file saved, you're ready to install your skill on Misty. Follow these steps to do so:

1. In the [Skill Runner](http://sdk.mistyrobotics.com/skill-runner/) web page, type Misty’s IP address into the Robot IP Address field in the upper right hand corner. (You can find Misty's IP address in the Misty App.) Click **Connect**.
2. Once the connection is established, find the **Install** section on the Skill Runner page. Click **Choose files** and navigate to the `HelloWorld` directory where you saved the `HelloWorld.js` and `HelloWorld.json` files. Select both files and click **Open**.
3. The skill takes a few seconds to upload. When the upload is complete, your new `HelloWorld` skill appears under the **Manage** section of the Skill Runner page. Find it and click **Start** to begin execution!

**Note:** The Skill Runner web page prints additional information from the skills running on Misty (including debug messages) to your browser's web console. To open the web console in Chrome, use **Ctrl + Shift + J** (Windows/Linux) or **Cmd + Option + J** (Mac).
