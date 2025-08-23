# Lift-simulation
A simple simulation of escalators built using vanilla JavaScript, HTML, and CSS. Created as part of the RDS onboarding task

# Requirements
  1. Have a page where you input the number of floors and lifts from the user
  2. An interactive UI is generated, where we have visual depictions of lifts and buttons on floors
  3. Upon clicking a particular button on the floor, the lift goes to that floor

  Milestone 1:
   - A data store that contains the state of your application data
   - JS Engine that is the controller for which lift goes where
   - Dumb UI that responds to the controller's commands
   
  Milestone 2:
   - Lift having doors open in 2.5s, then closing in another 2.5s
   - Lift moving at 2s per floor
   - Lift stopping at every floor where it was called
   - Mobile-friendly design

Common pitfalls:
  - Lift can only work with at least two floors
  - The number of Lifts and the Number of Floors cannot be input as negative or zero.
  - Only the button pressed should be disabled
