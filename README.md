# what's the next class
What's the next class? Stop asking me, just take a glance!

## About
I created this project as I have been really annoyed by the school's class schedule website, despite the software version indicates that it's regularly updated, the developer has made no effort to improve the UI/UX, sticking to the 90s web design instead.

While their web design is terrible, the main reason is still the fact that class schedule constantly changes on every new semester, meaning I would have to use the poorly-designed school class schedule website, where the text would be around 1px on phone since they never implemented the responsive web design modern standards. That said, finding the specific class on the schedule takes too much time. So instead, I've made my own version that only displays your current, previous and the next class all at once.

## How To Use
### Use the Template
The template file is `data-example.json` for English users, you can modify the text into your own language, then rename it to `data.json` for the script to fetch data from.
### Import your Time Schedule
Go to `data.json` and modify the time for each day **in the exact order**, including the start and the end of your class time. For example, if your class starts `08:00` and ends `08:50`, put them in the order like this:
```js
const timeSchedule = [ 08:00, 08:50, 09:00, 09:50, "... etc" ]
```
### Import your Class Table
Go to `data.json` and modify the class names for each day **in the exact order**.
