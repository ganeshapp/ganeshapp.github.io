---
title: "All-In · Poker Dojo"
date: 2026-07-01
excerpt_text: "Learn poker properly, with a coach that explains itself in plain English."
teaser: /assets/images/projects/poker.jpg
permalink: /projects/poker/
---

[All-In · Poker Dojo](/poker/) is a free Texas Hold'em trainer for people who want to actually get better at the game, not just pass the time. You sit at a six-seat table, play hands against five bots with different personalities, and after every decision a coach tells you whether it made money — and explains why, in ordinary words.

It runs in your browser, or as a proper desktop app on Mac, Windows and Linux. No account, no ads, no real money, nothing sent anywhere. Everything you play stays on your own machine.

[Play it in your browser](/poker/) · [Download for desktop](https://github.com/ganeshapp/poker/releases/latest)

![The table, with the coach explaining a decision](/assets/images/projects/poker-01-coach.jpg)

## Why I built it

Most poker software does one of two things. It deals you cards and lets you click buttons — fun, but you learn nothing, because nobody ever tells you the hand you just won was a bad call that got lucky. Or it buries you in charts written by professionals for professionals, where a sentence like *"you're laying a caller 20% — the equity they need to call"* is apparently meant to be self-explanatory.

I showed that exact sentence to a few people who play poker socially. Not one of them could tell me what it meant.

So I wanted the third thing: software that plays a real hand with you and then explains the decision the way a patient friend would. Not dumbed down — all the maths is still there if you want it — just said in words a beginner can follow. Every explanation in the app now starts as a plain sentence. If you want the arithmetic, you open it. If you want the deeper reasoning, that's another click down.

## The coach talks like a person

Here's a real note from the screenshot above, word for word:

> You paid 1 bb to win a pot of 2.5 bb — you need to win about 1 time in 2.5. Your hand wins about 1 time in 7 — not enough. Over time this call loses money; folding is better.

That's it. No vocabulary test. *(A "bb" is one big blind, the forced bet that starts each hand. Poker measures everything in big blinds so the advice reads the same whether you're playing for matchsticks or money.)*

Underneath that sentence sits **Show me the math** — the four lines of arithmetic that produced the verdict, so you can check the coach rather than trust it. Under *that* sits **Expert detail**, for when you want the version a serious player would say.

The coach grades every decision you make: folds, calls, raises, and the checks where you should have bet. It also reads the bots for you — ask it why a player just raised and it will tell you what that action usually means.

## You see everyone's cards at the end of every hand

![Every player's cards revealed at the end of a hand](/assets/images/projects/poker-07-reveal.jpg)

This is the feature I most wanted for myself. In a real game, the players who fold muck their cards face-down and you never find out what you were up against — which is exactly the information you need to learn from the hand.

Here, when a hand ends, every player's cards turn face-up, folders included, each with a line saying what they did and why. "Folded before the flop — too weak to play from under the gun." Over a few hundred hands you stop guessing what other people are holding and start knowing.

Nothing is revealed while the hand is still live, so the game stays honest.

## Four ways to use it

### Play

![The table](/assets/images/projects/poker-02-table.jpg)

Full hands against five bots, each with a different style — one plays far too many hands, one only plays premium cards, one calls everything. You can step through the action one player at a time to see what's happening, or let it run at speed. Before you act, you can guess what a specific opponent is holding and get scored on how close you were.

### Drills

![A drill spot with the hand replayed step by step](/assets/images/projects/poker-03-drills.jpg)

Chess-puzzle-style practice: one decision, instant feedback, a rating that goes up and down with you and quietly gets harder as you improve. There are drills for standard play, for short stacks (when you're down to a few big blinds and the choice is push or fold), for exploiting specific opponent types, and a Review queue that re-serves your own past mistakes until you stop making them.

### Study

![The 31-lesson course, starting from which hand beats which](/assets/images/projects/poker-04-study.jpg)

A 31-lesson course, from "which hand beats which" up to the genuinely advanced stuff, with a running progress bar so you can see where you are. Every lesson is short, and any term you don't recognise has a dotted underline — hover it for a definition.

The lessons with numbers in them come with a calculator you can drag. Change the pot, change the bet, and watch the answer move:

![A lesson with a draggable calculator](/assets/images/projects/poker-05-lesson.jpg)

### Stats

![Progress tracking](/assets/images/projects/poker-06-stats.jpg)

Your results over time, but more usefully: how you do against each type of opponent, how accurate your reads are, and a coaching review that names the specific leaks in your game in one sentence each ("you call too wide for the pot odds — fold your weakest hands more"). You can replay any hand you've played, step by step.

## The details that matter

- **Free, and free of nonsense.** No account, no subscription, no ads, no real money, no upsells.
- **Genuinely offline.** Once installed it never needs the internet. Nothing you play is uploaded anywhere.
- **Honest about itself.** The About page inside the app explains exactly where each "right answer" comes from and how much to trust it. Some verdicts are near-certain maths; others are estimates, and it says so.
- **Play at your own table.** Heads-up, 6-max or 9-max, with or without antes.
- **Keyboard-friendly.** Play a whole session without touching the mouse.
- **Light and dark mode**, and a four-colour deck if you find suits hard to tell apart.

## Getting it

Play it right now in your browser at [gapp.in/poker](/poker/) — nothing to install.

For the desktop version, grab the installer for your machine from the [releases page](https://github.com/ganeshapp/poker/releases/latest). It's the same app, a bit faster, and it keeps your history in a proper database on your machine.

The code is open source at [github.com/ganeshapp/poker](https://github.com/ganeshapp/poker) if you want to look under the hood or tell me what's wrong with it.
