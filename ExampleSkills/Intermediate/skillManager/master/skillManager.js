/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

// This skill is set to start on Misty boot-up by default (in the JSON check StartupRules) 
// Use this skill to turn on any number of your other skills

// Example:
// At start       : Changes Chest LED red 
// After 1 second : Starts skill "Child 1" which turns the cheast LED green
// After 2 seconds: Starts skill "Child 2" which turns the cheast LED blue

misty.Debug("Skill Manager Start");

misty.ChangeLED(255, 0, 0);
misty.Pause(1000);

// Child  1
misty.RunSkill("47819fb3-bd24-4650-92d5-c3e6fc3d43d6");
misty.Pause(1000);

// Child 2
misty.RunSkill("632b72a9-7dc5-4dfc-94de-6a686377b0b1");