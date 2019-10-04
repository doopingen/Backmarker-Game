# LifeF1 - Qualify For San Marino

**Backmarker: A slower car, usually in the process of being lapped by the leaders**

Pure racing...just casual. The back of the pack is not whack!

With Backmarker, you're racing with the best... and staying out of their way you jackass!

All you gotta do is bring it back in one piece k?

**Foundation:**

The game was built using 2d Canvas, HTML, CSS and Vanilla JS

**Controls:** 

Controls
* UP ARROW: The Accelerator
* DOWN ARROW: The Brake
* LEFT ARROW: Steer Left
* RIGHT ARROW:Steer Right:
* SPACE BAR: Start a new game

**Game Inspiration:**

This game is inspired by the hilarious ineptitude of the Life Racing Engines team’s short F1 career. The team was an italian constructor who competed very unsuccessfully in the 1990s F1 season. The team was founded by Ernesto Vita and used Gary Brabham and Bruno Giacomelli as drivers. 

Check out this link to get more backstory on [Life Racing Engines](https://en.wikipedia.org/wiki/Life_Racing_Engines).

The general concept of the game taken from the arcade classic Pole Position which was a favorite of mine growing up. 

**Pseudo 3D Mechanics**

I did my best to emulate the 2.5D physics of Pseudo 3D used by Pole Position.

Pseudo 3D is a projection technique that was used very prominently in racing games in the 1980's and 1990's.  It's Pseudo 3d because it maps 2d geometry on to the game's 2d space, but does so in a way that still makes your brain perceive 3d space.

I used this link extensively to research and setup my code within the program. [Lou's Pseudo 3D page](http://www.extentofthejam.com/pseudo/).

**Premise**

The premise of the game is to make it through the last 50 seconds of the race without getting hit by the faster traffic. You are given indications on screen and you must execute those instructions or you will be hit. Once hit, it's game over my friend. 

**Development Log**

**Day1:** 

I spent a considerable amount of time looking into the various ins and outs with Pseudo 3d. After deciding on a structure I built the function that controls the progressive stepping and offset of the darker colored striping. 

I worked on some wireframing as well to get an idea of how I wanted the game to look

![Wireframing](/img/Wireframe.png)


**Day2** 

After settup up the game's structure, I was able to build the overall concept of the game and start with the Pseudo code. The process was lengthy and throughout the day, I had to figure out how to store my properties and organize my decision making logic. 

Into the evening, I wrote functions that could allow me to use random integers that would used used for the curve animation for the roads. THis would allow the game to automatically switch from straights to curves. 

**Day3**

This is the day that things started to unravel for me. The base Pseudo 3D logic I created earlier was antagonizingly difficult to control. Over the course of the evening, I had to re-write the logic to be more performance friendly and allow for the best possible use of the animation loop used.(requestAnimationFrame). I used the rest of the day to build the reset game logic and game over logic. I worked hard on the scoring system that used the player progress, in seconds played. 

**Day4**

After working into the evening, the readability and overall function of my Pseudo3D base was much better performing and allowed for me to build a more functional and speedy game. I used the day to fix tracking issues with player one on the X, Y plane and started working on the collusion detection and AI logic. I worked into the evening creating the logic for the start screen and event listener (space bar) that would be used to begin a new game. 

**Day5**

With the game coming into focus, I took the game for some test runs and found that my sequencing was not working properly. I made some decisions and decided that my game would be used constructed by triggering events by timer logic. To that effect, I built a switch statement that gave the player a countdown with multiple objectives because of the countdown progress. 

**Day6**

I worked on the project for a total of six actual days. The last day I spent polishing the game logic, hit detection, scoring, and signaling. The majority of the day was spent working with my original art and sprites used in the game. 

**Artwork**

I will be putting some original artwork on here. Just working on the final details right now for that.


