---
title: "All-In Poker App"
date: 2026-11-15 22:02:20 +0900
---

It is true that poker solvers are there and those are very good. But if you want to make an app within 20mb, then you can't fit in a poker solver (probably will bloat the app to multiple GBs). Also there are a few papers that kind of have the weights for more than 3 players. 

The first version of Poker App that I built, didn't have memory and just applied GTO probablity against a random hand. The second version improved this with some level of check based on the bot's guess on my range and bot's own personality (calling station, NIT, TAG, LAG etc.). 

But this wasn't good enough, because the Bots should adapt to my style and not just play their style in a silo. Because I could easily exploit them. Just keep raising every hand and you would easily win. If a bot raises, then just fold unless you have a good hand. Yes you will lose the raised amount in the pot, but you would win 10 big blinds for every 2.5 big blinds you lose. 

So every place I searched for said this is why I need like a giant neural network and poker AI etc. These weren't an option for me as I wanted the app to be snappy and resemble strong human players. 

What I had was:
1. The bots own personality. 
2. Their ability to judge my personality (based on VPIP (Voluntarily Put In Pot) and PFR (Pre-flop-raise)). 
3. Observable hands of both me and the other bots. 

I decided to use baysian statistics fused with multi-arm bandid slot machine algo. Basically the bots start with a prior on the other bots and me. They also have their own propensity to call, raise, fold based on their personality. What it does is it tightens or losens the range at which they can call or bluff. They also bluff sometimes based on their personality. And if they get caught, they tighten their range to bluff or their frequency to bluff or both. And these keep get updating based on the results of their future bluff. 

Also when they play you or the other bots, they update their priors on what is your type and what is your bluffing potential. And even if they think you are a NIT and so they should trust your value bet, like multi arm bandit, once in a while they will deviate and play non-optimally. If they catch you, then they update their view of you and call you more often. 

After making these changes, the bots are so damn difficult to beat. It is incredibly human like. 

Try it yourself: [Download APK](https://github.com/ganeshapp/all-in-app/releases/download/v0.8.2/allin-0.8.2-arm64-v8a.apk)

Repo: [All-in App](https://github.com/ganeshapp/all-in-app)