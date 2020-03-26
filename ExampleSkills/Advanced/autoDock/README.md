## Docking and Circuit Video; Instructions
[![autoDock](https://i.imgur.com/EwkCDI4.png)](https://www.youtube.com/watch?v=r-NxBS0ZEj0)
[https://www.youtube.com/watch?v=r-NxBS0ZEj0](https://www.youtube.com/watch?v=r-NxBS0ZEj0)
<pre>

This skill enables you to drive Misty on a specific path and dock on the wirless charger. 
Most of the math is handled by the skill and you can directly start writing code for your path.
Misty also stops and resumes path on encountering an obstacle. 

The 4 commands you need: ( ? indicates optional parameter )
_ = drive()    parameters:  (float_distance_in_m, slow? = bool_default_false , hazardFree? = bool_default_false )
_ = turn()     parameters:  (int_angle_in_degrees , hazardFree? = bool_default_false)
_ = dock()     parameters:  (hasGuideRail? = bool_default_false)
_ = undock()   parameters:  None

</pre>

## Commands explained
### Drive 
<pre>
Parameter 1: 
- Distance to drive in m ; can be negative to drive in reverse.
example: _ = drive(1.0); // drives 1m

Parameter 2:  
- An optional boolean indicating if you want to drive real slow for this distance.
- Defaults to false.
- Use true while crossing surface transitions .
example: _ = drive(1.0, slow = true); // drives 1m slow

Parameter 3: 
- An optional boolean indicating if you want to ignore hazards while driving this distance.
- Defaults to false.
- Use true if Misty thinks a rug or surface transition is an obstacle and stops. 
- Forces drive, make sure it is safe for the robot when using it.
example: _ = drive(1.0, slow = false, hazardFree = true); // drives 1m fast ignoring hazards

Note: After every command Misty would attempt to self correct any unintetional angular offset
</pre>

### Turn
<pre>
Parameter 1: 
- Angel offset to turn in degrees. 
- Standard used - CCW; Left is +ve and Right is -ve.
- Only Pivot turns are used. 
example: _ = turn(90); // turns left 90 degrees.

Parameter 2: 
- An optional boolean indicating if you want to ignore hazards while turning.
- Defaults to false.
- Use true if Misty thinks a rug or surface transition is an obstacle and stops. 
- Forces drive, make sure it is safe for the robot when using it.
example: _ = turn(-30, hazardFree = true); // Turns right 30 degrees ignoring hazards

Note: After every command Misty would attempt to self correct any unintetional angular offset
</pre>

### Dock
<pre>
Parameter 1:
- An optional boolean indicating if you are using the 3D printed guide rail on the charging pad.
- Defaults to false.
- You can find the .STL file here: [Update Link]
- Using the guide rail is optional; you could both dock with and without the guide rail.
example: _ = dock(); Docks on the original charging pad
example: _ = dock(hasGuideRail = true); Docks on the charging pad with the guide rail.

Note: Read the setting up procedure below before testing the code
</pre>

### Undock
<pre>
- Takes no paremeters.
- Misty drives in reverse out of the charging pad and turns 180 degrees.
</pre>

## Setting up

<pre>
1. Misty uses passive Infra Red reflectors on the charging pad to track relatve position. 
-  The four circular points around the Misty Robotics logo are the reflectors.
-  Place the charging pad such that the background has minimal IR reflective elements.

2. Misty's tracking performance is best when it is ~0.5m to ~1.5m from the charging pad.
-  Make sure Misty is somewhere in this zone when dock() command is called by the skill.
</pre>
![floorView](https://i.imgur.com/ZEKTBkV.jpg)
<pre>
3. Misty currently only uses the four IR reflectors on the vertical wall of the charger.
-  There are two more IR reflectors on the top surface of the charger. 
-  Cover them with tape so it does not confuse Misty.

4. Relative head position of your robot. 
- This is the most import step and you would only have to do it once for each robot. 
- The 0,0,0 pitch,roll,yaw head position is slightly different in each robot.
- For a successfull docking the glass plane your Misty's visor be look almost parallel 
to the docking station wall that has the 4 passive IR reflectors. 
- Make pitch value slightly higher to make Misty look slightly downwards (maybe +2).
- Find the best PRY values that suit your robot and update ~line37 in the skill .js file.
example: headCenterIdentified(6, 0, 4);
Hint: Use moveHead option in the API explorer from SDK webpage to play around these values. 
</pre>
[http://sdk.mistyrobotics.com/api-explorer/index.html](http://sdk.mistyrobotics.com/api-explorer/index.html)
![headSideView](https://i.imgur.com/dhaaMx9.jpg)
![headTopView](https://i.imgur.com/fv6LVF3.jpg)
![APIExplorer](https://i.imgur.com/7ywA6qn.png)



