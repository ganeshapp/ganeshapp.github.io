---
title: "A chess app that actually works"
date: 2026-11-20 17:30:43 +0900
---

I started playing Chess when I was 6 or 7 years old. But mostly it was with my brother or the chess game on my DOS machine. But I wasn't very good at it. I never learned any theory and I didn't like to calculate a lot. I played on intuition and pattern on the board and mostly relied on tactics and had very poor strategy.

I really got good at Chess in my high school days. It was part of daily ritual: get back from school by 4pm, have some snacks and go to Valmiki Nagar beach (4th Seaward road), play 2 hours of beach football and then head to the roof of Arul's apartment and play Chess with Adi and Arul for an hour or so and discuss all things math and programing and music and all that. 

Arul had a chess coach. Adi was deligent and tried to learn opening theory to improve his game. I neither had a coach, nor the patience to learn theory (my strength was trash talking. Playing mind games). But I could hold my own. I think we all consistently beat each other and no one was dominating. 

Then during collage came the era of smart phones and I had a chess app. There was no lichess or chess.org that time. It was a local app and had some algo to play good moves. But it wasn't natural. If you selected a weaker level for the bot, it would play 10 good moves and then play a terrible unnatural move to compensate for the strength. But I still loved playing on it. I would play like 10-15 games a day. 

Then when I started working, Chess.com was launched. It was great. I loved playing on it. Playing humans was much better than playing bots. I wasn't bad. I used to be around 1900 rating in Chess.com. And then when lichess was started around 2010-2011, I moved to lichess.org. 

I was so addicted to playing bullet games on lichess that I would end up playing 20-30 games a day. And then feel guilty and delete my account and then repeat. 

Over the years my opening theory got better. My tactics got better. And chasing rating, I started playing very solid. But it wasn't exciting chess. It wasn't the school days creative chess. I played few openings (Ponziani, Advanced fresh defence etc.). I didn't take any risks and would just grind down to end game. I never took the risk of giving opponent a chance to play tactics. Just lockdown the position and exchange peices and play the boring end game. In a bullet game, end game is more about 80% good move in 20% of the time, than 100% good move in 100% of the time. Most of my wins would come flagging the other guy for time. 

But clearly this wasn't really improving my chess even though my rating was higher. 

So I thought about what would a good chess app be:
1. work offline and not be a competition. 
2. offer both Standard chess and Chess 960.
3. play like a human. 
4. have an option see the evaluation bar during the game, so you can know when opponent made a mistake and punish them.  
5. puzzles by theme and from your own mistakes
6. post game analysis which is intuitive like Chess.com. Lichess' centipawn loss is too technical. 
7. allow you to play a particular opening, so you can train on all lines that a 1900 or a 2000 or a 2100 player would normally play.

The most important feature is the ability to see the eval bar while playing. It is an extension of puzzles solving. When you do puzzles, you already know there is a good move and you have to find it. While playing a game, you don't know that. Most times you might just have to play a normal move because opponent didn't make a mistake that opens up opportunity for tactics. By integrating the eval bar, when you see a major drop in eval, you know there is something you should find.

Once you are trained to do that, then you can slowly reduce the visbility of the eval bar (only show it when opponent makes a blunder). And gradually never use the eval bar. 

This requires two chess engines. Stockfish for the observer and reviewer role. And Maia for playing like a human of a particular rating. Maia has been trained on millions of games from lichess database. And so playing a particular rated Maia, mimics playing humans of that rating. 

Another thing is to make the app as lite as possible. With so many engines and internally stored puzzles, it might get very bloated. 

For the design it should focus on functionality and not gaming (like daily check in and other addictive elements). 

In the future, phase 2 can be to nudge the user to play like Tal. Aggressive and Creative. 